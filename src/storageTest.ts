/**
 * 存储访问权限测试脚本
 * 用于验证 "Access to storage is not allowed from this context" 错误的修复
 */

import { isStorageAvailable, safeLocalStorage, safeSessionStorage } from './lib/storageDetector';
import { isAuthenticated, setAuthenticated } from './lib/auth';
import { loadProjects, loadSettings } from './lib/storage';

// 测试存储可用性
console.log('=== 存储可用性测试 ===');
console.log('localStorage 可用:', isStorageAvailable('localStorage'));
console.log('sessionStorage 可用:', isStorageAvailable('sessionStorage'));

// 测试安全存储包装器
console.log('\n=== 安全存储包装器测试 ===');
const testKey = 'test_key';
const testValue = 'test_value';

// localStorage 测试
console.log('localStorage.setItem 结果:', safeLocalStorage.setItem(testKey, testValue));
console.log('localStorage.getItem 结果:', safeLocalStorage.getItem(testKey));
console.log('localStorage.removeItem 结果:', safeLocalStorage.removeItem(testKey));

// sessionStorage 测试
console.log('sessionStorage.setItem 结果:', safeSessionStorage.setItem(testKey, testValue));
console.log('sessionStorage.getItem 结果:', safeSessionStorage.getItem(testKey));
console.log('sessionStorage.removeItem 结果:', safeSessionStorage.removeItem(testKey));

// 测试认证功能
console.log('\n=== 认证功能测试 ===');
console.log('初始认证状态:', isAuthenticated());
setAuthenticated(true);
console.log('设置认证后状态:', isAuthenticated());
setAuthenticated(false);
console.log('取消认证后状态:', isAuthenticated());

// 测试数据加载
console.log('\n=== 数据加载测试 ===');
try {
  const projects = await loadProjects();
  console.log('项目数据加载成功，数量:', projects.length);
} catch (error) {
  console.error('项目数据加载失败:', error);
}

try {
  const settings = await loadSettings();
  console.log('设置数据加载成功:', settings);
} catch (error) {
  console.error('设置数据加载失败:', error);
}

console.log('\n=== 测试完成 ===');