
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Sun, Monitor, MessageSquare, Type, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/glass-panel';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

// Mock chat bubble component for live preview
const MockMessage = ({ text, isCurrentUser, bubbleStyle }: { text: string; isCurrentUser?: boolean, bubbleStyle: string }) => (
    <div className={cn("flex w-full items-start gap-2", isCurrentUser && "justify-end")}>
        <div className={cn(
            "max-w-xs p-2.5 text-sm",
            isCurrentUser ? "bg-accent text-accent-foreground" : "bg-white/20 text-white",
            bubbleStyle === 'sharp' && 'rounded-lg',
            bubbleStyle === 'round' && 'rounded-2xl',
            bubbleStyle === 'capsule' && 'rounded-full px-4',
        )}>
            {text}
        </div>
    </div>
);

const fontFamilies: Record<string, string> = {
    clean: 'font-sans',
    cursive: 'font-serif', // Using serif as a placeholder for a more stylistic font
    tech: 'font-mono'
};

export default function AppearancePage() {
    const router = useRouter();
    const { toast } = useToast();
    
    // State for theme customization
    const [theme, setTheme] = useState('dark');
    const [bubbleStyle, setBubbleStyle] = useState('round');
    const [fontFamily, setFontFamily] = useState('clean');
    const [accentColor, setAccentColor] = useState('hsl(260 100% 75%)'); // Default purple accent
    const [fontSize, setFontSize] = useState(14);

    const accentColors = [
        'hsl(260 100% 75%)', // Purple
        'hsl(210 60% 50%)', // Blue
        'hsl(180 70% 40%)', // Teal
        'hsl(340 90% 60%)', // Pink
        'hsl(45 100% 50%)', // Yellow
    ];
    
    const SettingGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <GlassPanel>
            <h3 className="px-2 mb-2 text-sm font-semibold text-white/60">{title}</h3>
            <div className="p-3 space-y-2">
                {children}
            </div>
        </GlassPanel>
    );

    const OptionButton = ({ label, value, state, setState, icon: Icon }: { label: string, value: string, state: string, setState: (v: string) => void, icon?: React.ElementType }) => (
        <Button
            variant="ghost"
            onClick={() => setState(value)}
            className={cn(
                "flex-1 justify-center gap-2 transition-all",
                state === value ? 'bg-white/20 text-white' : 'text-white/60'
            )}
        >
            {Icon && <Icon className="h-4 w-4" />}
            {label}
        </Button>
    );

    return (
        <div className="flex flex-col h-svh w-full bg-black text-white font-sans" style={{ fontSize: `${fontSize}px` }}>
            {/* BG */}
            <div className="absolute inset-0 -z-20 bg-black">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-black animate-background-pan" />
            </div>
            
            <header className="sticky top-0 z-20 flex items-center p-4 bg-black/30 backdrop-blur-lg border-b border-white/10">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10 rounded-full">
                    <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight ml-2">Appearance</h1>
            </header>

            <main className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Live Preview Section */}
                <div>
                    <h3 className="px-4 mb-2 text-sm font-semibold text-white/60">Live Preview</h3>
                    <GlassPanel className={cn("p-4 space-y-3", fontFamilies[fontFamily])} style={{ '--accent': accentColor } as React.CSSProperties}>
                        <MockMessage text="Hey, check out the new theme! ✨" bubbleStyle={bubbleStyle} />
                        <MockMessage text="Looks awesome! Loving the new style." isCurrentUser bubbleStyle={bubbleStyle} />
                    </GlassPanel>
                </div>

                {/* Customization Controls */}
                <SettingGroup title="Chat Bubble Style">
                    <div className="flex gap-2">
                        <OptionButton label="Sharp" value="sharp" state={bubbleStyle} setState={setBubbleStyle} icon={MessageSquare} />
                        <OptionButton label="Round" value="round" state={bubbleStyle} setState={setBubbleStyle} icon={MessageSquare} />
                        <OptionButton label="Capsule" value="capsule" state={bubbleStyle} setState={setBubbleStyle} icon={MessageSquare} />
                    </div>
                </SettingGroup>

                <SettingGroup title="Font Family">
                     <div className="flex gap-2">
                        <OptionButton label="Clean" value="clean" state={fontFamily} setState={setFontFamily} icon={Type} />
                        <OptionButton label="Cursive" value="cursive" state={fontFamily} setState={setFontFamily} icon={Type} />
                        <OptionButton label="Tech" value="tech" state={fontFamily} setState={setFontFamily} icon={Type} />
                    </div>
                </SettingGroup>
                
                 <SettingGroup title="Font Size">
                    <div className="flex items-center gap-4 p-2">
                       <span className="text-xs text-white/60">Aa</span>
                        <Slider
                            value={[fontSize]}
                            onValueChange={(value) => setFontSize(value[0])}
                            min={12}
                            max={18}
                            step={1}
                        />
                       <span className="text-xl text-white/60">Aa</span>
                    </div>
                </SettingGroup>

                <SettingGroup title="Accent Color">
                    <div className="flex justify-around p-2">
                        {accentColors.map(color => (
                            <button key={color} onClick={() => setAccentColor(color)} className="h-8 w-8 rounded-full transition-transform active:scale-90" style={{ backgroundColor: color }}>
                                {accentColor === color && <div className="h-full w-full rounded-full border-2 border-white ring-2 ring-offset-2 ring-offset-black ring-white"></div>}
                            </button>
                        ))}
                    </div>
                </SettingGroup>

                <SettingGroup title="Theme">
                    <div className="flex gap-2">
                        <OptionButton label="Light" value="light" state={theme} setState={setTheme} icon={Sun} />
                        <OptionButton label="Dark" value="dark" state={theme} setState={setTheme} icon={Moon} />
                        <OptionButton label="System" value="system" state={theme} setState={setTheme} icon={Monitor} />
                    </div>
                </SettingGroup>
            </main>
        </div>
    );
}
