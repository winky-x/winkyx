
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ChevronRight,
  Copy,
  User,
  Lock,
  Fingerprint,
  Bell,
  Palette,
  Globe,
  LogOut,
  Check,
  QrCode,
  KeyRound,
  Camera,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { saveToStorage, getFromStorage } from '@/lib/storage'
import { cn } from '@/lib/utils'
import { getIdentity, getPublicKeyFingerprint } from '@/services/identity'
import type { Identity } from '@/services/identity'

const SettingsItemGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl">
    {children}
  </div>
)

const SettingsItem = ({
  icon: Icon,
  label,
  value,
  action,
  onClick,
  isFirst,
  isLast,
}: {
  icon: React.ElementType
  label: string
  value?: string
  action?: 'chevron' | 'none' | 'copy'
  onClick?: () => void
  isFirst?: boolean
  isLast?: boolean
}) => {
  const [hasCopied, setHasCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (value) {
      navigator.clipboard.writeText(value)
      setHasCopied(true)
      toast({ title: 'Copied to Clipboard' })
      setTimeout(() => setHasCopied(false), 2000)
    }
  }

  return (
  <div
    onClick={onClick}
    className={cn(
      'flex items-center w-full min-h-[48px] px-4 bg-transparent transition-colors duration-200 active:bg-white/10',
      onClick && 'cursor-pointer',
      !isFirst && 'border-t border-white/10',
      isFirst && 'rounded-t-xl',
      isLast && 'rounded-b-xl'
    )}
  >
    <div className="flex items-center justify-center h-7 w-7 rounded-lg mr-4 bg-white/15 text-white/80">
      <Icon className="h-5 w-5" />
    </div>
    <span className="text-white/90 font-medium text-base flex-1">{label}</span>
    <div className="ml-auto flex items-center gap-2 overflow-hidden">
      {value && <span className="text-white/50 text-sm font-mono truncate">{value}</span>}
      {action === 'copy' && (
         <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleCopy}>
           {hasCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
         </Button>
      )}
      {action === 'chevron' && <ChevronRight className="h-5 w-5 text-white/40 flex-shrink-0" />}
    </div>
  </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null);


  const [nickname, setNickname] = useState('')
  const [desc, setDesc] = useState('')
  const [tempName, setTempName] = useState('')
  const [tempDesc, setTempDesc] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)


  useEffect(() => {
    const storedName = getFromStorage('winkyx_nickname') || ''
    const storedDesc = getFromStorage('winkyx_description') || ''
    
    if (storedName) {
        setNickname(storedName)
        setTempName(storedName)
    }
     if (storedDesc) {
        setDesc(storedDesc)
        setTempDesc(storedDesc)
    }

    getIdentity().then(id => {
      setIdentity(id);
      if (!storedName && id) {
          const generatedName = `User ${getPublicKeyFingerprint(id).split('-')[0]}`
          setNickname(generatedName)
          setTempName(generatedName)
          saveToStorage('winkyx_nickname', generatedName)
      }
      if (!storedDesc) {
          const generatedDesc = "Founder & Dreamer"
          setDesc(generatedDesc)
          setTempDesc(generatedDesc)
          saveToStorage('winkyx_description', generatedDesc)
      }
    });

  }, [])
  
  const onImageChange = (file: File) => {
    // In a real app, you'd upload this file or store it locally.
    // For this example, we'll just create a temporary URL to display it.
    setImageUrl(URL.createObjectURL(file));
    toast({ title: "Profile picture updated!" });
  }

  const handleEditClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  const handleSave = () => {
    saveToStorage('winkyx_nickname', tempName)
    saveToStorage('winkyx_description', tempDesc)
    setNickname(tempName)
    setDesc(tempDesc)
    setIsEditing(false)
    toast({ title: 'Profile Updated', description: 'Your changes have been saved.' })
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  
  const truncateKey = (key: string | undefined): string => {
    if (!key) return '...';
    if (key.length <= 10) return key;
    return `${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
  }


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
        <h1 className="text-2xl font-bold tracking-tight ml-2">Profile</h1>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col p-4 z-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          {/* Avatar */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto active:scale-95 transition-transform duration-150 ease-in-out">
            <div className="w-full h-full rounded-full overflow-hidden bg-white/10 flex items-center justify-center shadow-lg border-2 border-white/20">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="User DP"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-3xl font-bold">{nickname ? getInitials(nickname) : "..."}</span>
              )}
            </div>
            <button
              onClick={handleEditClick}
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-primary-foreground shadow-md flex items-center justify-center hover:scale-110 active:scale-100 transition-all border-2 border-black"
              aria-label="Edit profile picture"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>


          {/* Name + Desc */}
          {isEditing ? (
            <div className="w-full flex flex-col gap-2 items-center">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Your name"
                className="w-48 h-10 text-center text-xl bg-white/10 border-white/20"
                autoFocus
              />
              <Input
                value={tempDesc}
                onChange={(e) => setTempDesc(e.target.value)}
                placeholder="Your description"
                className="w-60 h-9 text-center text-sm bg-white/10 border-white/20"
              />
              <Button size="sm" onClick={handleSave} className="mt-2 px-4 py-1 bg-white text-black rounded-full">
                Save
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div onClick={() => setIsEditing(true)} className="flex items-center gap-2 cursor-pointer">
                <h2 className="font-semibold text-2xl">{nickname}</h2>
                <Camera className="h-4 w-4 text-white/50" />
              </div>
              <p className="text-sm text-white/60 mt-1">{desc}</p>
            </div>
          )}

          {/* User ID */}
           <div
            className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs text-white/70"
          >
            <span>ID: {identity ? getPublicKeyFingerprint(identity) : '...'}</span>
          </div>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          <SettingsItemGroup>
            <SettingsItem icon={QrCode} label="Show QR Code" action="chevron" onClick={() => {}} isFirst />
            <SettingsItem icon={Lock} label="Reset PIN" action="chevron" onClick={() => {}} />
            <SettingsItem icon={Fingerprint} label="Manage Biometrics" action="chevron" onClick={() => {}} isLast />
          </SettingsItemGroup>
          
           <SettingsItemGroup>
             <SettingsItem icon={KeyRound} label="Public Key" value={truncateKey(identity?.publicKeyBase64)} action="copy" onClick={() => {}} isFirst />
            <SettingsItem icon={KeyRound} label="Signing Key" value={truncateKey(identity?.signPublicKeyBase64)} action="copy" onClick={() => {}} isLast />
          </SettingsItemGroup>

          <SettingsItemGroup>
            <SettingsItem icon={Bell} label="Notification Preferences" action="chevron" onClick={() => {}} isFirst />
            <SettingsItem icon={Palette} label="App Theme" value="Dark" action="chevron" onClick={() => {}} />
            <SettingsItem icon={Globe} label="Language" value="English" action="chevron" onClick={() => {}} isLast />
          </SettingsItemGroup>
        </div>

        {/* Sign Out */}
        <div className="pt-4">
          <Button variant="ghost" className="w-full h-12 text-red-500 bg-red-900/20 active:bg-red-900/40 border border-red-500/30">
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  )
}
