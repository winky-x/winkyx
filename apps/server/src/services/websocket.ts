
import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { logger } from '../lib/logger';
import crypto from 'crypto';
import nacl from 'tweetnacl';
import { decodeBase64, encodeUTF8 } from 'tweetnacl-util';

const wssChallengeSecret = process.env.WSS_CHALLENGE_SECRET || 'default-secret';
if (wssChallengeSecret === 'default-secret') {
  logger.warn('Using default WebSocket challenge secret. This is not secure for production.');
}

// In-memory store for authenticated peers on the local network
const authenticatedPeers = new Map<WebSocket, { peerId: string }>();

export function setupWebSocketServer(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on('connection', (ws) => {
    logger.info('WebSocket client connected');

    // 1. Send challenge for authentication
    const challenge = crypto.randomBytes(32).toString('hex');
    ws.send(JSON.stringify({ type: 'challenge', payload: challenge }));

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());

        // 2. Handle authentication response
        if (data.type === 'auth') {
          const { peerId, signature } = data.payload;
          const signatureBytes = decodeBase64(signature);
          const peerIdBytes = decodeBase64(peerId);
          const challengeBytes = encodeUTF8(challenge);

          if (nacl.sign.detached.verify(challengeBytes, signatureBytes, peerIdBytes)) {
            logger.info(`Peer ${peerId} authenticated successfully.`);
            authenticatedPeers.set(ws, { peerId });

            // Announce new peer to all other authenticated peers
            broadcast({
              type: 'peer-joined',
              payload: { peerId },
            }, ws);
            
            ws.send(JSON.stringify({ type: 'auth-success' }));
          } else {
            logger.warn(`Peer ${peerId} authentication failed.`);
            ws.terminate();
          }
        }

        // Handle other message types from authenticated peers
        if (authenticatedPeers.has(ws)) {
            // Echo messages for now, in a real scenario you would handle offers/answers for WebRTC
            broadcast(data, ws);
        }

      } catch (error) {
        logger.error('Failed to handle WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      const peer = authenticatedPeers.get(ws);
      if (peer) {
        logger.info(`Peer ${peer.peerId} disconnected.`);
        authenticatedPeers.delete(ws);
        // Announce peer departure
        broadcast({
          type: 'peer-left',
          payload: { peerId: peer.peerId },
        });
      } else {
         logger.info('Unauthenticated WebSocket client disconnected');
      }
    });

    ws.on('error', (error) => {
      logger.error('WebSocket error:', error);
    });
  });

  logger.info('WebSocket server set up and listening.');
}

function broadcast(data: any, sender?: WebSocket) {
  const message = JSON.stringify(data);
  for (const client of authenticatedPeers.keys()) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}
