import { useState, useEffect } from 'react';
import { ThemeName } from './themes';

const THEME_STORAGE_KEY = 'navigator-theme';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return (stored as ThemeName) || 'default';
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
  };

  return { theme, setTheme };
}
