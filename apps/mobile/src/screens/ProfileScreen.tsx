
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { Svg, Path } from 'react-native-svg';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

// Icons
const ArrowLeftIcon = (props) => <Svg height="24" width="24" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12.707 17.707a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 1.414L8.414 12l4.293 4.293a1 1 0 0 1 0 1.414Z"/></Svg>;
const CameraIcon = (props) => <Svg height="16" width="16" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20 6h-3.17L15 4H9L7.17 6H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Zm-8 13a5 5 0 1 1 5-5a5 5 0 0 1-5 5Z"/></Svg>;
const QrCodeIcon = (props) => <Svg height="20" width="20" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-2h8V3h-8v8zm2-6h4v4h-4V5zm6 8h2v2h-2v-2zm-4 0h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2-4h2v2h-2v-2zm4 4h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2z"/></Svg>;
const LockIcon = (props) => <Svg height="20" width="20" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm0 2a3 3 0 0 1 3 3v2H9V7a3 3 0 0 1 3-3Z"/></Svg>;
const ChevronRightIcon = (props) => <Svg height="20" width="20" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M9.293 17.707a1 1 0 0 1 0-1.414L13.586 12L9.293 7.707a1 1 0 0 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0Z"/></Svg>;
const CopyIcon = (props) => <Svg height="16" width="16" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M16 3H5a2 2 0 0 0-2 2v11h2V5h11V3Zm3 4H8a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/></Svg>;
const KeyRoundIcon = (props) => <Svg height="20" width="20" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M16.5 8a4.5 4.5 0 1 0-6.364 6.364L4 20.5v-2.5l.5-.5H6v-2h2v-2h1.5l1.04-1.04a4.5 4.5 0 0 0 5.96-5.96ZM15 9.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z"/></Svg>;


const SettingsItem = ({ icon, label, value, action, isFirst, isLast }) => {
    const IconComponent = icon;
    return (
        <StyledTouchableOpacity className={`flex-row items-center w-full min-h-[48px] px-4 active:bg-white/10 ${!isFirst ? 'border-t border-white/10' : ''} ${isFirst ? 'rounded-t-xl' : ''} ${isLast ? 'rounded-b-xl' : ''}`}>
            <StyledView className="items-center justify-center h-7 w-7 rounded-lg mr-4 bg-white/15">
                <IconComponent className="text-white/80" />
            </StyledView>
            <StyledText className="text-white/90 font-medium text-base flex-1">{label}</StyledText>
            <StyledView className="ml-auto flex-row items-center gap-2 overflow-hidden">
                {value && <StyledText className="text-white/50 text-sm font-mono" numberOfLines={1}>{value}</StyledText>}
                {action === 'copy' && <CopyIcon className="text-white/70" />}
                {action === 'chevron' && <ChevronRightIcon className="text-white/40" />}
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
                        <ArrowLeftIcon className="text-white" />
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
                                <CameraIcon className="text-primary-foreground" />
                            </StyledTouchableOpacity>
                        </StyledView>

                        <StyledView className="items-center">
                            <StyledView className="flex-row items-center gap-2">
                                <StyledText className="font-semibold text-2xl text-white">{nickname}</StyledText>
                                <CameraIcon className="text-white/50" />
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
                            <SettingsItem icon={QrCodeIcon} label="Show QR Code" action="chevron" isFirst />
                            <SettingsItem icon={LockIcon} label="Reset PIN" action="chevron" />
                            <SettingsItem icon={LockIcon} label="Manage Biometrics" action="chevron" isLast />
                        </StyledView>
                         <StyledView className="bg-white/5 border border-white/10 rounded-xl">
                            <SettingsItem icon={KeyRoundIcon} label="Public Key" value={publicKey} action="copy" isFirst />
                            <SettingsItem icon={KeyRoundIcon} label="Signing Key" value={signingKey} action="copy" isLast />
                        </StyledView>
                    </StyledView>
                </StyledScrollView>
            </SafeAreaView>
        </StyledView>
    );
}

