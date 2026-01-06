import { useState, useEffect, useRef } from 'react';
import { ThemeName } from './themes';
import { getLocalSettingsSnapshot, loadSettings, saveSetting } from './storage';

export function useTheme(onSaveSuccess?: () => void, onSaveError?: (error: string) => void) {
  const hasUserChangedRef = useRef(false);
  const [theme, setThemeState] = useState<ThemeName>(
    () => getLocalSettingsSnapshot().theme as ThemeName
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // 初始化时从 Supabase/localStorage 加载主题
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

  // 保存主题到 Supabase/localStorage
  useEffect(() => {
    if (!isLoaded) return; // 避免初始化时触发保存
    if (!hasUserChangedRef.current) return; // 避免初始化加载触发提示

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
