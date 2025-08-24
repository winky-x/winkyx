
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Code, Trash2, Bug, Share, ArrowLeft, Wifi, UserPlus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { GlassPanel } from '@/components/ui/glass-panel'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { getIdentity, getPublicKeyFingerprint } from "@/services/identity";
import * as comms from '@/services/comms';


type LogType = 'info' | 'warning' | 'error' | 'success' | 'system';

interface LogEntry {
  type: LogType;
  message: string;
  timestamp: string;
}

const logColors: Record<LogType, string> = {
  info: "text-white/80",
  warning: "text-orange-400",
  error: "text-red-500",
  success: "text-green-400",
  system: "text-purple-400",
};

export default function DebugPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);

  const addLog = useCallback((message: string, type: LogType = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = { type, message, timestamp };
    setLogs((prev) => [newLog, ...prev]);
  }, []);

  useEffect(() => {
    addLog("Debug console initialized.", "success");
    getIdentity().then(id => {
        addLog(`Identity loaded. Fingerprint: ${getPublicKeyFingerprint(id)}`, 'system');
    });
  }, [addLog]);

  const handleScan = () => {
    addLog("Starting peer discovery...", "info");
    setIsScanning(true);
    comms.startDiscovery((peer) => {
      addLog(`Discovered Peer: ${peer.name} (Signal: ${peer.signalStrength}dBm)`, 'success');
      setIsScanning(false);
    });
  };
  
  const handleMockPeer = () => {
     addLog("Injecting a mock peer into the system.", "info");
     toast({
        title: "Debug Action",
        description: `Mock peer injected.`,
    });
  }

  const LogLine = ({ log }: { log: LogEntry }) => (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("text-sm font-mono", logColors[log.type])}
    >
      <span className="text-white/40 mr-2">[{log.timestamp}]</span>
      {log.message}
    </motion.p>
  );

  return (
    <div className="flex flex-col h-svh w-full bg-black text-white font-sans">
       {/* BG */}
      <div className="absolute inset-0 -z-20 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-black animate-background-pan" />
      </div>

       {/* Header */}
      <header className="sticky top-0 z-20 flex items-center p-4 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10 rounded-full">
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight ml-2">Debug Console</h1>
         <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="ml-auto"><Trash2 /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action will permanently delete all logs.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  setLogs([]);
                  addLog("Logs cleared by user.", "system");
                }}>Clear Logs</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </header>
    
      <main className="flex-1 flex flex-col p-4 z-10 space-y-8 overflow-y-auto">
        <GlassPanel>
            <h3 className="text-lg font-semibold mb-4">Test Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button onClick={handleScan} disabled={isScanning} className="gap-2">
                  <Wifi className={cn(isScanning && "animate-ping")} /> {isScanning ? 'Scanning...' : 'Scan for Peers'}
                </Button>
                <Button onClick={handleMockPeer} className="gap-2"><UserPlus/> Inject Mock Peer</Button>
            </div>
        </GlassPanel>
        
        <GlassPanel>
            <h3 className="text-lg font-semibold mb-4">Dev Toggles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-md bg-black/20">
                <label htmlFor="verbose-logs" className="font-medium">Verbose Logs</label>
                <Switch id="verbose-logs" onCheckedChange={(c) => addLog(`Verbose logs ${c ? 'enabled' : 'disabled'}`, 'system')} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-md bg-black/20">
                <label htmlFor="ble-only" className="font-medium">Force BLE Only</label>
                <Switch id="ble-only" onCheckedChange={(c) => addLog(`BLE-only mode ${c ? 'enabled' : 'disabled'}`, 'system')} />
            </div>
            </div>
        </GlassPanel>

        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Code />Event Log</h3>
            <Button variant="ghost" size="sm" className="flex items-center gap-2"><Share className="h-4 w-4" /> Export</Button>
          </div>
            <ScrollArea className="h-80 w-full rounded-md border border-white/10 bg-black/50 p-4">
            {logs.length > 0 ? (
                <div className="space-y-2">
                {logs.map((log, index) => (
                    <LogLine key={index} log={log} />
                ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">No logs yet. Trigger an action to see output.</p>
            )}
            </ScrollArea>
        </GlassPanel>
      </main>
    </div>
  );
}
