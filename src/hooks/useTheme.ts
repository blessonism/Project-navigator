import { useState, useEffect, useRef } from 'react';
import { ThemeName } from '@/lib/themes';
import { getLocalSettingsSnapshot, loadSettings, saveSetting } from '@/lib/storage';

export function useTheme(onSaveSuccess?: () => void, onSaveError?: (error: string) => void) {
  const hasUserChangedRef = useRef(false);
  const [theme, setThemeState] = useState<ThemeName>(
    () => getLocalSettingsSnapshot().theme as ThemeName
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('theme-default', 'theme-modern');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const settings = await loadSettings();
        setThemeState(settings.theme as ThemeName);
      } catch (error) {
        console.error('加载主题失败:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!hasUserChangedRef.current) return;

    const saveTheme = async () => {
      try {
        await saveSetting('theme', theme);
        onSaveSuccess?.();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '保存主题失败';
        onSaveError?.(errorMessage);
      }
    };

    saveTheme();
  }, [theme, isLoaded, onSaveSuccess, onSaveError]);

  const setTheme = (newTheme: ThemeName) => {
    hasUserChangedRef.current = true;
    setThemeState(newTheme);
  };

  return { theme, setTheme };
}
