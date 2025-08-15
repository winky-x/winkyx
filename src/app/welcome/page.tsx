"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/ui/glass-panel';
import { saveToStorage } from '@/lib/storage';
import { ShieldCheck, WifiOff, Ghost } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    saveToStorage('hasLaunched', 'true');
    router.push('/chat');
  };

  return (
    <div className="h-svh w-full flex flex-col overflow-hidden bg-gradient-to-br from-[#0a001a] via-background to-[#001a15] font-sans animate-[background-pan_15s_ease-in-out_infinite]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="flex flex-col items-center justify-center gap-8 text-center animate-in fade-in-50 slide-in-from-bottom-10 duration-700">
          <GlassPanel className="w-full max-w-md items-center p-8">
            <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10 p-1">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 blur-md animate-pulse"></div>
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-background">
                <span className="text-3xl font-bold tracking-tighter">W</span>
              </div>
            </div>
            <h1 className="font-headline text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
              WinkyX
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Encrypted. Offline. Yours Forever.
            </p>
          </GlassPanel>

          <div className="grid w-full max-w-md grid-cols-1 gap-4 md:grid-cols-3">
            <GlassPanel className="p-4 items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-green-400" />
              <h3 className="font-semibold text-primary-foreground">Secure Messaging</h3>
              <p className="text-xs text-muted-foreground">End-to-end AES-256 encryption.</p>
            </GlassPanel>
            <GlassPanel className="p-4 items-center gap-2">
              <WifiOff className="h-8 w-8 text-blue-400" />
              <h3 className="font-semibold text-primary-foreground">Offline Connectivity</h3>
              <p className="text-xs text-muted-foreground">Bluetooth & Wi-Fi Direct powered.</p>
            </GlassPanel>
            <GlassPanel className="p-4 items-center gap-2">
              <Ghost className="h-8 w-8 text-purple-400" />
              <h3 className="font-semibold text-primary-foreground">Private & Anonymous</h3>
              <p className="text-xs text-muted-foreground">No accounts. No tracking. No ads.</p>
            </GlassPanel>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-background via-background/80 to-transparent">
        <div className="relative w-full max-w-xs mx-auto">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="w-full bg-primary/90 text-lg font-bold text-primary-foreground transition-all duration-300"
          >
            Get Started
          </Button>
           <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 opacity-50 blur transition-all duration-300 -z-10"></div>
        </div>
      </footer>
    </div>
  );
}
