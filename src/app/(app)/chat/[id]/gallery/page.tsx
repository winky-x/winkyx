
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Image as ImageIcon, Mic, FileText, Download, Trash2, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { cn } from '@/lib/utils';
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

const MediaCard = ({ src, alt, date, size }: { src: string, alt: string, date: string, size: string }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative group aspect-square"
    >
        <GlassPanel className="p-0 overflow-hidden h-full w-full">
            <Image src={src} alt={alt} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-110" data-ai-hint="gallery abstract" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                <div className="flex justify-between text-xs">
                    <span>{date}</span>
                    <span>{size}</span>
                </div>
            </div>
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Button variant="ghost" size="icon" className="h-7 w-7 bg-black/50 hover:bg-black/80"><Download className="h-4 w-4"/></Button>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 bg-black/50 hover:bg-red-500/80"><Trash2 className="h-4 w-4"/></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Delete Media?</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogDescription>This action cannot be undone. The file will be permanently deleted.</AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                 </AlertDialog>
            </div>
        </GlassPanel>
    </motion.div>
);

const DocumentRow = ({ name, type, date, size }: { name: string, type: string, date: string, size: string }) => (
     <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="group"
    >
        <GlassPanel className="p-3 flex items-center gap-4 transition-colors hover:bg-white/10">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-black/20">
                <FileText className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
                <p className="font-semibold text-white/90">{name}</p>
                <p className="text-xs text-white/60">{type}</p>
            </div>
            <div className="text-right text-xs text-white/60">
                <p>{date}</p>
                <p>{size}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Share2 className="h-4 w-4"/></Button>
            </div>
        </GlassPanel>
    </motion.div>
)

export default function MediaGalleryPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const mediaItems = Array.from({ length: 12 }, (_, i) => ({
      src: `https://placehold.co/400x400.png`,
      alt: `Media ${i + 1}`,
      date: 'Jun 20, 2024',
      size: '2.3 MB'
  }));
  
  const docItems = [
      { name: "Project_Proposal.pdf", type: "PDF Document", date: "Jun 18, 2024", size: "1.2 MB" },
      { name: "meeting_notes.docx", type: "Word Document", date: "Jun 15, 2024", size: "45 KB" },
      { name: "archive.zip", type: "ZIP Archive", date: "Jun 12, 2024", size: "15.7 MB" }
  ];

  return (
    <div className="flex flex-col h-svh bg-black text-white">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-9 w-9 rounded-full">
          <ArrowLeft />
        </Button>
        <div>
            <h1 className="text-xl font-bold">Media Gallery</h1>
            <p className="text-sm text-white/60">Chat with QuantumLeap</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Tabs defaultValue="media" className="p-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 mb-4">
            <TabsTrigger value="media" className="gap-2"><ImageIcon className="h-4 w-4" /> Media</TabsTrigger>
            <TabsTrigger value="voicenotes" className="gap-2"><Mic className="h-4 w-4" /> Voice Notes</TabsTrigger>
            <TabsTrigger value="docs" className="gap-2"><FileText className="h-4 w-4" /> Documents</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div key="media-content">
              <TabsContent value="media">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {mediaItems.map((item, i) => <MediaCard key={i} {...item} />)}
                  </div>
              </TabsContent>
            </motion.div>
            <motion.div key="voicenotes-content">
               <TabsContent value="voicenotes">
                   <div className="text-center py-20 text-white/60">
                        <Mic className="h-12 w-12 mx-auto mb-4"/>
                        <h3 className="text-lg font-semibold">No Voice Notes</h3>
                        <p>Voice notes sent in this chat will appear here.</p>
                   </div>
              </TabsContent>
            </motion.div>
            <motion.div key="docs-content">
               <TabsContent value="docs">
                   <div className="space-y-2">
                        {docItems.map((doc, i) => <DocumentRow key={i} {...doc} />)}
                   </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  );
}
