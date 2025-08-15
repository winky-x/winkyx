"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Camera, Image, FileText, MapPin, Briefcase } from "lucide-react";
import { GlassPanel } from "../ui/glass-panel";

interface AttachmentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const attachmentOptions = [
  { icon: Camera, label: "Camera", color: "bg-pink-500" },
  { icon: Image, label: "Gallery", color: "bg-purple-500" },
  { icon: FileText, label: "Document", color: "bg-indigo-500" },
  { icon: MapPin, label: "Location", color: "bg-green-500" },
  { icon: Briefcase, label: "Contact", color: "bg-blue-500" },
];

export function AttachmentSheet({ open, onOpenChange }: AttachmentSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom"
        className="bg-transparent border-none outline-none p-4 w-full max-w-2xl mx-auto"
        style={{height: 'fit-content'}}
      >
        <GlassPanel className="p-6">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-center text-white">Attach Media</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-x-4 gap-y-6 text-center text-white">
            {attachmentOptions.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2 cursor-pointer">
                <div className={`flex items-center justify-center h-14 w-14 rounded-full ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                </div>
                <span className="text-xs">{item.label}</span>
                </div>
            ))}
            </div>
        </GlassPanel>
      </SheetContent>
    </Sheet>
  );
}
