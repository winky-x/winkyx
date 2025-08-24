import type { Peer, Chat, Message } from './types';

// This is mock data. In a real app, peers would be discovered via BLE/WiFi Direct.
// The public keys here are now valid, randomly generated Base64 keys.
export const peers: Peer[] = [
  { id: '1', name: 'QuantumLeap', avatar: 'Q', status: 'online', publicKey: 'YJj63Vd4g3WWfJ+2Mv48t1h5r3Fv2PqjZ8c/3R6E7Xw=', signPublicKey: 'bsyP+LgLjdgRT6jW2PZ4C9TjXk6Zl8Qz/2jXJ/7K9HA=' },
  { id: '2', name: 'EchoSphere', avatar: 'E', status: 'offline', publicKey: 'a4rB/3Fv2PqjZ8c/3R6E7XwYJj63Vd4g3WWfJ+2Mv48=', signPublicKey: 'c/3R6E7XwYJj63Vd4g3WWfJ+2Mv48t1h5r3Fv2PqjZ8=' },
  { id: '3', name: 'Group Project', avatar: 'G', status: 'online', isGroup: true, publicKey: 'p/2jXJ/7K9HAbsyP+LgLjdgRT6jW2PZ4C9TjXk6Zl8Q=', signPublicKey: '2PqjZ8c/3R6E7XwYJj63Vd4g3WWfJ+2Mv48t1h5r3Fv=' },
  { id: '4', name: 'RogueAgent', avatar: 'R', status: 'reconnecting', publicKey: 'J/7K9HAbsyP+LgLjdgRT6jW2PZ4C9TjXk6Zl8Qz/2jX=', signPublicKey: 'd4g3WWfJ+2Mv48t1h5r3Fv2PqjZ8c/3R6E7XwYJj63V=' },
];

let chats: Chat[] = [
  {
    peer: peers[0],
    messages: [
      { id: 'm1', senderId: '1', text: 'Hey there!', timestamp: Date.now() - 100000, isSentByCurrentUser: false, status: 'read' },
      { id: 'm2', senderId: 'currentUser', text: 'Hello! How are you?', timestamp: Date.now() - 90000, isSentByCurrentUser: true, status: 'read' },
    ],
    unreadCount: 0,
  },
  {
    peer: peers[1],
    messages: [
      { id: 'm3', senderId: '2', text: 'See you tomorrow.', timestamp: Date.now() - 86400000, isSentByCurrentUser: false, status: 'delivered' },
    ],
    unreadCount: 1,
  },
  {
    peer: peers[2],
    messages: [
      { id: 'm4', senderId: '3', text: 'Project discussion at 3 PM.', timestamp: Date.now() - 200000, isSentByCurrentUser: false, status: 'delivered' },
      { id: 'm5', senderId: '4', text: 'I will be there.', timestamp: Date.now() - 180000, isSentByCurrentUser: false, status: 'delivered' },
      { id: 'm6', senderId: 'currentUser', text: 'Sounds good!', timestamp: Date.now() - 150000, isSentByCurrentUser: true, status: 'sent' },
    ],
    unreadCount: 5,
  },
  {
    peer: peers[3],
    messages: [],
    unreadCount: 0,
  }
];

// --- Data Management Functions ---

export function getChats(): Chat[] {
  return chats;
}

export function getChat(peerId: string): Chat | undefined {
  return chats.find(c => c.peer.id === peerId);
}

export function addMessageToChat(peerId: string, message: Omit<Message, 'id'>): Chat | undefined {
    const chatIndex = chats.findIndex(c => c.peer.id === peerId);
    if (chatIndex !== -1) {
        const newMessage = { ...message, id: `msg-${Date.now()}-${Math.random()}` };
        chats[chatIndex].messages.push(newMessage);
        return chats[chatIndex];
    }
    return undefined;
}


export function updateChat(peerId: string, updates: Partial<Chat>): Chat | undefined {
  const chatIndex = chats.findIndex(c => c.peer.id === peerId);
  if (chatIndex !== -1) {
    chats[chatIndex] = { ...chats[chatIndex], ...updates };
    return chats[chatIndex];
  }
  return undefined;
}
