
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { ArrowLeft, Camera, QrCode, Lock, ChevronRight, Copy, KeyRound, Palette } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const SettingsItem = ({ icon, label, value, action, isFirst, isLast, onPress }) => {
    const IconComponent = icon;
    return (
        <StyledTouchableOpacity 
            onPress={onPress}
            className={`flex-row items-center w-full min-h-[48px] px-4 active:bg-muted/50 ${!isFirst ? 'border-t border-border' : ''} ${isFirst ? 'rounded-t-xl' : ''} ${isLast ? 'rounded-b-xl' : ''}`}
        >
            <StyledView className="items-center justify-center h-7 w-7 rounded-lg mr-4 bg-muted">
                <IconComponent color="hsl(var(--foreground))" size={20} />
            </StyledView>
            <StyledText className="text-foreground font-medium text-base flex-1">{label}</StyledText>
            <StyledView className="ml-auto flex-row items-center gap-2 overflow-hidden">
                {value && <StyledText className="text-muted-foreground text-sm font-mono" numberOfLines={1}>{value}</StyledText>}
                {action === 'copy' && <Copy color="hsl(var(--muted-foreground))" size={16} />}
                {action === 'chevron' && <ChevronRight color="hsl(var(--muted-foreground))" size={20} />}
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

    const handlePress = (screen: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate(screen);
    };

    const handleCopy = (keyType: string, keyValue: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert(`${keyType} Copied`, `Value: ${keyValue}`);
        // Clipboard.setString(keyValue); // In a real app
    };
    
    const handleEditAvatar = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert("Edit Avatar", "Avatar selection would open here.");
    };
    
    const handleEditProfile = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert("Edit Profile", "Profile editing UI would open here.");
    };

    return (
        <StyledView className="flex-1 bg-background">
            <SafeAreaView className="flex-1">
                {/* Header */}
                <StyledView className="sticky top-0 z-20 flex-row items-center p-4 bg-background/80 backdrop-blur-lg border-b border-border">
                    <StyledTouchableOpacity onPress={() => navigation.goBack()} className="h-10 w-10 rounded-full items-center justify-center active:bg-muted/50">
                        <ArrowLeft color="hsl(var(--foreground))" size={24}/>
                    </StyledTouchableOpacity>
                    <StyledText className="text-2xl font-bold tracking-tight ml-2 text-foreground">Profile</StyledText>
                </StyledView>

                <StyledScrollView className="flex-1 p-4 space-y-8">
                    {/* Profile Header */}
                    <StyledView className="items-center text-center gap-4 py-4">
                        <StyledView className="relative w-28 h-28">
                            <StyledView className="w-full h-full rounded-full bg-secondary items-center justify-center border-2 border-border">
                                <StyledText className="text-secondary-foreground text-3xl font-bold">UA</StyledText>
                            </StyledView>
                            <StyledTouchableOpacity onPress={handleEditAvatar} className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary items-center justify-center border-2 border-background">
                                <Camera color="hsl(var(--primary-foreground))" size={16} />
                            </StyledTouchableOpacity>
                        </StyledView>

                        <StyledView className="items-center">
                            <StyledTouchableOpacity onPress={handleEditProfile} className="flex-row items-center gap-2">
                                <StyledText className="font-semibold text-2xl text-foreground">{nickname}</StyledText>
                                <Camera color="hsl(var(--muted-foreground))" size={16} />
                            </StyledTouchableOpacity>
                            <StyledText className="text-sm text-muted-foreground mt-1">{desc}</StyledText>
                        </StyledView>

                        <StyledView className="flex-row items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                            <StyledText className="text-xs text-muted-foreground">ID: a4b8-x9z1-p3q7</StyledText>
                        </StyledView>
                    </StyledView>
                    
                    {/* Settings Groups */}
                    <StyledView className="space-y-6">
                        <StyledView className="bg-card border border-border rounded-xl">
                            <SettingsItem icon={QrCode} label="Show QR Code" action="chevron" isFirst onPress={() => handlePress('QRCode')} />
                            <SettingsItem icon={Lock} label="Reset PIN" action="chevron" onPress={() => handlePress('PinSettings')} />
                            <SettingsItem icon={Lock} label="Manage Biometrics" action="chevron" isLast onPress={() => handlePress('Biometrics')} />
                        </StyledView>
                         <StyledView className="bg-card border border-border rounded-xl">
                            <SettingsItem icon={KeyRound} label="Public Key" value={publicKey} action="copy" isFirst onPress={() => handleCopy('Public Key', publicKey)} />
                            <SettingsItem icon={KeyRound} label="Signing Key" value={signingKey} action="copy" isLast onPress={() => handleCopy('Signing Key', signingKey)} />
                        </StyledView>
                        <StyledView className="bg-card border border-border rounded-xl">
                            <SettingsItem icon={Palette} label="App Theme" action="chevron" isFirst isLast onPress={() => handlePress('ThemeSettings')} />
                        </StyledView>
                    </StyledView>
                </StyledScrollView>
            </SafeAreaView>
        </StyledView>
    );
}
