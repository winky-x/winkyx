"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFromStorage } from '@/lib/storage';
import { motion } from 'framer-motion';

export default function SmartRouterPage() {
  const router = useRouter();

  useEffect(() => {
    const hasLaunched = getFromStorage('hasLaunched');
    
    // Simulate a delay for animations to be appreciated
    const timer = setTimeout(() => {
      if (hasLaunched) {
        // Security first: always go to lock screen if app has been set up
        router.replace('/lock');
      } else {
        // First-time user flow starts with privacy
        router.replace('/onboarding/privacy');
      }
    }, 2500); 

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white relative font-sans overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
      
      <motion.h1
        className="text-5xl font-bold tracking-wider font-headline"
        style={{fontFamily: "'Orbitron', sans-serif"}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      >
        WinkyX
      </motion.h1>

      <motion.p
        className="text-muted-foreground mt-4 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Offline. Private. Yours.
      </motion.p>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex space-x-2">
            <motion.span className="h-2 w-2 bg-accent rounded-full" animate={{opacity: [0.2, 1, 0.2]}} transition={{duration: 1.5, repeat: Infinity, delay: 0}} />
            <motion.span className="h-2 w-2 bg-accent rounded-full" animate={{opacity: [0.2, 1, 0.2]}} transition={{duration: 1.5, repeat: Infinity, delay: 0.2}}/>
            <motion.span className="h-2 w-2 bg-accent rounded-full" animate={{opacity: [0.2, 1, 0.2]}} transition={{duration: 1.5, repeat: Infinity, delay: 0.4}}/>
        </div>
      </motion.div>

      <motion.p 
        className="absolute bottom-6 text-xs text-muted-foreground/50 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Built with rebellion.
      </motion.p>
    </div>
  );
}
