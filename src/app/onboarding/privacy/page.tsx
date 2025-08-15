"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/ui/glass-panel';
import { ShieldCheck, CloudOff, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyOnboardingPage() {
  const router = useRouter();

  const handleAccept = () => {
    router.push('/welcome');
  };

  const Feature = ({ icon: Icon, title, text }: { icon: React.ElementType, title: string, text: string }) => (
    <div className="flex items-start gap-4 text-left">
      <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-black/20 mt-1">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <div>
        <h3 className="font-semibold text-primary-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );

  return (
    <div className="h-svh w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a001a] via-background to-[#001a15] font-sans animate-[background-pan_15s_ease-in-out_infinite]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <main className="flex-1 overflow-y-auto p-4 flex items-center">
        <motion.div 
          className="flex flex-col items-center justify-center gap-8 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <GlassPanel className="w-full max-w-md items-center p-8">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
              Your Privacy, Your Rules
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              WinkyX is built on a foundation of total respect for your data.
            </p>

            <div className="space-y-6 mt-8">
                <Feature icon={CloudOff} title="No Cloud Storage" text="Your messages never touch our servers. They exist only on your device and the devices of people you talk to." />
                <Feature icon={EyeOff} title="No Data Harvesting" text="We don't track you, we don't sell your data, and we don't show you ads. Ever." />
                <Feature icon={ShieldCheck} title="Local-First Encryption" text="All data, including messages and contacts, is encrypted on your device before it's sent anywhere." />
            </div>
             <Button
                size="lg"
                onClick={handleAccept}
                className="w-full mt-8 bg-accent/80 text-lg font-bold text-accent-foreground transition-all duration-300 hover:bg-accent/100 hover:shadow-[0_0_20px_hsl(var(--accent))] active:scale-95"
            >
                I Accept These Values
            </Button>
          </GlassPanel>
        </motion.div>
      </main>
    </div>
  );
}
