
"use client";

import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";
import { useState, useEffect } from 'react';
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [time, setTime] = useState('');

  // This effect runs only on the client after hydration
  useEffect(() => {
    if (message.timestamp) {
      setTime(new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    }
  }, [message.timestamp]);

  const StatusIcon = () => {
    if (message.status === 'read') {
      return <CheckCheck className="h-4 w-4 text-blue-500" />;
    }
    if (message.status === 'delivered') {
      return <CheckCheck className="h-4 w-4 text-muted-foreground" />;
    }
    if (message.status === 'sent') {
      return <Check className="h-4 w-4 text-muted-foreground" />;
    }
    return null;
  };

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 animate-in fade-in-25",
        message.isSentByCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-xs rounded-lg p-2.5 lg:max-w-md",
          message.isSentByCurrentUser
            ? "bg-[#222E35] text-white"
            : "bg-[#202C33] text-white"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <div className="flex items-center justify-end gap-1.5 mt-1 h-4">
           {time && (
            <p className="text-xs text-muted-foreground">{time}</p>
          )}
          {message.isSentByCurrentUser && <StatusIcon />}
        </div>
      </div>
    </div>
  );
}
