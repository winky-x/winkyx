/**
 * @fileoverview Cryptography Service for WinkyX.
 * Provides military-grade, end-to-end encryption capabilities using primitives
 * from the NaCl library (via TweetNaCl.js). This module is self-contained
 * and has no external dependencies besides the crypto library.
 *
 * Exports:
 * - KeyPair: Type definition for asymmetric key pairs.
 * - EncryptedMessage: Type definition for the structured encrypted payload.
 * - generateKeyPair: Creates a new Curve25519 key pair for ECDH and an Ed25519 key pair for signing.
 * - encryptMessage: Encrypts a message for a recipient using their public key.
 * - decryptMessage: Decrypts a message from a sender using their public key.
 * - sign: Signs a message with a private signing key.
 * - verify: Verifies a signature.
 * - toBase64: Utility to convert Uint8Array to Base64 string.
 * - fromBase64: Utility to convert Base64 string to Uint8Array.
 */

'use client';

import nacl from 'tweetnacl';
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64,
} from 'tweetnacl-util';

// --- Type Definitions ---

/** A key pair for asymmetric cryptography. */
export interface KeyPair {
  /** Curve25519 public key for key exchange (ECDH). */
  publicKey: Uint8Array;
  /** Curve25519 private key for key exchange (ECDH). */
  privateKey: Uint8Array;
  /** Ed25519 public key for signing. */
  signPublicKey: Uint8Array;
  /** Ed25519 private key for signing. */
  signPrivateKey: Uint8Array;
}

/** Structure of an encrypted message payload. */
export interface EncryptedMessage {
  /** The encrypted message content (ciphertext). */
  ciphertext: Uint8Array;
  /** A unique number used once for this encryption operation. */
  nonce: Uint8Array;
  /** The signature of the ciphertext, proving sender authenticity. */
  signature: Uint8Array;
}

// --- Core Cryptographic Functions ---

/**
 * Generates a new cryptographic identity.
 * This consists of one key pair for encryption (Curve25519) and one for signing (Ed25519).
 * @returns A promise that resolves to a new KeyPair object.
 */
export async function generateKeyPair(): Promise<KeyPair> {
  const encryptionKeys = nacl.box.keyPair();
  const signingKeys = nacl.sign.keyPair();
  return {
    publicKey: encryptionKeys.publicKey,
    privateKey: encryptionKeys.secretKey,
    signPublicKey: signingKeys.publicKey,
    signPrivateKey: signingKeys.secretKey,
  };
}

/**
 * Encrypts a message for a recipient.
 * @param message The plaintext string to encrypt.
 * @param recipientPublicKey The recipient's public encryption key (Curve25519).
 * @param senderKeyPair The sender's full key pair.
 * @returns A promise that resolves to an EncryptedMessage object.
 */
export async function encryptMessage(
  message: string,
  recipientPublicKey: Uint8Array,
  senderKeyPair: KeyPair
): Promise<EncryptedMessage> {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageUint8 = decodeUTF8(message);

  const ciphertext = nacl.box(
    messageUint8,
    nonce,
    recipientPublicKey,
    senderKeyPair.privateKey
  );

  const signature = await sign(ciphertext, senderKeyPair.signPrivateKey);

  return { ciphertext, nonce, signature };
}

/**
 * Decrypts a message from a sender.
 * @param encryptedMessage The encrypted message object.
 * @param senderPublicKey The sender's public encryption key (Curve25519).
 * @param senderSignPublicKey The sender's public signing key (Ed25519).
 * @param recipientKeyPair The recipient's full key pair.
 * @returns A promise that resolves to the decrypted plaintext string, or null if decryption or verification fails.
 */
export async function decryptMessage(
  encryptedMessage: EncryptedMessage,
  senderPublicKey: Uint8Array,
  senderSignPublicKey: Uint8Array,
  recipientKeyPair: KeyPair
): Promise<string | null> {
  const isVerified = await verify(
    encryptedMessage.signature,
    encryptedMessage.ciphertext,
    senderSignPublicKey
  );

  if (!isVerified) {
    console.error('Message verification failed: Signature is invalid.');
    return null;
  }

  const decryptedMessage = nacl.box.open(
    encryptedMessage.ciphertext,
    encryptedMessage.nonce,
    senderPublicKey,
    recipientKeyPair.privateKey
  );

  if (!decryptedMessage) {
    console.error('Message decryption failed.');
    return null;
  }

  return encodeUTF8(decryptedMessage);
}

/**
 * Signs a message with a private signing key.
 * @param message The message (as Uint8Array) to sign.
 * @param signPrivateKey The private signing key (Ed25519).
 * @returns A promise that resolves to the signature as a Uint8Array.
 */
export async function sign(
  message: Uint8Array,
  signPrivateKey: Uint8Array
): Promise<Uint8Array> {
  return nacl.sign.detached(message, signPrivateKey);
}

/**
 * Verifies a message's signature.
 * @param signature The signature to verify.
 * @param message The message that was signed.
 * @param signPublicKey The public signing key of the sender.
 * @returns A promise that resolves to true if the signature is valid, false otherwise.
 */
export async function verify(
  signature: Uint8Array,
  message: Uint8Array,
  signPublicKey: Uint8Array
): Promise<boolean> {
  return nacl.sign.detached.verify(message, signature, signPublicKey);
}

// --- Utility Functions ---

/**
 * Converts a Uint8Array to a Base64 encoded string.
 * @param data The Uint8Array to convert.
 * @returns The Base64 encoded string.
 */
export function toBase64(data: Uint8Array): string {
  return encodeBase64(data);
}

/**
 * Converts a Base64 encoded string to a Uint8Array.
 * @param data The Base64 encoded string.
 * @returns The decoded Uint8Array.
 */
export function fromBase64(data: string): Uint8Array {
  return decodeBase64(data);
}
