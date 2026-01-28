import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Colors = {
  light: {
    background: '#ffffff',
    text: '#000000',
    card: '#f9f9f9',
    border: '#000000',
    primary: '#4630EB',
    secondary: '#666666'
  },
  dark: {
    background: '#2c2f33', 
    text: '#ffffff',
    card: '#23272a',   
    border: '#4f545c',    
    primary: '#5865f2',    
    secondary: '#b9bbbe'   
  }
};

type ThemeContextType = {
  isDark: boolean;
  colors: typeof Colors.light;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('user-theme');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    await AsyncStorage.setItem('user-theme', newMode ? 'dark' : 'light');
  };

  const theme = {
    isDark,
    colors: isDark ? Colors.dark : Colors.light,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};