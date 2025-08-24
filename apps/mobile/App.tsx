
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { Orbitron_400Regular, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { SourceCodePro_400Regular } from '@expo-google-fonts/source-code-pro';
import { View, ActivityIndicator } from 'react-native';
import { styled, useColorScheme } from 'nativewind';

import "./global.css";

// Import Services
import { configureBackgroundFetch } from './src/services/background';
import { registerForPushNotificationsAsync } from './src/services/notifications';

// Import Context
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Import Screens
import LockScreen from './src/screens/LockScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ParityHarnessScreen from './src/screens/ParityHarnessScreen';
import NewChatScreen from './src/screens/NewChatScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import QRCodeScreen from './src/screens/QRCodeScreen';
import PinSettingsScreen from './src/screens/PinSettingsScreen';
import BiometricsScreen from './src/screens/BiometricsScreen';
import ThemeSettingsScreen from './src/screens/ThemeSettingsScreen';

const StyledView = styled(View);

const Stack = createNativeStackNavigator();

function AppContent() {
  const { isReady, theme, colorScheme } = useTheme();
  let [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Orbitron: Orbitron_400Regular,
    Orbitron_700Bold,
    SourceCodePro: SourceCodePro_400Regular,
  });

  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme);
  }, [theme, setColorScheme]);

  useEffect(() => {
    // Configure system services on app start
    registerForPushNotificationsAsync();
    configureBackgroundFetch();
  }, []);

  if (!fontsLoaded || !isReady) {
    return (
      <StyledView className="flex-1 items-center justify-center bg-background dark:bg-background">
        <ActivityIndicator size="large" color="hsl(var(--primary))" />
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
                <Stack.Screen name="NewChat" component={NewChatScreen} />
                <Stack.Screen name="Discover" component={DiscoverScreen} />
                <Stack.Screen name="QRCode" component={QRCodeScreen} />
                <Stack.Screen name="PinSettings" component={PinSettingsScreen} />
                <Stack.Screen name="Biometrics" component={BiometricsScreen} />
                <Stack.Screen name="ThemeSettings" component={ThemeSettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
