// `app/chat/page.tsx`
"use client";

import React, from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getChats } from "@/lib/data";
import type { Chat } from "@/lib/types";
import { Search, Plus, Settings, Users, Star, User, Compass, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarWithStatus } from "@/components/chat/avatar-with-status";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "@/components/icons/logo";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const filterChips = ["All", "Unread", "Groups"];

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4.16602 8.66602L7.49935 11.9994L13.3327 6.16602" />
  </svg>
);

const TickIcon = ({ status }: { status: "sent" | "delivered" | "read" | undefined }) => {
  if (!status) return null;

  const baseClass = "w-3 h-3";
  const colorClass = status === "read" ? "text-blue-500" : "text-gray-400";

  return (
    <div className={`flex items-center ${colorClass} ${baseClass}`}>
      <CheckIcon />
      {status !== "sent" && <CheckIcon className="-ml-1" />}
    </div>
  );
};

const ChatListItem = ({ chat }: { chat: Chat }) => {
    const [time, setTime] = React.useState('');
    const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;

    React.useEffect(() => {
        if (lastMessage) {
            setTime(new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
        }
    }, [lastMessage]);

    return (
        <Link href={`/chat/${chat.peer.id}`} passHref>
            <div className="flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-colors active:bg-muted/50">
                <AvatarWithStatus peer={chat.peer} />
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-base">{chat.peer.name}</h3>
                        {lastMessage && (
                            <div className="flex items-center text-xs text-gray-400 leading-tight font-sans space-x-1">
                                <span>{time}</span>
                                <TickIcon status={lastMessage?.status} />
                            </div>
                        )}
                    </div>
                     <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400 truncate font-sans flex-1">
                            {lastMessage?.text || "No messages yet"}
                        </p>
                        {chat.unreadCount > 0 && (
                            <Badge className="h-5 w-5 flex items-center justify-center p-0 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                                {chat.unreadCount}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default function ChatsListPage() {
  const router = useRouter();
  const [chats, setChats] = React.useState(getChats());
  const [activeFilter, setActiveFilter] = React.useState("All");
  const { toast } = useToast();
  
  const [isHeaderVisible, setIsHeaderVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);


  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const showWelcomeToast = sessionStorage.getItem('showWelcomeToast');
      
      if (showWelcomeToast) {
        // Immediately remove the flag to prevent duplicate toasts
        sessionStorage.removeItem('showWelcomeToast');
        
        // Use a slight delay for the toast to appear after the page renders
        setTimeout(() => {
            toast({
              variant: "success",
              title: "Welcome Back!",
              description: "Your secure session is active.",
              duration: 5000, // Toast will auto-hide after 5 seconds
            });
        }, 150);
      }
    }
  }, [toast]); // Added toast to dependency array as it's used inside
  
  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    const currentScrollY = scrollAreaRef.current.scrollTop;

    // A small threshold to prevent hiding the header on minor scrolls
    if (Math.abs(currentScrollY - lastScrollY.current) < 10) {
      return;
    }

    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      setIsHeaderVisible(false); // Scrolling down
    } else {
      setIsHeaderVisible(true); // Scrolling up
    }
    lastScrollY.current = currentScrollY;
  };

  return (
    <div className="flex flex-col h-full text-white bg-black">
      <div className="sticky top-0 bg-black z-10">
        <header className="flex items-center justify-between p-4 h-16 pb-2">
            <div className="flex items-center gap-2">
                <Logo />
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-8 rounded-full bg-transparent active:scale-95" onClick={() => router.push('/discover')}>
                    <Compass className="h-7 w-7" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 rounded-full bg-transparent active:scale-95">
                    <Plus className="h-7 w-7" />
                </Button>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 rounded-full bg-transparent active:scale-95">
                            <Settings className="h-7 w-7" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            <span>New Group</span>
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => router.push('/profile')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Star className="mr-2 h-4 w-4" />
                            <span>Starred Messages</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/settings')}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => router.push('/about')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>About</span>
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => router.push('/debug')}>
                            <Bug className="mr-2 h-4 w-4" />
                            <span>Debug Tools</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>

        <div className={cn(
            "transform-gpu transition-all duration-300 ease-in-out px-4 bg-black space-y-4",
            isHeaderVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 h-0"
        )}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search..." className="w-full bg-muted rounded-full pl-10" />
            </div>
            <div className="flex items-center gap-2 pb-2">
                {filterChips.map((chip) => (
                    <Badge
                        key={chip}
                        variant={activeFilter === chip ? 'default' : 'secondary'}
                        className="cursor-pointer rounded-full px-3 py-1 text-sm"
                        onClick={() => setActiveFilter(chip)}
                    >
                        {chip}
                    </Badge>
                ))}
            </div>
        </div>
      </div>

      <ScrollArea className="flex-1" ref={scrollAreaRef} onScroll={handleScroll}>
        <div className="p-4 pt-2 space-y-2">
          {chats.map((chat) => (
            <ChatListItem key={chat.peer.id} chat={chat} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
