# Navigator

> 现代化的个人项目展示平台，轻松部署属于你自己的作品集网站

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.89-3FCF8E?logo=supabase&logoColor=white)

## 简介

Navigator 是一个开箱即用的项目展示网站，帮助开发者快速搭建个人作品集。支持 Supabase 云存储、双主题切换、密码保护的管理后台，完全免费部署。

**核心特性：**
- 项目网格展示 + 搜索过滤 + 分类浏览
- Classic/Modern 双主题切换
- 密码保护的管理后台（CRUD 操作）
- Supabase 云存储 + localStorage 本地回退
- 响应式设计，完美适配移动端

## 快速部署

### 前置准备

- [Supabase](https://supabase.com) 账号（免费）
- [Vercel](https://vercel.com) 账号（免费）

### 第一步：Fork 并部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/blessonism/navigator)

点击上方按钮，Fork 项目并自动部署到 Vercel。

### 第二步：配置 Supabase 数据库

1. **创建 Supabase 项目**
   - 访问 [supabase.com](https://supabase.com) 并登录
   - 点击 "New Project" 创建新项目
   - 选择免费计划，区域建议选择 `Northeast Asia (Tokyo)`

2. **初始化数据库**
   - 进入项目，点击左侧 "SQL Editor"
   - 点击 "New query"
   - 复制 `supabase-init.sql` 文件内容并执行

3. **获取 API 密钥**
   - 点击 "Settings" → "API"
   - 复制 `Project URL` 和 `anon public` key

### 第三步：配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJhbGciOiJIUzI1NiIs...` |
| `VITE_ADMIN_PASSWORD_HASH` | 管理员密码 SHA-256 哈希 | 见下方说明 |

### 第四步：设置管理员密码

**方式一：使用脚本生成（推荐）**

```bash
node scripts/generate-hash.js
# 按提示输入密码，获取哈希值
```

**方式二：在线生成**

访问任意 SHA-256 在线工具，输入你的密码，获取哈希值。

> 示例：密码 `admin123` 的哈希值为 `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9`

### 第五步：重新部署

在 Vercel 中触发重新部署，环境变量生效后即可使用。

**访问管理后台：**
- 方式 A：访问 `你的域名/?admin`
- 方式 B：按下 `Ctrl+Shift+A`

## 本地开发

```bash
# 克隆项目
git clone https://github.com/blessonism/navigator.git
cd navigator

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入 Supabase 配置

# 启动开发服务器
npm run dev
```

## 自定义配置

### 修改默认项目数据

编辑 `src/constants/defaultProjects.ts` 文件，或直接在管理后台添加项目。

### 管理员入口

| 方式 | 说明 |
|------|------|
| URL 参数 | 访问 `/?admin` 触发登录弹窗 |
| 快捷键 | `Ctrl+Shift+A` |

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 18, TypeScript, Vite |
| 样式方案 | Tailwind CSS, Radix UI |
| 动画效果 | Framer Motion |
| 后端服务 | Supabase (PostgreSQL) |
| 图标库 | Lucide React |

## 项目结构

```
src/
├── components/
│   ├── AdminView/       # 管理视图组件
│   ├── PublicView/      # 公开视图组件
│   └── ui/              # UI 基础组件
├── hooks/               # 自定义 Hooks
├── lib/                 # 工具库（存储、认证等）
├── types/               # TypeScript 类型定义
└── constants/           # 常量（默认数据等）
```

## 常见问题

### 数据没有同步到 Supabase？

1. 检查 `.env` 中的 Supabase 配置是否正确
2. 打开浏览器控制台查看错误信息
3. 确认 Supabase 项目状态正常

### 忘记管理员密码？

重新生成密码哈希并更新 Vercel 环境变量：

```bash
node scripts/generate-hash.js
```

### 如何重置所有数据？

在 Supabase SQL Editor 中执行：

```sql
TRUNCATE TABLE projects;
```

然后重新执行 `supabase-init.sql` 初始化数据。

### 页面显示空白？

1. 检查环境变量是否正确配置
2. 清除浏览器 localStorage：`localStorage.clear()`
3. 刷新页面

## 许可证

MIT License
