
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GitMerge, Heart } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-svh bg-black text-white font-sans">
      {/* BG */}
      <div className="absolute inset-0 -z-20 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-black animate-background-pan" />
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center p-4 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10 rounded-full">
          <ArrowLeft />
        </Button>
         <h1 className="text-2xl font-bold tracking-tight ml-2">About WinkyX</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-in fade-in-50 slide-in-from-bottom-10 duration-700">
        <GlassPanel className="w-full max-w-md items-center p-8">
            <h1 className="font-headline text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
              Our Mission
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              WinkyX was born from a simple belief: your conversations are yours alone. In a world of data harvesting and surveillance, we provide a sanctuary for true privacy.
            </p>
            <p className="mt-4 text-muted-foreground">
              We are open-source, community-driven, and committed to building a messaging tool that respects you.
            </p>
            <div className="flex flex-col gap-4 mt-8 w-full">
                 <Button className="w-full" disabled>
                    <GitMerge className="mr-2" /> View on GitHub (Coming Soon)
                </Button>
                <Button className="w-full" variant="secondary" disabled>
                    <Heart className="mr-2" /> Meet the Contributors
                </Button>
            </div>
        </GlassPanel>
      </main>
    </div>
  );
}
