/**
 * @fileoverview Identity Service for WinkyX.
 * Manages the user's cryptographic identity, which consists of their key pairs.
 * This service handles the creation, storage, and retrieval of the user's identity
 * from the device's local storage.
 *
 * Exports:
 * - Identity: Type definition for the user's full identity.
 * - getIdentity: Retrieves the identity from storage, creating it if it doesn't exist.
 * - getPublicKeyFingerprint: Generates a human-readable fingerprint of the public keys.
 */

'use client';

import nacl from 'tweetnacl';
import * as crypto from './crypto';
import { saveToStorage, getFromStorage } from '@/lib/storage';

const IDENTITY_STORAGE_KEY = 'winkyx_identity';

// --- Type Definitions ---

/** Represents the user's full cryptographic identity. */
export interface Identity {
  keyPair: crypto.KeyPair;
  publicKeyBase64: string;
  signPublicKeyBase64: string;
}

// --- Private Helper Functions ---

/**
 * Creates and stores a new identity.
 * This should only be called if no identity exists.
 * @returns A promise that resolves to the newly created Identity.
 */
async function createAndStoreIdentity(): Promise<Identity> {
  const keyPair = await crypto.generateKeyPair();
  const identity: Identity = {
    keyPair,
    publicKeyBase64: crypto.toBase64(keyPair.publicKey),
    signPublicKeyBase64: crypto.toBase64(keyPair.signPublicKey),
  };

  // For storage, we only store the private keys. Public keys can be derived.
  const storableIdentity = {
    privateKey: crypto.toBase64(keyPair.privateKey),
    signPrivateKey: crypto.toBase64(keyPair.signPrivateKey),
  };

  saveToStorage(IDENTITY_STORAGE_KEY, storableIdentity);
  return identity;
}

/**
 * Loads an identity from stored private keys.
 * @param storedIdentity The object retrieved from local storage.
 * @returns A promise that resolves to the reconstructed Identity.
 */
async function loadIdentityFromStorage(storedIdentity: any): Promise<Identity> {
  const privateKey = crypto.fromBase64(storedIdentity.privateKey);
  const signPrivateKey = crypto.fromBase64(storedIdentity.signPrivateKey);

  // Re-derive public keys from private keys to ensure integrity.
  const keyPair = {
    privateKey,
    publicKey: nacl.box.keyPair.fromSecretKey(privateKey).publicKey,
    signPrivateKey,
    signPublicKey: nacl.sign.keyPair.fromSecretKey(signPrivateKey).publicKey,
  };

  return {
    keyPair,
    publicKeyBase64: crypto.toBase64(keyPair.publicKey),
    signPublicKeyBase64: crypto.toBase64(keyPair.signPublicKey),
  };
}

// --- Public API ---

let memoryIdentity: Identity | null = null;

/**
 * Retrieves the user's identity.
 * If an identity exists in storage, it's loaded. Otherwise, a new one is
 * created and stored. The result is cached in memory for the session.
 * @returns A promise that resolves to the user's Identity.
 */
export async function getIdentity(): Promise<Identity> {
  if (memoryIdentity) {
    return memoryIdentity;
  }

  const storedIdentity = getFromStorage(IDENTITY_STORAGE_KEY);

  if (storedIdentity && storedIdentity.privateKey) {
    memoryIdentity = await loadIdentityFromStorage(storedIdentity);
  } else {
    memoryIdentity = await createAndStoreIdentity();
  }

  return memoryIdentity;
}

/**
 * Generates a human-readable fingerprint from the user's public keys.
 * This can be used for QR codes or manual verification.
 * @param identity The user's identity object.
 * @returns A formatted string representing the key fingerprint (e.g., "a4b8-x9z1-p3q7").
 */
export function getPublicKeyFingerprint(identity: Identity): string {
  const combined = `${identity.publicKeyBase64.substring(0, 8)}${identity.signPublicKeyBase64.substring(0, 8)}`;
  // Simple formatting for readability
  return `${combined.substring(0, 4)}-${combined.substring(4, 8)}-${combined.substring(8, 12)}`;
}
