
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isReady: boolean;
  colorScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'winkyx_theme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [theme, _setTheme] = useState<Theme>('system');
  const { colorScheme: nativewindScheme, setColorScheme } = useNativewindColorScheme();

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_KEY) as Theme | null;
        if (storedTheme) {
          _setTheme(storedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme from storage', error);
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  // Function to set theme and save to storage
  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
      _setTheme(newTheme);
      if (newTheme === 'system') {
        setColorScheme(Appearance.getColorScheme() ?? 'light');
      } else {
        setColorScheme(newTheme);
      }
    } catch (error) {
      console.error('Failed to save theme to storage', error);
    }
  };

  // Listen to system theme changes if theme is 'system'
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === 'system') {
        setColorScheme(colorScheme ?? 'light');
      }
    });
    return () => subscription.remove();
  }, [theme, setColorScheme]);

  const resolvedColorScheme = theme === 'system' ? (Appearance.getColorScheme() ?? 'light') : theme;

  const value = {
    theme,
    setTheme,
    isReady,
    colorScheme: resolvedColorScheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
