
// src/app/lock/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { Fingerprint, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const CORRECT_PIN = "1234";

const KeypadButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <motion.div
    whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
    className="relative"
  >
    <Button
      variant="ghost"
      className="h-16 w-16 rounded-full text-2xl font-semibold bg-white/10 border border-white/30 backdrop-blur-sm text-white/90 active:bg-white/20 overflow-hidden shadow-lg"
      onClick={onClick}
    >
      {children}
    </Button>
  </motion.div>
);

export default function LockScreenPage() {
  const [pin, setPin] = useState("");
  const [isShaking, setShaking] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("showWelcomeToast", "true");
        }
        router.push("/chat");
      } else {
        toast({
          variant: "destructive",
          title: "Incorrect PIN",
          description: "Please try again.",
        });
        setShaking(true);
        setTimeout(() => {
          setShaking(false);
          setPin("");
        }, 500);
      }
    }
  }, [pin, router, toast]);

  const handleKeyPress = (key: string) => {
    if (pin.length < 4) {
      setPin(pin + key);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleBiometric = () => {
    toast({
      title: "Biometric Authentication",
      description: "Using device capabilities to unlock...",
    });
  };

  const shakeAnimation = {
    shake: {
      x: [0, -8, 8, -8, 8, -4, 4, 0],
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    initial: {
      x: 0,
    },
  };

  const pinDotVariants = {
    filled: {
      scale: 1,
      opacity: 1,
      backgroundColor: "hsl(var(--accent))",
      borderColor: "hsl(var(--accent) / 0.7)",
      boxShadow: "0 0 8px hsl(var(--accent) / 0.5)",
    },
    empty: {
      scale: 0.8,
      opacity: 0.5,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderColor: "rgba(255, 255, 255, 0.4)",
      boxShadow: "none",
    },
  };

  return (
    <div className="h-svh w-full flex items-center justify-center p-4 font-sans relative overflow-hidden bg-black">
      {/* Background Image */}
      <Image
        src="/lock-screen-bg.png"
        alt="Background"
        fill
        className="z-0 object-cover"
        data-ai-hint="abstract background"
      />

      <motion.div
        className="relative z-20 w-full max-w-sm flex flex-col items-center justify-center"
        variants={shakeAnimation}
        animate={isShaking ? "shake" : "initial"}
      >
        <div className="w-full flex flex-col items-center p-8 space-y-8">
          <div className="text-center">
            <h1
              className="font-sans text-3xl font-bold text-white/90"
            >
              Unlock WinkyX
            </h1>
            <p className="text-white/60">
              Enter your PIN to access your messages.
            </p>
          </div>

          <div className="flex justify-center items-center space-x-4 h-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={i}
                  variants={pinDotVariants}
                  initial="empty"
                  animate={pin.length > i ? "filled" : "empty"}
                  transition={{ duration: 0.2 }}
                  className="h-4 w-4 rounded-full border-2"
                />
              ))}
          </div>

          <div className="grid grid-cols-3 gap-5 justify-items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <KeypadButton
                key={num}
                onClick={() => handleKeyPress(String(num))}
              >
                {num}
              </KeypadButton>
            ))}
            <KeypadButton onClick={handleBiometric}>
              <Fingerprint className="h-7 w-7 text-white/70 animate-pulse-slow" />
            </KeypadButton>
            <KeypadButton onClick={() => handleKeyPress("0")}>0</KeypadButton>
            <KeypadButton onClick={handleDelete}>
              <Delete className="h-7 w-7" />
            </KeypadButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
