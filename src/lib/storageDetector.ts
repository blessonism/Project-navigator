/**
 * 存储访问检测和安全包装工具
 * 用于检测和处理 "Access to storage is not allowed from this context" 错误
 */

// 检测存储是否可用
export function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn(`${type} 不可用:`, error);
    return false;
  }
}

// 安全的 localStorage 包装器
export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      if (!isStorageAvailable('localStorage')) return null;
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem 失败:', error);
      return null;
    }
  },

  setItem(key: string, value: string): boolean {
    try {
      if (!isStorageAvailable('localStorage')) return false;
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage.setItem 失败:', error);
      return false;
    }
  },

  removeItem(key: string): boolean {
    try {
      if (!isStorageAvailable('localStorage')) return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage.removeItem 失败:', error);
      return false;
    }
  }
};

// 安全的 sessionStorage 包装器
export const safeSessionStorage = {
  getItem(key: string): string | null {
    try {
      if (!isStorageAvailable('sessionStorage')) return null;
      return sessionStorage.getItem(key);
    } catch (error) {
      console.warn('sessionStorage.getItem 失败:', error);
      return null;
    }
  },

  setItem(key: string, value: string): boolean {
    try {
      if (!isStorageAvailable('sessionStorage')) return false;
      sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('sessionStorage.setItem 失败:', error);
      return false;
    }
  },

  removeItem(key: string): boolean {
    try {
      if (!isStorageAvailable('sessionStorage')) return false;
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('sessionStorage.removeItem 失败:', error);
      return false;
    }
  }
};