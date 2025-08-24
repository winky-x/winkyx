/**
 * @fileoverview Simple in-memory store for discovered peers.
 * In a real app, this might be backed by a database for persistence across sessions.
 */

import type { DiscoveredPeer } from './comms';

let peers = new Map<string, DiscoveredPeer>();

export const addPeer = (peer: DiscoveredPeer) => {
  peers.set(peer.id, peer);
};

export const getPeers = (): DiscoveredPeer[] => {
  return Array.from(peers.values());
};

export const clearPeers = () => {
  peers.clear();
};
