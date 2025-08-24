
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { ArrowLeft, QrCode } from 'lucide-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function QRCodeScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Header */}
            <StyledView className="flex-row items-center p-4 border-b border-border">
                <StyledTouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <ArrowLeft color="hsl(var(--foreground))" size={24} />
                </StyledTouchableOpacity>
                <StyledText className="text-xl font-bold text-foreground ml-4">Your QR Code</StyledText>
            </StyledView>
            
            <StyledView className="flex-1 items-center justify-center p-8 space-y-4">
                <StyledView className="bg-white p-6 rounded-2xl">
                    <QrCode size={200} color="black" />
                </StyledView>
                <StyledText className="text-foreground text-lg text-center">Scan this code to connect</StyledText>
                <StyledText className="text-muted-foreground text-center">Your QR code contains your public key for establishing a secure, end-to-end encrypted connection.</StyledText>
            </StyledView>
        </SafeAreaView>
    );
}
