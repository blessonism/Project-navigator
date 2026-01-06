#!/usr/bin/env node

/**
 * 密码哈希生成工具
 * 使用方法：node scripts/generate-hash.js
 */

import crypto from 'crypto';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Navigator 管理员密码哈希生成工具 ===\n');

rl.question('请输入管理员密码: ', (password) => {
  if (!password || password.trim().length === 0) {
    console.error('\n错误：密码不能为空');
    rl.close();
    process.exit(1);
  }

  if (password.length < 6) {
    console.warn('\n警告：密码长度少于 6 位，建议使用更强的密码');
  }

  // 生成 SHA-256 哈希
  const hash = crypto.createHash('sha256').update(password).digest('hex');

  console.log('\n生成成功！请将以下内容添加到 .env 文件：\n');
  console.log(`VITE_ADMIN_PASSWORD_HASH=${hash}`);
  console.log('\n注意：');
  console.log('1. 请确保 .env 文件已添加到 .gitignore');
  console.log('2. 修改 .env 后需要重启开发服务器');
  console.log('3. 请妥善保管您的密码\n');

  rl.close();
});
