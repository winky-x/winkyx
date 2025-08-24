
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { ArrowLeft } from 'lucide-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function PinSettingsScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Header */}
            <StyledView className="flex-row items-center p-4 border-b border-border">
                <StyledTouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <ArrowLeft color="hsl(var(--foreground))" size={24} />
                </StyledTouchableOpacity>
                <StyledText className="text-xl font-bold text-foreground ml-4">PIN Settings</StyledText>
            </StyledView>
            
            <StyledView className="flex-1 items-center justify-center">
                <StyledText className="text-foreground text-lg">PIN Settings Screen</StyledText>
                <StyledText className="text-muted-foreground mt-2">UI for changing and resetting PIN will be here.</StyledText>
            </StyledView>
        </SafeAreaView>
    );
}
