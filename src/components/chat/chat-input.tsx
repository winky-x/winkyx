
"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { AttachmentSheet } from "./attachment-sheet";
import { StickerIcon } from "../icons/sticker-icon";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [text, setText] = useState("");
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [maxHeight, setMaxHeight] = useState(120);

  useLayoutEffect(() => {
    // Set max height to 35% of viewport height
    if (typeof window !== "undefined") {
      setMaxHeight(window.innerHeight * 0.35);
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setText(textarea.value);

    // Auto-grow logic
    textarea.style.height = 'auto'; // Reset height to recalculate
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;

    // Check if textarea has more than one line
    const baseHeight = 32; // Approximate height for a single line (adjust if needed)
    setIsMultiLine(scrollHeight > baseHeight + 8);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text.trim());
      setText("");
      if (textareaRef.current) {
        // Reset height after sending
        textareaRef.current.style.height = 'auto';
        setIsMultiLine(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isTextEntered = text.trim().length > 0;

  return (
    <div className="sticky bottom-0 bg-black z-20 pb-4 px-2 pt-2">
      <div className={cn(
        "flex rounded-xl bg-[#202C33] py-1",
        isMultiLine ? 'items-end' : 'items-center'
      )}>
         <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="shrink-0 h-8 w-8 rounded-full text-muted-foreground transition active:bg-white/10 active:scale-95 ml-2"
        >
          <StickerIcon className="h-6 w-6" />
        </Button>
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Message"
          className="flex-1 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent min-h-[2rem] py-2 text-white placeholder:text-muted-foreground overflow-y-auto scrollbar-transparent"
          style={{ maxHeight: `${maxHeight}px` }}
          rows={1}
        />
         <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="shrink-0 h-8 w-8 rounded-full text-muted-foreground transition active:bg-white/10 active:scale-95 mr-2"
          onClick={() => setSheetOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
        <Button
          type="submit"
          aria-label="Send message"
          className={cn(
            "shrink-0 rounded-full h-8 w-8 p-1.5 transition-all active:scale-95 mr-2",
            isTextEntered ? "bg-white text-black" : "bg-transparent text-muted-foreground"
          )}
          onClick={handleSubmit}
          disabled={!isTextEntered}
        >
          <ArrowUp className="h-full w-full" />
        </Button>
    </div>
    <AttachmentSheet open={isSheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
