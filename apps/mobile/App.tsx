
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import { styled } from 'nativewind';
import "./global.css";

const StyledView = styled(View);
const StyledText = styled(Text);

// Dummy Screens for scaffolding
const LockScreen = () => (
  <StyledView className="flex-1 items-center justify-center bg-background">
    <StyledText className="text-foreground text-2xl">Lock Screen</StyledText>
  </StyledView>
);

const ChatListScreen = () => (
  <StyledView className="flex-1 items-center justify-center bg-background">
    <StyledText className="text-foreground text-2xl">Chat List</StyledText>
  </StyledView>
);


const ParityHarnessScreen = () => (
    <SafeAreaView style={{ flex: 1 }}>
        <StyledView className="flex-1 bg-background p-4 space-y-4">
            <StyledText className="text-foreground text-2xl font-bold mb-4">UI Parity Harness</StyledText>
            
            <StyledView>
                <StyledText className="text-foreground mb-2 font-headline">Buttons</StyledText>
                <StyledView className="flex-row gap-2">
                    <StyledView className="bg-primary p-2 rounded-md">
                        <StyledText className="text-primary-foreground">Primary</StyledText>
                    </StyledView>
                    <StyledView className="bg-secondary p-2 rounded-md">
                        <StyledText className="text-secondary-foreground">Secondary</StyledText>
                    </StyledView>
                     <StyledView className="bg-destructive p-2 rounded-md">
                        <StyledText className="text-destructive-foreground">Destructive</StyledText>
                    </StyledView>
                    <StyledView className="bg-accent p-2 rounded-md">
                        <StyledText className="text-accent-foreground">Accent</StyledText>
                    </StyledView>
                </StyledView>
            </StyledView>

             <StyledView>
                <StyledText className="text-foreground mb-2 font-headline">Cards & Panels</StyledText>
                <StyledView className="bg-card p-4 rounded-lg border border-border">
                    <StyledText className="text-card-foreground font-bold">Card Title</StyledText>
                    <StyledText className="text-muted-foreground">This is a card component.</StyledText>
                </StyledView>
            </StyledView>

            <StyledView>
                <StyledText className="text-foreground mb-2 font-headline">Inputs</StyledText>
                <StyledView className="bg-input p-2 rounded-md border border-border">
                    <StyledText className="text-muted-foreground">Input field</StyledText>
                </StyledView>
            </StyledView>

            <StyledView>
                <StyledText className="text-foreground mb-2 font-headline">Typography</StyledText>
                <StyledText className="font-body text-foreground">Body Font (Inter)</StyledText>
                <StyledText className="font-headline text-foreground">Headline Font (Orbitron)</StyledText>
                <StyledText className="font-code text-foreground">Code Font (Source Code Pro)</StyledText>
            </StyledView>

        </StyledView>
    </SafeAreaView>
);


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="ParityHarness"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'hsl(var(--background))' },
                }}
            >
                <Stack.Screen name="Lock" component={LockScreen} />
                <Stack.Screen name="ChatList" component={ChatListScreen} />
                <Stack.Screen name="ParityHarness" component={ParityHarnessScreen} />
            </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
