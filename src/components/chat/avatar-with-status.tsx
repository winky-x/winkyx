
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Peer } from "@/lib/types";

interface AvatarWithStatusProps {
  peer: Peer;
  className?: string;
}

export function AvatarWithStatus({ peer, className }: AvatarWithStatusProps) {
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);

  const initials = peer.isGroup ? peer.avatar : getInitials(peer.name);

  return (
    <div className="relative flex-shrink-0">
      <Avatar className={cn("h-12 w-12 border-2 border-transparent", className)}>
        <AvatarImage src={''} alt={peer.name} data-ai-hint="profile avatar" />
        <AvatarFallback className="bg-muted text-muted-foreground font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      {peer.status === 'online' && !peer.isGroup && (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-black" />
      )}
    </div>
  );
}
