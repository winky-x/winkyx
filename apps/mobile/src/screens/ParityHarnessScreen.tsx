
import React from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { styled } from 'nativewind';
import LiquidGlass from '../components/LiquidGlass';
import { scheduleTestNotification, registerForPushNotificationsAsync } from '../services/notifications';
import { simulateBackgroundFetch } from '../services/background';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

const Section = ({ title, children }) => (
    <StyledView>
        <StyledText className="text-xl font-bold text-foreground mb-2 font-headline">{title}</StyledText>
        <StyledView className="bg-card p-4 rounded-xl border border-border">
            {children}
        </StyledView>
    </StyledView>
);

const DebugButton = ({ label, onPress }) => (
     <StyledTouchableOpacity onPress={onPress} className="bg-primary p-3 rounded-md active:opacity-70">
        <StyledText className="text-primary-foreground text-center font-bold">{label}</StyledText>
    </StyledTouchableOpacity>
)

export default function ParityHarnessScreen() {

    const handleTestNotification = () => {
        scheduleTestNotification("📬 You've got a message!", "QuantumLeap: Hey there! This is a test notification.");
        Alert.alert("Test Notification", "A test notification has been scheduled to fire in 2 seconds.");
    };

    const handleRequestPermissions = () => {
        registerForPushNotificationsAsync().then(status => {
            Alert.alert("Permission Status", `Notification permission status: ${status}`);
        });
    }

    const handleSimulateFetch = () => {
        simulateBackgroundFetch();
        Alert.alert("Background Fetch", "A background fetch event has been scheduled. Check the console/device logs for output.");
    }

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'hsl(var(--background))' }}>
        <StyledScrollView>
            <StyledView className="bg-background p-4 space-y-6">
                <StyledText className="text-foreground text-3xl font-bold mb-4 font-headline">UI & System Harness</StyledText>
                
                <Section title="System Services">
                    <StyledView className="space-y-2">
                        <DebugButton label="Request Notification Permissions" onPress={handleRequestPermissions} />
                        <DebugButton label="Schedule Test Notification" onPress={handleTestNotification} />
                        <DebugButton label="Simulate Background Fetch" onPress={handleSimulateFetch} />
                    </StyledView>
                </Section>

                 <Section title="Liquid Glass">
                    <StyledView className="items-center justify-center p-4">
                        <LiquidGlass>
                           <StyledText className="text-white font-bold text-2xl">W</StyledText>
                        </LiquidGlass>
                    </StyledView>
                </Section>

                <Section title="Colors">
                    <StyledView className="flex-row flex-wrap gap-2">
                        <StyledView className="p-4 rounded-lg bg-primary"><StyledText className="text-primary-foreground">Primary</StyledText></StyledView>
                        <StyledView className="p-4 rounded-lg bg-secondary"><StyledText className="text-secondary-foreground">Secondary</StyledText></StyledView>
                        <StyledView className="p-4 rounded-lg bg-destructive"><StyledText className="text-destructive-foreground">Destructive</StyledText></StyledView>
                        <StyledView className="p-4 rounded-lg bg-accent"><StyledText className="text-accent-foreground">Accent</StyledText></StyledView>
                        <StyledView className="p-4 rounded-lg bg-background border border-border"><StyledText className="text-foreground">Background</StyledText></StyledView>
                    </StyledView>
                </Section>

                <Section title="Typography">
                    <StyledView className="space-y-2">
                        <StyledText className="font-body text-foreground text-base">Body Font (Inter Regular)</StyledText>
                        <StyledText className="font-body text-foreground text-base font-medium">Body Font (Inter Medium)</StyledText>
                        <StyledText className="font-body text-foreground text-base font-bold">Body Font (Inter Bold)</StyledText>
                        <StyledText className="font-headline text-foreground text-2xl">Headline Font (Orbitron Regular)</StyledText>
                        <StyledText className="font-headline text-foreground text-2xl font-bold">Headline Font (Orbitron Bold)</StyledText>
                        <StyledText className="font-code text-foreground text-base">Code Font (Source Code Pro)</StyledText>
                    </StyledView>
                </Section>

                <Section title="Cards & Panels">
                    <StyledView className="bg-card p-4 rounded-lg border border-border">
                        <StyledText className="text-card-foreground font-bold">Card Title</StyledText>
                        <StyledText className="text-muted-foreground mt-1">This is a standard card component.</StyledText>
                    </StyledView>
                </Section>

                <Section title="Buttons">
                    <StyledView className="flex-row gap-2">
                        <StyledView className="bg-primary p-2 rounded-md">
                            <StyledText className="text-primary-foreground">Primary</StyledText>
                        </StyledView>
                        <StyledView className="border border-input p-2 rounded-md">
                            <StyledText className="text-foreground">Outline</StyledText>
                        </StyledView>
                         <StyledView className="p-2 rounded-md">
                            <StyledText className="text-foreground">Ghost</StyledText>
                        </StyledView>
                    </StyledView>
                </Section>

                <Section title="Inputs">
                    <StyledView className="bg-input p-3 rounded-md border border-border h-10 justify-center">
                        <StyledText className="text-muted-foreground">Input field placeholder</StyledText>
                    </StyledView>
                </Section>

            </StyledView>
        </StyledScrollView>
    </SafeAreaView>
    );
}
