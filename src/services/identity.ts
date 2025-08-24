/**
 * @fileoverview Identity Service for WinkyX.
 * Manages the user's cryptographic identity, which consists of their key pairs.
 * This service handles the creation, storage, and retrieval of the user's identity
 * from the device's secure storage.
 *
 * Exports:
 * - Identity: Type definition for the user's full identity.
 * - getIdentity: Retrieves the identity from storage, creating it if it doesn't exist.
 * - getPublicKeyFingerprint: Generates a human-readable fingerprint of the public keys.
 */

'use client';

import nacl from 'tweetnacl';
import * as Keychain from 'react-native-keychain';
import * as crypto from './crypto';
import { saveToStorage, getFromStorage } from '@/lib/storage';

const IDENTITY_SERVICE_NAME = 'com.winkyx.identity';

// --- Type Definitions ---

/** Represents the user's full cryptographic identity. */
export interface Identity {
  keyPair: crypto.KeyPair;
  publicKeyBase64: string;
  signPublicKeyBase64: string;
}

// --- Private Helper Functions ---

/**
 * Creates and stores a new identity in the device keychain.
 * @returns A promise that resolves to the newly created Identity.
 */
async function createAndStoreIdentity(): Promise<Identity> {
  const keyPair = await crypto.generateKeyPair();
  const identity: Identity = {
    keyPair,
    publicKeyBase64: crypto.toBase64(keyPair.publicKey),
    signPublicKeyBase64: crypto.toBase64(keyPair.signPublicKey),
  };

  const storableIdentity = JSON.stringify({
    privateKey: crypto.toBase64(keyPair.privateKey),
    signPrivateKey: crypto.toBase64(keyPair.signPrivateKey),
  });

  await Keychain.setGenericPassword('user_identity', storableIdentity, {
    service: IDENTITY_SERVICE_NAME,
  });

  return identity;
}

/**
 * Loads an identity from the device keychain.
 * @param credentials The credentials retrieved from the keychain.
 * @returns A promise that resolves to the reconstructed Identity.
 */
async function loadIdentityFromKeychain(
  credentials: Keychain.UserCredentials
): Promise<Identity> {
  const storedIdentity = JSON.parse(credentials.password);
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

  try {
    const credentials = await Keychain.getGenericPassword({ service: IDENTITY_SERVICE_NAME });
    if (credentials) {
      memoryIdentity = await loadIdentityFromKeychain(credentials);
    } else {
      memoryIdentity = await createAndStoreIdentity();
    }
  } catch (error) {
    console.error('Keychain access failed, creating new identity as fallback:', error);
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
