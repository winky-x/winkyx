
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { getChat, updateChat } from "@/lib/data";
import type { Chat, Message } from "@/lib/types";
import { ArrowLeft, MoreVertical, User, Trash2, XCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarWithStatus } from "@/components/chat/avatar-with-status";
import { getIdentity } from "@/services/identity";
import * as crypto from "@/services/crypto";
import * as data from "@/services/data";


export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;

  const [chat, setChat] = useState<Chat | undefined>(undefined);
  const [showMenu, setShowMenu] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Set the --vh CSS variable on load and resize
  useEffect(() => {
    const setVh = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    return () => {
      visualViewport?.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  // Scroll to bottom on resize (keyboard open)
  useEffect(() => {
    const scrollDown = () => {
      setTimeout(() => {
        chatRef.current?.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    };
    
    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener('resize', scrollDown);

    return () => {
      visualViewport?.removeEventListener('resize', scrollDown);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (chatId) {
      const foundChat = getChat(chatId);
      if (foundChat) {
        setChat(foundChat);
      } else {
        // Handle case where chat is not found
        router.replace('/chat');
      }
    }
  }, [chatId, router]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!chat) return;

    const identity = await getIdentity();
    const peerPublicKeyBytes = crypto.fromBase64(chat.peer.publicKey);
    
    const encryptedPayload = await crypto.encryptMessage(text, peerPublicKeyBytes, identity.keyPair);
    
    const encryptedContent = JSON.stringify({
        ciphertext: crypto.toBase64(encryptedPayload.ciphertext),
        nonce: crypto.toBase64(encryptedPayload.nonce),
        signature: crypto.toBase64(encryptedPayload.signature),
    });

    const storedMessage: data.StoredMessage = {
        id: `msg-${Date.now()}`,
        peer_public_key: chat.peer.publicKey,
        from_public_key: identity.publicKeyBase64,
        to_public_key: chat.peer.publicKey,
        encrypted_content: encryptedContent,
        timestamp: Date.now(),
        status: 'queued',
        is_sent_by_current_user: true,
    }
    
    // Save to local DB and add to send queue
    await data.saveMessage(storedMessage);
    await data.addMessageToQueue(storedMessage);
    
    // For UI purposes, we add the unencrypted text.
    // In a real app, you'd decrypt from the store.
    const newMessage: Message = {
      id: storedMessage.id,
      senderId: "currentUser",
      text,
      timestamp: Date.now(),
      isSentByCurrentUser: true,
      status: "queued",
    };
    
    const updatedChat = updateChat(chat.peer.id, {
        messages: [...chat.messages, newMessage],
    });

    setChat(updatedChat);
    setTimeout(scrollToBottom, 0);

  }, [chat]);

  if (!chat) {
    return null; // Return null or a loading spinner while redirecting or finding chat
  }

  return (
    <div className="flex flex-col bg-black text-white" style={{ height: 'calc(var(--vh))' }}>
      <header className="relative flex shrink-0 items-center justify-between sticky top-0 bg-black z-10 border-b border-gray-800 p-2 h-14">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-9 w-9 rounded-full transition active:bg-white/10 active:scale-95">
                <ArrowLeft />
            </Button>
            <AvatarWithStatus peer={chat.peer} className="h-8 w-8" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <h2 className="font-medium text-sm text-white truncate">{chat.peer.name}</h2>
        </div>
        <div className="relative" ref={menuRef}>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full transition active:bg-white/10 active:scale-95" onClick={() => setShowMenu(!showMenu)}>
                <MoreVertical />
            </Button>
            {showMenu && (
                <div className="absolute top-full right-2 mt-2 w-48 bg-card text-card-foreground rounded-md shadow-lg p-1 z-20 origin-top-right animate-in fade-in zoom-in-95">
                    <button className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded-md active:bg-muted" onClick={() => router.push(`/profile`)}>
                      <User className="mr-2 h-4 w-4" /> View Contact
                    </button>
                    <button className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded-md active:bg-muted" onClick={() => router.push(`/chat/${chatId}/gallery`)}>
                      <ImageIcon className="mr-2 h-4 w-4" /> Media Gallery
                    </button>
                    <button className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded-md active:bg-muted">
                      <Trash2 className="h-4 w-4" /> Clear Chat
                    </button>
                    <button className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded-md active:bg-muted text-red-500">
                      <XCircle className="h-4 w-4" /> Delete
                    </button>
                </div>
            )}
        </div>
      </header>
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto pb-4"
      >
        <ChatMessages messages={chat.messages} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
