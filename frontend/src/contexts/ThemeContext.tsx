'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    // Force dark mode always
    setThemeState('dark');
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  function applyTheme(t: Theme) {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', t === 'dark');
  }

  function setTheme(_t: Theme) {
    // No-op — dark mode is enforced
    setThemeState('dark');
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark');
    }
  }

  function toggle() {
    // No-op — dark mode is enforced
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
