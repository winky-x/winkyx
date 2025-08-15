/**
 * @fileoverview Data Service for WinkyX.
 * Simulates a local database (like SQLite or IndexedDB) for storing messages
 * and managing a message queue for offline sending.
 * For this web-based MVP, it uses localStorage.
 *
 * Exports:
 * - StoredMessage: Type definition for a message in storage.
 * - getMessagesForPeer: Retrieves all messages for a given peer.
 * - saveMessage: Saves a single message to the local store.
 * - getMessageQueue: Retrieves the list of unsent messages.
 * - addMessageToQueue: Adds a message to the send queue.
 * - removeMessageFromQueue: Removes a message from the send queue.
 */

'use an strict';

import { saveToStorage, getFromStorage } from '@/lib/storage';

const MESSAGE_STORE_PREFIX = 'winkyx_messages_';
const MESSAGE_QUEUE_KEY = 'winkyx_message_queue';

// --- Type Definitions ---

export interface StoredMessage {
  id: string;
  fromPublicKey: string; // Base64 public key of sender
  toPublicKey: string;   // Base64 public key of recipient
  encryptedContent: string; // Base64 of EncryptedMessage object
  timestamp: number;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  isSentByCurrentUser: boolean;
}

// --- Message Store Functions ---

function getStorageKeyForPeer(peerPublicKey: string): string {
  return `${MESSAGE_STORE_PREFIX}${peerPublicKey}`;
}

/**
 * Retrieves all messages exchanged with a specific peer.
 * @param peerPublicKey The Base64 public key of the peer.
 * @returns A promise that resolves to an array of StoredMessage objects.
 */
export async function getMessagesForPeer(
  peerPublicKey: string
): Promise<StoredMessage[]> {
  const key = getStorageKeyForPeer(peerPublicKey);
  const messages = getFromStorage(key);
  return Array.isArray(messages) ? messages : [];
}

/**
 * Saves a message to the local store for a specific peer conversation.
 * @param message The message object to save.
 * @param peerPublicKey The Base64 public key of the peer in the conversation.
 * @returns A promise that resolves when the message is saved.
 */
export async function saveMessage(
  message: StoredMessage,
  peerPublicKey: string
): Promise<void> {
  const key = getStorageKeyForPeer(peerPublicKey);
  const messages = await getMessagesForPeer(peerPublicKey);
  // Avoid duplicates
  if (!messages.find(m => m.id === message.id)) {
    messages.push(message);
    saveToStorage(key, messages);
  }
}

// --- Message Queue Functions ---

/**
 * Retrieves the current message queue from storage.
 * @returns A promise that resolves to an array of StoredMessage objects.
 */
export async function getMessageQueue(): Promise<StoredMessage[]> {
  const queue = getFromStorage(MESSAGE_QUEUE_KEY);
  return Array.isArray(queue) ? queue : [];
}

/**
 * Adds a message to the send queue.
 * @param message The message to queue for sending.
 * @returns A promise that resolves when the message is added.
 */
export async function addMessageToQueue(message: StoredMessage): Promise<void> {
  const queue = await getMessageQueue();
  if (!queue.find(m => m.id === message.id)) {
    queue.push(message);
    saveToStorage(MESSAGE_QUEUE_KEY, queue);
  }
}

/**
 * Removes a message from the send queue (e.g., after it's been sent).
 * @param messageId The ID of the message to remove.
 * @returns A promise that resolves when the queue is updated.
 */
export async function removeMessageFromQueue(messageId: string): Promise<void> {
  let queue = await getMessageQueue();
  queue = queue.filter(m => m.id !== messageId);
  saveToStorage(MESSAGE_QUEUE_KEY, queue);
}
