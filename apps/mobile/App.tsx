
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { Orbitron_400Regular, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { SourceCodePro_400Regular } from '@expo-google-fonts/source-code-pro';
import { View, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';

import "./global.css";

// Import Screens
import LockScreen from './src/screens/LockScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ParityHarnessScreen from './src/screens/ParityHarnessScreen';

const StyledView = styled(View);

const Stack = createNativeStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Orbitron: Orbitron_400Regular,
    Orbitron_700Bold,
    SourceCodePro: SourceCodePro_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <StyledView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="white" />
      </StyledView>
    );
  }

  return (
    <SafeAreaProvider>
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="Lock"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'hsl(var(--background))' },
                    animation: 'fade',
                }}
            >
                <Stack.Screen name="Lock" component={LockScreen} />
                <Stack.Screen name="ChatList" component={ChatListScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="ParityHarness" component={ParityHarnessScreen} />
            </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
