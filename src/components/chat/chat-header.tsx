import type { Peer } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { AvatarWithStatus } from "./avatar-with-status";

interface ChatHeaderProps {
  peer: Peer;
}

export function ChatHeader({ peer }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-start gap-4 flex-1">
        <AvatarWithStatus peer={peer} className="h-8 w-8" />
        <div className="flex items-center gap-2">
            <span className="font-medium text-lg text-white">{peer.name}</span>
        </div>
    </div>
  );
}
