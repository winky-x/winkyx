
import fastify from 'fastify';
import cors from '@fastify/cors';
import { logger } from './lib/logger';
import { setupWebSocketServer } from './services/websocket';

export function buildServer() {
  const server = fastify({
    logger,
  });

  server.register(cors, {
    // Configure CORS as needed. For local development, this is permissive.
    origin: '*',
  });

  // Health check endpoint
  server.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Setup WebSocket server
  setupWebSocketServer(server.server);

  return server;
}
