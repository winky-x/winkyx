/**
 * @fileoverview Communications Service for WinkyX (Mobile).
 * This service implements the actual native peer-to-peer communication
 * transports using Bluetooth LE and Wi-Fi Direct.
 */

'use client';

import { BleManager, Device } from 'react-native-ble-plx';
import { addPeer, getPeers, clearPeers } from './peerStore';
import { StoredMessage } from './data';
import { getIdentity } from './identity';
import { Platform } from 'react-native';
import * as WifiP2p from 'react-native-wifi-p2p';
import { PermissionsAndroid } from 'react-native';

export interface DiscoveredPeer {
  id: string; // MAC address or other unique identifier
  name: string; // User-defined name
  publicKey: string; // Base64 encoded public key for encryption
  signPublicKey: string; // Base64 encoded public key for signing
  signalStrength: number; // e.g., -50 (dBm)
}

const bleManager = new BleManager();

// --- Service Lifecycle ---

export const initializeComms = async () => {
  console.log('[Comms] Initializing P2P services...');
  if (Platform.OS === 'android') {
    // Request permissions for Android
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    if (
      granted['android.permission.BLUETOOTH_CONNECT'] !== 'granted' ||
      granted['android.permission.BLUETOOTH_SCAN'] !== 'granted' ||
      granted['android.permission.ACCESS_FINE_LOCATION'] !== 'granted'
    ) {
      console.warn('[Comms] Required permissions not granted.');
      return;
    }
  }
  
  try {
    await WifiP2p.init();
    console.log('[Comms] Wi-Fi P2P initialized.');
  } catch (e) {
    console.error('[Comms] Failed to initialize Wi-Fi P2P:', e);
  }
};


// --- Discovery ---

/**
 * Starts scanning for nearby peers via both BLE and Wi-Fi Direct.
 * @param onPeerFound A callback function that is invoked for each peer found.
 */
export function startDiscovery(onPeerFound: (peer: DiscoveredPeer) => void): void {
  console.log('[Comms] Starting peer discovery...');
  clearPeers();

  // 1. Start BLE Scan
  bleManager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.error('[Comms-BLE] Scan error:', error);
      return;
    }

    if (device && device.name?.startsWith('WinkyX-')) {
      const peer: DiscoveredPeer = {
        id: device.id,
        name: device.name.replace('WinkyX-', ''),
        signalStrength: device.rssi ?? -100,
        // In a real scenario, public keys would be part of the advertisement data
        publicKey: 'mock-public-key',
        signPublicKey: 'mock-sign-public-key',
      };
      addPeer(peer);
      onPeerFound(peer);
    }
  });

  // 2. Start Wi-Fi Direct Scan
  WifiP2p.getPeers((peers) => {
    console.log('[Comms-WiFi] Discovered Wi-Fi peers:', peers);
    // Process and adapt Wi-Fi peers to the DiscoveredPeer format
  });
}

/**
 * Stops the peer discovery process.
 */
export function stopDiscovery(): void {
  console.log('[Comms] Stopping peer discovery...');
  bleManager.stopDeviceScan();
}


/**
 * Simulates sending a message directly to a peer.
 * @param peer The peer to send the message to.
 * @param message The message object to send.
 * @returns A promise that resolves to true if sending was "successful", false otherwise.
 */
export async function sendMessageToPeer(
  peer: DiscoveredPeer,
  message: StoredMessage
): Promise<boolean> {
  console.log(`[Comms] Simulating sending message ${message.id} to peer ${peer.name}`);
  console.log(`[Comms] Content:`, message.encryptedContent);
  
  // In a real app, this would establish a BLE/WiFi connection and transmit the data.
  // We'll simulate a successful transmission after a short delay.
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`[Comms] Message ${message.id} "sent" successfully.`);
      // In a real implementation, you would wait for an ACK from the peer.
      resolve(true); 
    }, 500);
  });
}