import { logger } from './logger';

export function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    logger.warn(`${type} 不可用:`, error);
    return false;
  }
}

export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      if (!isStorageAvailable('localStorage')) return null;
      return localStorage.getItem(key);
    } catch (error) {
      logger.warn('localStorage.getItem 失败:', error);
      return null;
    }
  },

  setItem(key: string, value: string): boolean {
    try {
      if (!isStorageAvailable('localStorage')) return false;
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      logger.warn('localStorage.setItem 失败:', error);
      return false;
    }
  },

  removeItem(key: string): boolean {
    try {
      if (!isStorageAvailable('localStorage')) return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.warn('localStorage.removeItem 失败:', error);
      return false;
    }
  },
};

export const safeSessionStorage = {
  getItem(key: string): string | null {
    try {
      if (!isStorageAvailable('sessionStorage')) return null;
      return sessionStorage.getItem(key);
    } catch (error) {
      logger.warn('sessionStorage.getItem 失败:', error);
      return null;
    }
  },

  setItem(key: string, value: string): boolean {
    try {
      if (!isStorageAvailable('sessionStorage')) return false;
      sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      logger.warn('sessionStorage.setItem 失败:', error);
      return false;
    }
  },

  removeItem(key: string): boolean {
    try {
      if (!isStorageAvailable('sessionStorage')) return false;
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.warn('sessionStorage.removeItem 失败:', error);
      return false;
    }
  },
};
