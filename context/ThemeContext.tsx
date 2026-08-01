import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  resolveColors,
  type AppColors,
  type ThemeMode,
} from '@/constants/theme';

const STORAGE_KEY = 'flowtodo.theme';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colors: AppColors;
  isDark: boolean;
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('auto');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'auto') {
          setThemeState(stored);
        }
      })
      .finally(() => setReady(true));
  }, []);

  const setTheme = (next: ThemeMode) => {
    setThemeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  const systemDark = systemScheme === 'dark';
  const colors = useMemo(() => resolveColors(theme, systemDark), [theme, systemDark]);
  const isDark = theme === 'dark' || (theme === 'auto' && systemDark);

  // Always mount children — returning null remounted AuthProvider and wiped the session.
  const value = useMemo(
    () => ({ theme, setTheme, colors, isDark, ready }),
    [theme, colors, isDark, ready]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
