
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ThemeOption = ({ label, value, currentTheme, setTheme }) => {
  const isSelected = currentTheme === value;
  
  const handleSelect = () => {
    setTheme(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <StyledTouchableOpacity 
      onPress={handleSelect}
      className={`flex-row items-center justify-between w-full h-14 px-4 rounded-xl active:bg-muted/50 ${isSelected ? 'bg-primary' : 'bg-card border border-border'}`}
    >
      <StyledText className={`font-semibold text-lg ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
        {label}
      </StyledText>
      {isSelected && <Check color="hsl(var(--primary-foreground))" size={24} />}
    </StyledTouchableOpacity>
  );
};

export default function ThemeSettingsScreen() {
  const navigation = useNavigation();
  const { theme, setTheme } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <StyledView className="sticky top-0 z-20 flex-row items-center p-4 bg-background/80 backdrop-blur-lg border-b border-border">
        <StyledTouchableOpacity onPress={() => navigation.goBack()} className="h-10 w-10 rounded-full items-center justify-center active:bg-muted/50">
          <ArrowLeft color="hsl(var(--foreground))" size={24} />
        </StyledTouchableOpacity>
        <StyledText className="text-2xl font-bold tracking-tight ml-2 text-foreground">App Theme</StyledText>
      </StyledView>

      {/* Options */}
      <StyledView className="flex-1 p-4 space-y-4">
        <ThemeOption label="Light" value="light" currentTheme={theme} setTheme={setTheme} />
        <ThemeOption label="Dark" value="dark" currentTheme={theme} setTheme={setTheme} />
        <ThemeOption label="Follow System" value="system" currentTheme={theme} setTheme={setTheme} />
      </StyledView>
    </SafeAreaView>
  );
}
