/**
 * @fileoverview Identity Service for WinkyX (Mobile).
 * Manages the user's cryptographic identity using the device's secure keychain.
 */

'use client';

import nacl from 'tweetnacl';
import * as Keychain from 'react-native-keychain';
import * as crypto from './crypto';

const IDENTITY_SERVICE_NAME = 'com.winkyx.identity';

export interface Identity {
  keyPair: crypto.KeyPair;
  publicKeyBase64: string;
  signPublicKeyBase64: string;
}

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

async function loadIdentityFromKeychain(
  credentials: Keychain.UserCredentials
): Promise<Identity> {
  const storedIdentity = JSON.parse(credentials.password);
  const privateKey = crypto.fromBase64(storedIdentity.privateKey);
  const signPrivateKey = crypto.fromBase64(storedIdentity.signPrivateKey);

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

let memoryIdentity: Identity | null = null;

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

export function getPublicKeyFingerprint(identity: Identity): string {
  const combined = `${identity.publicKeyBase64.substring(0, 8)}${identity.signPublicKeyBase64.substring(0, 8)}`;
  return `${combined.substring(0, 4)}-${combined.substring(4, 8)}-${combined.substring(8, 12)}`;
}
