import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeName } from '@/types';
import { storage } from '@/services/storage';

type Palette = {
  bg: string;
  surface: string;
  surface2: string;
  surface3: string;
  border: string;
  borderMd: string;
  text: string;
  text2: string;
  muted: string;
  muted2: string;
  green: string;
  greenD: string;
  red: string;
  redD: string;
  amber: string;
  amberD: string;
  blue: string;
  blueD: string;
  accent: string;
  accentD: string;
  purple: string;
};

const palettes: Record<ThemeName, Palette> = {
  dark: {
    bg: '#0d0f14',
    surface: '#14171f',
    surface2: '#1c2030',
    surface3: '#232740',
    border: 'rgba(255,255,255,0.07)',
    borderMd: 'rgba(255,255,255,0.13)',
    text: '#e8eaf0',
    text2: '#c4c8d4',
    muted: '#6b7280',
    muted2: '#4b5563',
    green: '#22c87a',
    greenD: 'rgba(34,200,122,0.12)',
    red: '#f05252',
    redD: 'rgba(240,82,82,0.12)',
    amber: '#f59e0b',
    amberD: 'rgba(245,158,11,0.12)',
    blue: '#3b82f6',
    blueD: 'rgba(59,130,246,0.12)',
    accent: '#7c6af7',
    accentD: 'rgba(124,106,247,0.12)',
    purple: '#a855f7',
  },
  light: {
    bg: '#f0f2f8',
    surface: '#ffffff',
    surface2: '#f4f5fc',
    surface3: '#eaebf5',
    border: 'rgba(0,0,0,0.07)',
    borderMd: 'rgba(0,0,0,0.14)',
    text: '#111827',
    text2: '#374151',
    muted: '#6b7280',
    muted2: '#9ca3af',
    green: '#16a05c',
    greenD: 'rgba(22,160,92,0.10)',
    red: '#dc2626',
    redD: 'rgba(220,38,38,0.10)',
    amber: '#d97706',
    amberD: 'rgba(217,119,6,0.10)',
    blue: '#2563eb',
    blueD: 'rgba(37,99,235,0.10)',
    accent: '#6d57f5',
    accentD: 'rgba(109,87,245,0.10)',
    purple: '#9333ea',
  },
};

type ThemeContextValue = {
  theme: ThemeName;
  colors: Palette;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function FinzyThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeName>('dark');

  // Load theme from storage on mount
  useEffect(() => {
    const savedTheme = storage.get('finzy_theme') as ThemeName | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to storage when it changes
  useEffect(() => {
    storage.set('finzy_theme', theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      colors: palettes[theme],
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useFinzyTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useFinzyTheme must be used inside FinzyThemeProvider');
  }

  return value;
}
