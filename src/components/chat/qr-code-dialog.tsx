"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QrCode } from "lucide-react";

interface QrCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QrCodeDialog({ open, onOpenChange }: QrCodeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pair New Device</DialogTitle>
          <DialogDescription>
            Scan this QR code with your other device to establish a secure connection.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4 bg-white rounded-lg">
          {/* In a real app, this would be a dynamically generated QR code */}
          <QrCode className="h-48 w-48 text-black" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
