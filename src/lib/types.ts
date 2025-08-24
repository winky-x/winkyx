export interface Peer {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'reconnecting';
  isGroup?: boolean;
  // Public keys are added for E2E encryption
  publicKey: string; // Base64 encoded
  signPublicKey: string; // Base64 encoded
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isSentByCurrentUser: boolean;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface Chat {
  peer: Peer;
  messages: Message[];
  unreadCount: number;
}
