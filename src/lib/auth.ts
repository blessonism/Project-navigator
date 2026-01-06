/**
 * 身份验证工具函数
 */

import { safeSessionStorage } from './storageDetector';

const SESSION_KEY = 'navigator_admin_authenticated';

/**
 * 使用 Web Crypto API 生成密码的 SHA-256 哈希
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * 验证密码是否正确
 */
export async function verifyPassword(password: string): Promise<boolean> {
  const expectedHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;

  if (!expectedHash) {
    console.error('未配置管理员密码哈希，请检查 .env 文件');
    return false;
  }

  const inputHash = await hashPassword(password);
  return inputHash === expectedHash;
}

/**
 * 检查当前会话是否已认证
 */
export function isAuthenticated(): boolean {
  return safeSessionStorage.getItem(SESSION_KEY) === 'true';
}

/**
 * 设置认证状态
 */
export function setAuthenticated(authenticated: boolean): void {
  if (authenticated) {
    safeSessionStorage.setItem(SESSION_KEY, 'true');
  } else {
    safeSessionStorage.removeItem(SESSION_KEY);
  }
}

/**
 * 退出登录
 */
export function logout(): void {
  setAuthenticated(false);
}
