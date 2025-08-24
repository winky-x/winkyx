
import React from 'react';
import { SafeAreaView, View, Text, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import LiquidGlass from '../components/LiquidGlass';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

export default function ParityHarnessScreen() {
    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'hsl(var(--background))' }}>
        <StyledScrollView>
            <StyledView className="bg-background p-4 space-y-6">
                <StyledText className="text-foreground text-3xl font-bold mb-4 font-headline">UI Parity Harness</StyledText>
                
                 {/* Liquid Glass */}
                <StyledView>
                    <StyledText className="text-xl font-bold text-foreground mb-2">Liquid Glass</StyledText>
                    <StyledView className="items-center justify-center p-4">
                        <LiquidGlass>
                           <StyledText className="text-white font-bold text-2xl">W</StyledText>
                        </LiquidGlass>
                    </StyledView>
                </StyledView>

                {/* Colors */}
                <StyledView>
                    <StyledText className="text-xl font-bold text-foreground mb-2">Colors</StyledText>
                    <StyledView className="flex-row flex-wrap gap-2">
                        <StyledView className="p-4 rounded-lg bg-primary"><StyledText className="text-primary-foreground">Primary</StyledText></StyledView>
                        <StyledView className="p-4 rounded-lg bg-secondary"><StyledText className="text-secondary-foreground">Secondary</StyledText></StyledView>
                        <StyledView className="p-4 rounded-lg bg-destructive"><StyledText className="text-destructive-foreground">Destructive</StyledText></StyledView>
                        <StyledView className="p-4 rounded-lg bg-accent"><StyledText className="text-accent-foreground">Accent</StyledText></StyledView>
                        <StyledView className="p-4 rounded-lg bg-background border border-border"><StyledText className="text-foreground">Background</StyledText></StyledView>
                    </StyledView>
                </StyledView>

                {/* Typography */}
                <StyledView>
                    <StyledText className="text-xl font-bold text-foreground mb-2">Typography</StyledText>
                    <StyledView className="space-y-2">
                        <StyledText className="font-body text-foreground text-base">Body Font (Inter Regular)</StyledText>
                        <StyledText className="font-body text-foreground text-base font-medium">Body Font (Inter Medium)</StyledText>
                        <StyledText className="font-body text-foreground text-base font-bold">Body Font (Inter Bold)</StyledText>
                        <StyledText className="font-headline text-foreground text-2xl">Headline Font (Orbitron Regular)</StyledText>
                        <StyledText className="font-headline text-foreground text-2xl font-bold">Headline Font (Orbitron Bold)</StyledText>
                        <StyledText className="font-code text-foreground text-base">Code Font (Source Code Pro)</StyledText>
                    </StyledView>
                </StyledView>

                {/* Cards & Panels */}
                <StyledView>
                    <StyledText className="text-xl font-bold text-foreground mb-2">Cards & Panels</StyledText>
                    <StyledView className="bg-card p-4 rounded-lg border border-border">
                        <StyledText className="text-card-foreground font-bold">Card Title</StyledText>
                        <StyledText className="text-muted-foreground mt-1">This is a standard card component.</StyledText>
                    </StyledView>
                </StyledView>

                {/* Buttons */}
                <StyledView>
                    <StyledText className="text-xl font-bold text-foreground mb-2">Buttons</StyledText>
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
                </StyledView>

                {/* Inputs */}
                <StyledView>
                    <StyledText className="text-xl font-bold text-foreground mb-2">Inputs</StyledText>
                    <StyledView className="bg-input p-3 rounded-md border border-border h-10 justify-center">
                        <StyledText className="text-muted-foreground">Input field placeholder</StyledText>
                    </StyledView>
                </StyledView>

            </StyledView>
        </StyledScrollView>
    </SafeAreaView>
    );
}
