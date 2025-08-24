/**
 * @fileoverview Data Service for WinkyX (Mobile).
 * Implements a local database using Expo's SQLite module for storing messages
 * and managing a message queue for offline sending.
 *
 * Exports:
 * - StoredMessage: Type definition for a message in storage.
 * - getMessagesForPeer: Retrieves all messages for a given peer.
 * - saveMessage: Saves a single message to the local store.
 * - getMessageQueue: Retrieves the list of unsent messages.
 * - addMessageToQueue: Adds a message to the send queue.
 * - removeMessageFromQueue: Removes a message from the send queue.
 */

'use strict';

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('winkyx.db');

const executeSql = (sql: string, params: any[] = []): Promise<SQLite.SQLResultSet> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          reject(error);
          return false; // Rollback transaction
        }
      );
    });
  });
};


// --- Database Initialization ---

const initializeDatabase = async () => {
  await executeSql(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY NOT NULL,
      peer_public_key TEXT NOT NULL,
      from_public_key TEXT NOT NULL,
      to_public_key TEXT NOT NULL,
      encrypted_content TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      status TEXT NOT NULL,
      is_sent_by_current_user INTEGER NOT NULL
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS message_queue (
      message_id TEXT PRIMARY KEY NOT NULL,
      FOREIGN KEY (message_id) REFERENCES messages(id)
    );
  `);
};

// Call initialization once
initializeDatabase().catch(error => console.error("Failed to initialize database:", error));


// --- Type Definitions ---

export interface StoredMessage {
  id: string;
  peer_public_key: string; // The other person in the chat
  from_public_key: string; // Base64 public key of sender
  to_public_key: string;   // Base64 public key of recipient
  encrypted_content: string; // Base64 of EncryptedMessage object
  timestamp: number;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  is_sent_by_current_user: boolean;
}

// --- Message Store Functions ---

/**
 * Retrieves all messages exchanged with a specific peer.
 * @param peerPublicKey The Base64 public key of the peer.
 * @returns A promise that resolves to an array of StoredMessage objects.
 */
export async function getMessagesForPeer(
  peerPublicKey: string
): Promise<StoredMessage[]> {
  const resultSet = await executeSql(
    'SELECT * FROM messages WHERE peer_public_key = ? ORDER BY timestamp ASC;',
    [peerPublicKey]
  );
  return resultSet.rows._array.map(row => ({
      ...row,
      is_sent_by_current_user: !!row.is_sent_by_current_user
  }));
}

/**
 * Saves a message to the local store for a specific peer conversation.
 * @param message The message object to save.
 * @returns A promise that resolves when the message is saved.
 */
export async function saveMessage(
  message: StoredMessage,
): Promise<void> {
  await executeSql(
    `INSERT OR REPLACE INTO messages (id, peer_public_key, from_public_key, to_public_key, encrypted_content, timestamp, status, is_sent_by_current_user)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      message.id,
      message.peer_public_key,
      message.from_public_key,
      message.to_public_key,
      message.encrypted_content,
      message.timestamp,
      message.status,
      message.is_sent_by_current_user ? 1 : 0,
    ]
  );
}

/**
 * Updates the status of a list of messages.
 * @param messageIds The IDs of the messages to update.
 * @param status The new status.
 */
export async function updateMessageStatus(messageIds: string[], status: StoredMessage['status']): Promise<void> {
  if (messageIds.length === 0) return;
  const placeholders = messageIds.map(() => '?').join(',');
  await executeSql(
    `UPDATE messages SET status = ? WHERE id IN (${placeholders});`,
    [status, ...messageIds]
  );
}


// --- Message Queue Functions ---

/**
 * Retrieves the current message queue from storage.
 * @returns A promise that resolves to an array of StoredMessage objects.
 */
export async function getMessageQueue(): Promise<StoredMessage[]> {
  const resultSet = await executeSql(`
    SELECT m.* FROM messages m
    INNER JOIN message_queue mq ON m.id = mq.message_id
    ORDER BY m.timestamp ASC;
  `);
  return resultSet.rows._array.map(row => ({
      ...row,
      is_sent_by_current_user: !!row.is_sent_by_current_user
  }));
}

/**
 * Adds a message to the send queue.
 * @param message The message to queue for sending.
 * @returns A promise that resolves when the message is added.
 */
export async function addMessageToQueue(message: StoredMessage): Promise<void> {
  await executeSql('INSERT OR IGNORE INTO message_queue (message_id) VALUES (?);', [message.id]);
}

/**
 * Removes a message from the send queue (e.g., after it's been sent).
 * @param messageId The ID of the message to remove.
 * @returns A promise that resolves when the queue is updated.
 */
export async function removeMessageFromQueue(messageId: string): Promise<void> {
  await executeSql('DELETE FROM message_queue WHERE message_id = ?;', [messageId]);
}
