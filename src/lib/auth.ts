import { safeSessionStorage } from './storageDetector';
import { logger } from './logger';

const SESSION_KEY = 'navigator_admin_authenticated';

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyPassword(password: string): Promise<boolean> {
  const expectedHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;

  if (!expectedHash) {
    logger.error('未配置管理员密码哈希，请检查 .env 文件');
    return false;
  }

  const inputHash = await hashPassword(password);
  return inputHash === expectedHash;
}

export function isAuthenticated(): boolean {
  return safeSessionStorage.getItem(SESSION_KEY) === 'true';
}

export function setAuthenticated(authenticated: boolean): void {
  if (authenticated) {
    safeSessionStorage.setItem(SESSION_KEY, 'true');
  } else {
    safeSessionStorage.removeItem(SESSION_KEY);
  }
}

export function logout(): void {
  setAuthenticated(false);
}
