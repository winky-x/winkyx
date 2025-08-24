
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { ArrowLeft, Camera, QrCode, Lock, ChevronRight, Copy, KeyRound } from 'lucide-react-native';


const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);


const SettingsItem = ({ icon, label, value, action, isFirst, isLast }) => {
    const IconComponent = icon;
    return (
        <StyledTouchableOpacity className={`flex-row items-center w-full min-h-[48px] px-4 active:bg-white/10 ${!isFirst ? 'border-t border-white/10' : ''} ${isFirst ? 'rounded-t-xl' : ''} ${isLast ? 'rounded-b-xl' : ''}`}>
            <StyledView className="items-center justify-center h-7 w-7 rounded-lg mr-4 bg-white/15">
                <IconComponent color="rgba(255,255,255,0.8)" size={20} />
            </StyledView>
            <StyledText className="text-white/90 font-medium text-base flex-1">{label}</StyledText>
            <StyledView className="ml-auto flex-row items-center gap-2 overflow-hidden">
                {value && <StyledText className="text-white/50 text-sm font-mono" numberOfLines={1}>{value}</StyledText>}
                {action === 'copy' && <Copy color="rgba(255,255,255,0.7)" size={16} />}
                {action === 'chevron' && <ChevronRight color="rgba(255,255,255,0.4)" size={20} />}
            </StyledView>
        </StyledTouchableOpacity>
    );
};

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [nickname] = useState('User a4b8');
    const [desc] = useState('Founder & Dreamer');
    const [publicKey] = useState('YJj63V...E7Xw=');
    const [signingKey] = useState('bsyP+L...K9HA=');

    return (
        <StyledView className="flex-1 bg-black">
            {/* BG */}
            <StyledView className="absolute inset-0 -z-20 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-black" />

            <SafeAreaView className="flex-1">
                {/* Header */}
                <StyledView className="sticky top-0 z-20 flex-row items-center p-4 bg-black/30 backdrop-blur-lg border-b border-white/10">
                    <StyledTouchableOpacity onPress={() => navigation.goBack()} className="h-10 w-10 rounded-full items-center justify-center">
                        <ArrowLeft color="white" size={24}/>
                    </StyledTouchableOpacity>
                    <StyledText className="text-2xl font-bold tracking-tight ml-2 text-white">Profile</StyledText>
                </StyledView>

                <StyledScrollView className="flex-1 p-4 space-y-8">
                    {/* Profile Header */}
                    <StyledView className="items-center text-center gap-4 py-4">
                        <StyledView className="relative w-28 h-28">
                            <StyledView className="w-full h-full rounded-full bg-white/10 items-center justify-center border-2 border-white/20">
                                <StyledText className="text-white text-3xl font-bold">UA</StyledText>
                            </StyledView>
                            <StyledTouchableOpacity className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary items-center justify-center border-2 border-black">
                                <Camera color="hsl(var(--primary-foreground))" size={16} />
                            </StyledTouchableOpacity>
                        </StyledView>

                        <StyledView className="items-center">
                            <StyledView className="flex-row items-center gap-2">
                                <StyledText className="font-semibold text-2xl text-white">{nickname}</StyledText>
                                <Camera color="rgba(255,255,255,0.5)" size={16} />
                            </StyledView>
                            <StyledText className="text-sm text-white/60 mt-1">{desc}</StyledText>
                        </StyledView>

                        <StyledView className="flex-row items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                            <StyledText className="text-xs text-white/70">ID: a4b8-x9z1-p3q7</StyledText>
                        </StyledView>
                    </StyledView>
                    
                    {/* Settings Groups */}
                    <StyledView className="space-y-6">
                        <StyledView className="bg-white/5 border border-white/10 rounded-xl">
                            <SettingsItem icon={QrCode} label="Show QR Code" action="chevron" isFirst />
                            <SettingsItem icon={Lock} label="Reset PIN" action="chevron" />
                            <SettingsItem icon={Lock} label="Manage Biometrics" action="chevron" isLast />
                        </StyledView>
                         <StyledView className="bg-white/5 border border-white/10 rounded-xl">
                            <SettingsItem icon={KeyRound} label="Public Key" value={publicKey} action="copy" isFirst />
                            <SettingsItem icon={KeyRound} label="Signing Key" value={signingKey} action="copy" isLast />
                        </StyledView>
                    </StyledView>
                </StyledScrollView>
            </SafeAreaView>
        </StyledView>
    );
}
