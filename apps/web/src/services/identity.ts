/**
 * @fileoverview Identity Service for WinkyX (Web/Mock).
 * Manages the user's cryptographic identity, which consists of their key pairs.
 * This service handles the creation, storage, and retrieval of the user's identity
 * from local storage for the web prototype.
 */

'use client';

import nacl from 'tweetnacl';
import * as crypto from './crypto';
import { saveToStorage, getFromStorage } from '@/lib/storage';

const IDENTITY_KEY = 'winkyx_identity';

// --- Type Definitions ---

/** Represents the user's full cryptographic identity. */
export interface Identity {
  keyPair: crypto.KeyPair;
  publicKeyBase64: string;
  signPublicKeyBase64: string;
}

// --- Private Helper Functions ---

/**
 * Creates and stores a new identity in local storage.
 * @returns A promise that resolves to the newly created Identity.
 */
async function createAndStoreIdentity(): Promise<Identity> {
  const keyPair = await crypto.generateKeyPair();
  const identity: Identity = {
    keyPair,
    publicKeyBase64: crypto.toBase64(keyPair.publicKey),
    signPublicKeyBase64: crypto.toBase64(keyPair.signPublicKey),
  };

  const storableIdentity = {
    privateKey: crypto.toBase64(keyPair.privateKey),
    signPrivateKey: crypto.toBase64(keyPair.signPrivateKey),
  };

  saveToStorage(IDENTITY_KEY, storableIdentity);
  return identity;
}

/**
 * Loads an identity from local storage.
 * @param storedIdentity The credentials retrieved from storage.
 * @returns A promise that resolves to the reconstructed Identity.
 */
async function loadIdentityFromStorage(
  storedIdentity: any
): Promise<Identity> {
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
 * Retrieves the user's identity from secure storage.
 * If an identity exists, it's loaded. Otherwise, a new one is created.
 * @returns A promise that resolves to the user's Identity.
 */
export async function getIdentity(): Promise<Identity> {
  if (memoryIdentity) {
    return memoryIdentity;
  }

  const storedIdentity = getFromStorage(IDENTITY_KEY);
  if (storedIdentity) {
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
