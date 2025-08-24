/**
 * @fileoverview Data Service for WinkyX (Web/Mock).
 * This is a placeholder for the web version's data layer.
 * In a real web client with persistence, this might use IndexedDB.
 */

'use strict';

import { saveToStorage, getFromStorage } from '@/lib/storage';

export interface StoredMessage {
  id: string;
  peer_public_key: string;
  from_public_key: string;
  to_public_key: string;
  encrypted_content: string;
  timestamp: number;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  is_sent_by_current_user: boolean;
}

const MESSAGE_KEY_PREFIX = 'winkyx_messages_';
const QUEUE_KEY = 'winkyx_message_queue';

export async function getMessagesForPeer(peerPublicKey: string): Promise<StoredMessage[]> {
  return getFromStorage(`${MESSAGE_KEY_PREFIX}${peerPublicKey}`) || [];
}

export async function saveMessage(message: StoredMessage): Promise<void> {
  const messages = await getMessagesForPeer(message.peer_public_key);
  messages.push(message);
  saveToStorage(`${MESSAGE_KEY_PREFIX}${message.peer_public_key}`, messages);
}

export async function getMessageQueue(): Promise<StoredMessage[]> {
  return getFromStorage(QUEUE_KEY) || [];
}

export async function addMessageToQueue(message: StoredMessage): Promise<void> {
  const queue = await getMessageQueue();
  queue.push(message);
  saveToStorage(QUEUE_KEY, queue);
}

export async function removeMessageFromQueue(messageId: string): Promise<void> {
  let queue = await getMessageQueue();
  queue = queue.filter(msg => msg.id !== messageId);
  saveToStorage(QUEUE_KEY, queue);
}
