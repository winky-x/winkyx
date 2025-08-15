
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Wifi, Signal, Bluetooth, RefreshCw, User, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type PeerStatus = 'Searching' | 'Available' | 'Connecting' | 'Connected' | 'Unavailable';

interface Peer {
  id: string;
  name: string;
  emoji: string;
  signalStrength: number; // 0 to 100
  status: PeerStatus;
  lastSeen?: string;
}

const mockPeers: Peer[] = [
  { id: '1', name: 'QuantumLeap', emoji: '🚀', signalStrength: 95, status: 'Available' },
  { id: '2', name: 'EchoSphere', emoji: '🌍', signalStrength: 80, status: 'Available' },
  { id: '3', name: 'RogueAgent', emoji: '🕶️', signalStrength: 65, status: 'Unavailable', lastSeen: '5m ago' },
];

const statusConfig: Record<PeerStatus, { text: string; color: string; icon: React.ElementType }> = {
    Searching: { text: "Searching...", color: "text-blue-400", icon: Wifi },
    Available: { text: "Available", color: "text-green-400", icon: CheckCircle },
    Connecting: { text: "Connecting...", color: "text-yellow-400", icon: Wifi },
    Connected: { text: "Connected", color: "text-green-500", icon: CheckCircle },
    Unavailable: { text: "Unavailable", color: "text-gray-500", icon: User },
};

const ShimmerCard = () => (
    <GlassPanel className="p-4 flex items-center justify-between animate-pulse bg-white/5">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-white/10"></div>
            <div>
                <div className="h-4 w-28 rounded-md bg-white/10 mb-2"></div>
                <div className="h-3 w-20 rounded-md bg-white/10"></div>
            </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-white/10"></div>
    </GlassPanel>
);

const PeerCard = ({ peer, onConnect }: { peer: Peer; onConnect: (peer: Peer) => void }) => {
    const { text, color, icon: Icon } = statusConfig[peer.status];

    const getSignalIcon = (strength: number) => {
        if (strength > 75) return <Signal className="h-5 w-5 text-green-400" />;
        if (strength > 40) return <Signal className="h-5 w-5 text-yellow-400" />;
        return <Signal className="h-5 w-5 text-red-500" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            layout
        >
            <GlassPanel 
                className="p-4 flex items-center justify-between cursor-pointer transition-all duration-200 active:scale-[0.98] active:bg-white/20"
                onClick={() => onConnect(peer)}
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-black/20 text-2xl">
                        {peer.emoji}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white/90">{peer.name}</h3>
                        <div className={cn("flex items-center gap-1.5 text-sm", color)}>
                            <Icon className="h-4 w-4" />
                            <span>{peer.status === 'Unavailable' && peer.lastSeen ? `Last seen ${peer.lastSeen}` : text}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {getSignalIcon(peer.signalStrength)}
                    <Bluetooth className="h-5 w-5 text-blue-300" />
                </div>
            </GlassPanel>
        </motion.div>
    );
};


export default function DiscoverPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isScanning, setIsScanning] = useState(false);
    const [discoveredPeers, setDiscoveredPeers] = useState<Peer[]>([]);

    const handleScan = () => {
        setIsScanning(true);
        setDiscoveredPeers([]);
        toast({ title: 'Scanning for nearby devices...' });

        // Simulate a BLE/Wi-Fi scan
        setTimeout(() => {
            setDiscoveredPeers(mockPeers);
            setIsScanning(false);
            toast({ title: 'Scan complete!', description: 'Found 3 devices.' });
        }, 3000);
    };

    useEffect(() => {
        handleScan();
    }, []);

    const handleConnect = (peer: Peer) => {
        if (peer.status !== 'Available') {
            toast({ variant: 'destructive', title: 'Connection Failed', description: `${peer.name} is currently unavailable.` });
            return;
        }

        setDiscoveredPeers(prev => prev.map(p => p.id === peer.id ? { ...p, status: 'Connecting' } : p));
        toast({ title: 'Connecting...', description: `Establishing handshake with ${peer.name}.` });

        setTimeout(() => {
            setDiscoveredPeers(prev => prev.map(p => p.id === peer.id ? { ...p, status: 'Connected' } : p));
            toast({ variant: 'default', title: 'Success!', description: `Secure session with ${peer.name} is active.` });
            
            // Redirect to chat after a short delay
            setTimeout(() => {
                router.push(`/chat/${peer.id}`);
            }, 1000);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-svh bg-gradient-to-br from-[#0a001a] via-background to-[#001a15] text-white animate-[background-pan_15s_ease-in-out_infinite]">
            <header className="flex items-center justify-between p-4 sticky top-0 z-10">
                <h1 className="text-2xl font-bold">Discover Peers</h1>
                <Button onClick={handleScan} disabled={isScanning} className="gap-2 active:scale-95 transition-transform">
                    <RefreshCw className={cn("h-4 w-4", isScanning && "animate-spin")} />
                    {isScanning ? 'Scanning...' : 'Rescan'}
                </Button>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {isScanning && (
                        <>
                            <ShimmerCard />
                            <ShimmerCard />
                            <ShimmerCard />
                        </>
                    )}
                    {!isScanning && discoveredPeers.length > 0 && discoveredPeers.map(peer => (
                        <PeerCard key={peer.id} peer={peer} onConnect={handleConnect} />
                    ))}
                </AnimatePresence>

                {!isScanning && discoveredPeers.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                        <h2 className="text-xl font-semibold">No Peers Found</h2>
                        <p className="text-white/60 mt-2">Make sure other devices have WinkyX open and are nearby.</p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
