'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ChevronRight,
  User,
  Shield,
  Palette,
  Bell,
  HelpCircle,
  Info,
  LogOut,
  FileEdit,
  Wifi,
  Lock,
  MessageCircle,
  HardDrive,
  Cpu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getFromStorage } from '@/lib/storage'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'

// Reusable component for grouping list items with a border
const SettingsItemGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-hidden bg-white/5 border border-white/10 rounded-xl">
    {children}
  </div>
)

// Reusable component for an individual list item
const SettingsItem = ({
  icon: Icon,
  label,
  onClick,
  isFirst,
  isLast,
  hasSwitch = false,
  onSwitchChange,
  switchChecked,
  subtext,
}: {
  icon: React.ElementType
  label: string
  onClick?: () => void
  isFirst?: boolean
  isLast?: boolean
  hasSwitch?: boolean
  onSwitchChange?: (checked: boolean) => void
  switchChecked?: boolean
  subtext?: string
}) => {
  const itemClasses = cn(
    'flex items-center w-full min-h-[56px] px-4 transition-colors duration-200',
    !isFirst && 'border-t border-white/10',
    !hasSwitch && 'cursor-pointer active:bg-white/10'
  )

  return (
    <div onClick={!hasSwitch ? onClick : undefined} className={itemClasses}>
      <div className="flex items-center justify-center h-8 w-8 rounded-lg mr-4 bg-white/15 text-white/80 shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-white/90 font-medium text-base">{label}</span>
        {subtext && <p className="text-sm text-white/50">{subtext}</p>}
      </div>
      {hasSwitch ? (
        <Switch checked={switchChecked} onCheckedChange={onSwitchChange} className="ml-auto" />
      ) : (
        <ChevronRight className="h-5 w-5 text-white/40 ml-auto shrink-0" />
      )}
    </div>
  )
}

/**
 * SettingsPage Component
 *
 * This version is optimized for mobile with touch-friendly active states and
 * a clean, responsive layout.
 */
export default function SettingsPage() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [hapticFeedback, setHapticFeedback] = useState(true)

  // Fetch user data for the profile card
  useEffect(() => {
    const storedName = getFromStorage('winkyx_nickname') || 'WinkyX User'
    setNickname(storedName)
  }, [])

  // Generates initials from a name for the avatar fallback
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)

  return (
    <div className="flex flex-col h-svh w-full bg-black text-white font-sans transition-opacity duration-500">
      {/* Dynamic, Subtle Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-purple-900/30 to-black animate-background-pan opacity-70" />
      </div>

      {/* Page Header */}
      <header className="sticky top-0 z-10 flex items-center p-4 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full text-white/80 active:bg-white/10"
          aria-label="Go back"
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight ml-2">Settings</h1>
      </header>

      {/* Scrollable Main Content */}
      <main className="flex-1 p-4 space-y-8 overflow-y-auto">
        {/* Profile Card Link (Transparent with a new design) */}
        <div
          onClick={() => router.push('/profile')}
          className="relative flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-transform active:scale-[0.99] duration-200"
        >
          <Avatar className="h-16 w-16 border-2 border-white/30">
            <AvatarImage src={imageUrl} alt={nickname} />
            <AvatarFallback className="text-xl bg-indigo-500/20 text-indigo-300 border-2 border-indigo-500/30">
              {getInitials(nickname)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{nickname}</h2>
            <p className="text-sm text-white/70">View & Edit Profile</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full text-white/70 active:bg-white/10"
            aria-label="Edit profile"
          >
            <FileEdit className="h-5 w-5" />
          </Button>
        </div>

        {/* Core App Settings */}
        <div className="space-y-4">
          <SettingsItemGroup>
            <SettingsItem icon={User} label="Account" onClick={() => router.push('/settings/account')} isFirst />
            <SettingsItem icon={Shield} label="Privacy & Security" onClick={() => router.push('/settings/security')} />
            <SettingsItem icon={Bell} label="Notifications" onClick={() => router.push('/settings/notifications')} />
            <SettingsItem icon={Palette} label="Appearance" onClick={() => router.push('/settings/appearance')} />
            <SettingsItem
              icon={Wifi}
              label="Offline Mode"
              isLast
              subtext="Messages are sent via Bluetooth and Wi-Fi"
            />
          </SettingsItemGroup>
        </div>

        {/* Support & Legal */}
        <div className="space-y-4">
          <SettingsItemGroup>
            <SettingsItem icon={HelpCircle} label="Help & Support" onClick={() => router.push('/support')} isFirst />
            <SettingsItem
              icon={MessageCircle}
              label="Feedback"
              onClick={() => router.push('/feedback')}
            />
            <SettingsItem icon={Info} label="About WinkyX" onClick={() => router.push('/about')} isLast />
          </SettingsItemGroup>
        </div>

        {/* About WinkyX Section (Expanded and Enhanced) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white/90">About WinkyX</h2>
          <div className="p-4 rounded-xl bg-white/10 border border-white/20 space-y-4">
            <div className="flex items-start gap-4">
              <Lock className="h-8 w-8 text-indigo-400 shrink-0 transition-transform duration-300 active:scale-110" />
              <div>
                <h3 className="text-lg font-semibold text-white">End-to-End Encryption</h3>
                <p className="text-sm text-white/70">
                  Your conversations are secured with industry-leading cryptography, ensuring no one can read your messages but you and the recipient.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Cpu className="h-8 w-8 text-indigo-400 shrink-0 transition-transform duration-300 active:scale-110" />
              <div>
                <h3 className="text-lg font-semibold text-white">Peer-to-Peer Network</h3>
                <p className="text-sm text-white/70">
                  WinkyX connects devices directly using Bluetooth Mesh and local Wi-Fi, completely bypassing servers and the internet. Your data never leaves your local network.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <HardDrive className="h-8 w-8 text-indigo-400 shrink-0 transition-transform duration-300 active:scale-110" />
              <div>
                <h3 className="text-lg font-semibold text-white">100% Offline by Design</h3>
                <p className="text-sm text-white/70">
                  No internet connection, no problem. WinkyX is built from the ground up for use in environments where connectivity is unavailable or unreliable. Your data is your own.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-4">
          <Button
            variant="ghost"
            className="w-full h-12 text-red-400 bg-red-900/20 active:bg-red-900/40 border border-red-500/30"
            onClick={() => {
              // Add your sign-out logic here
              console.log('Signing out...')
            }}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  )
}