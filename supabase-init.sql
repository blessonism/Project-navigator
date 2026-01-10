-- ============================================
-- Supabase 数据库初始化脚本
-- 项目：Navigator - 个人项目导航网站
-- ============================================

-- 1. 创建 projects 表（如果不存在）
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  live_url TEXT NOT NULL,
  github_url TEXT,
  tags JSONB NOT NULL DEFAULT '[]',
  category TEXT NOT NULL,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'live',
  detailed_description TEXT,
  screenshots JSONB DEFAULT '[]',
  tech_stack JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  challenges JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  start_date TEXT,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 启用行级安全（RLS）
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 3. 创建允许所有操作的策略（适合单用户管理系统）
DROP POLICY IF EXISTS "Allow all operations" ON projects;
CREATE POLICY "Allow all operations" ON projects FOR ALL USING (true);

-- 4. 创建自动更新 updated_at 的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. 清空现有数据（可选，如果需要重新初始化）
-- TRUNCATE TABLE projects;

-- ============================================
-- 6. 插入项目数据
-- ============================================

-- 项目 1: Alist - 文件列表程序
INSERT INTO projects (
  id, title, description, live_url, github_url, tags, category, status,
  detailed_description, features
) VALUES (
  'alist-1',
  'Alist',
  '一个支持多种存储的文件列表程序，使用 Gin 和 Solidjs 构建，提供统一的文件管理界面。',
  'https://alist.sukisq.cloud',
  NULL,
  '["Gin", "Solidjs", "文件管理", "云存储"]'::jsonb,
  'tools',
  'live',
  '# Alist 文件列表程序

一个功能强大的文件列表程序，支持多种云存储服务的统一管理。

## 核心特性

- **多存储支持**：支持阿里云盘、OneDrive、Google Drive 等多种云存储
- **统一界面**：提供简洁美观的文件浏览界面
- **在线预览**：支持图片、视频、音频、文档等多种格式的在线预览
- **文件分享**：便捷的文件分享功能
- **WebDAV 支持**：可作为 WebDAV 服务器使用

## 技术栈

- 后端：Gin (Go Web 框架)
- 前端：Solidjs (响应式 UI 框架)
- 部署：Docker 容器化部署',
  '["多云存储统一管理", "在线文件预览", "文件分享", "WebDAV 服务", "Docker 部署"]'::jsonb
);

-- 项目 2: Blog - 个人博客
INSERT INTO projects (
  id, title, description, live_url, github_url, tags, category, status,
  detailed_description, features
) VALUES (
  'blog-2',
  'Blog',
  '基于 Hextra 主题构建的个人技术博客，记录学习笔记、技术分享和项目经验。',
  'https://blog.sukisq.me',
  'https://github.com/blessonism/Hextra-blog',
  '["Hugo", "Hextra", "博客", "Markdown"]'::jsonb,
  'web',
  'live',
  '# 个人技术博客

使用 Hugo 静态网站生成器和 Hextra 主题构建的现代化技术博客。

## 核心特性

- **快速加载**：静态网站生成，访问速度极快
- **Markdown 写作**：使用 Markdown 格式撰写文章
- **响应式设计**：完美适配各种设备
- **搜索功能**：内置全文搜索
- **代码高亮**：支持多种编程语言的语法高亮
- **暗色模式**：支持明暗主题切换

## 技术栈

- 静态网站生成器：Hugo
- 主题：Hextra
- 部署：Vercel / Cloudflare Pages
- 内容管理：Git + Markdown',
  '["静态网站生成", "Markdown 写作", "代码高亮", "全文搜索", "响应式设计", "暗色模式"]'::jsonb
);

-- 项目 3: weread2flomo - 微信读书笔记同步工具
INSERT INTO projects (
  id, title, description, live_url, github_url, tags, category, status,
  detailed_description, features
) VALUES (
  'weread2flomo-3',
  'weread2flomo',
  '将微信读书的笔记和划线自动同步到 flomo 笔记的工具，支持定时同步和增量更新。',
  'https://weread2flomo.sukisq.me/',
  'https://github.com/blessonism/weread2flomo',
  '["Python", "微信读书", "flomo", "笔记同步"]'::jsonb,
  'tools',
  'live',
  '# weread2flomo - 读书笔记同步工具

自动将微信读书的笔记和划线同步到 flomo 笔记应用的实用工具。

## 核心特性

- **自动同步**：定时自动同步微信读书笔记到 flomo
- **增量更新**：只同步新增的笔记，避免重复
- **格式保留**：保持原有的笔记格式和书籍信息
- **批量处理**：支持批量同步多本书的笔记
- **Web 界面**：提供简洁的 Web 管理界面

## 使用场景

- 将阅读笔记统一管理到 flomo
- 建立个人知识库
- 方便笔记的二次整理和回顾

## 技术实现

- 后端：Python + Flask
- 微信读书 API 集成
- flomo API 集成
- 定时任务调度',
  '["自动同步", "增量更新", "格式保留", "批量处理", "Web 管理界面"]'::jsonb
);

-- 项目 4: 倒计时 - 时间管理工具
INSERT INTO projects (
  id, title, description, live_url, github_url, tags, category, status,
  detailed_description, features
) VALUES (
  'deadline-4',
  '倒计时',
  '简洁优雅的倒计时工具，帮助你追踪重要日期和截止时间，提升时间管理效率。',
  'https://time.sukisq.me/',
  'https://github.com/blessonism/deadline',
  '["React", "时间管理", "倒计时", "生产力工具"]'::jsonb,
  'tools',
  'live',
  '# 倒计时 - 时间管理工具

一个简洁优雅的倒计时应用，帮助你追踪重要的日期和截止时间。

## 核心特性

- **多倒计时管理**：同时管理多个倒计时事件
- **精确计算**：精确到天、小时、分钟、秒
- **自定义标签**：为不同事件添加标签和分类
- **进度可视化**：直观显示时间进度
- **本地存储**：数据保存在本地，保护隐私
- **响应式设计**：完美适配手机和电脑

## 使用场景

- 项目截止日期提醒
- 考试倒计时
- 重要纪念日追踪
- 目标达成时间管理

## 技术栈

- 前端：React + TypeScript
- 样式：Tailwind CSS
- 存储：LocalStorage
- 部署：Vercel',
  '["多倒计时管理", "精确时间计算", "自定义标签", "进度可视化", "本地存储", "响应式设计"]'::jsonb
);

-- 项目 5: 工具导航栏 - 开发工具集合
INSERT INTO projects (
  id, title, description, live_url, github_url, tags, category, status,
  detailed_description, features
) VALUES (
  'devtoolset-5',
  '工具导航栏',
  '精心整理的开发者工具导航网站，收录了前端、后端、设计、运维等各类实用工具。',
  'https://tool.sukisq.me/zh',
  'https://github.com/blessonism/devtoolset',
  '["Vue", "工具导航", "开发工具", "资源整理"]'::jsonb,
  'tools',
  'live',
  '# 工具导航栏 - 开发者工具集合

一个精心整理的开发者工具导航网站，帮助开发者快速找到所需的工具和资源。

## 核心特性

- **分类清晰**：按照前端、后端、设计、运维等分类整理
- **搜索功能**：快速搜索所需工具
- **工具描述**：每个工具都有简洁的功能说明
- **收藏功能**：收藏常用工具，快速访问
- **多语言支持**：支持中英文切换
- **响应式布局**：适配各种设备

## 工具分类

- 前端开发：框架、UI 库、构建工具
- 后端开发：API 工具、数据库工具
- 设计资源：图标库、配色工具、设计规范
- 运维工具：监控、部署、容器化
- 效率工具：代码片段、正则表达式、格式转换

## 技术栈

- 前端：Vue 3 + TypeScript
- 样式：Tailwind CSS
- 部署：Vercel',
  '["分类导航", "搜索功能", "工具描述", "收藏功能", "多语言支持", "响应式布局"]'::jsonb
);

-- 项目 6: Prompt 优化器 - AI 提示词工具
INSERT INTO projects (
  id, title, description, live_url, github_url, tags, category, status,
  detailed_description, features
) VALUES (
  'prompt-6',
  'Prompt 优化器',
  'AI 提示词优化工具，帮助用户编写更有效的 AI 提示词，提升 AI 对话质量和输出效果。',
  'https://prompt.sukisq.me/',
  'https://github.com/blessonism/prompt',
  '["AI", "Prompt", "ChatGPT", "提示词优化"]'::jsonb,
  'tools',
  'live',
  '# Prompt 优化器 - AI 提示词工具

一个专业的 AI 提示词优化工具，帮助用户编写更有效的提示词，提升 AI 对话质量。

## 核心特性

- **提示词优化**：自动优化用户输入的提示词
- **模板库**：提供各类场景的提示词模板
- **最佳实践**：展示提示词编写的最佳实践
- **实时预览**：实时查看优化效果
- **历史记录**：保存优化历史，方便复用
- **分享功能**：分享优秀的提示词

## 使用场景

- ChatGPT 提示词优化
- AI 绘画提示词生成
- 代码生成提示词优化
- 内容创作提示词设计

## 优化维度

- 清晰度：使提示词更加明确具体
- 结构化：添加合理的结构和格式
- 上下文：补充必要的背景信息
- 约束条件：添加输出格式和限制

## 技术栈

- 前端：React + TypeScript
- AI 集成：OpenAI API
- 样式：Tailwind CSS
- 部署：Vercel',
  '["提示词优化", "模板库", "最佳实践", "实时预览", "历史记录", "分享功能"]'::jsonb
);

-- ============================================
-- 7. 验证数据插入
-- ============================================

-- 查询所有项目
SELECT id, title, category, status, created_at
FROM projects
ORDER BY created_at DESC;

-- 统计各分类项目数量
SELECT category, COUNT(*) as count
FROM projects
GROUP BY category;

-- ============================================
-- 完成！
-- ============================================
--
-- 使用说明：
-- 1. 在 Supabase SQL Editor 中执行此脚本
-- 2. 确认所有项目数据已成功插入
-- 3. 刷新您的应用，数据将自动加载
--
-- 注意事项：
-- - 如果表已存在，CREATE TABLE IF NOT EXISTS 不会重复创建
-- - 如果需要重新初始化，取消注释 TRUNCATE TABLE 语句
-- - 项目 ID 使用了描述性命名，便于识别和管理
-- ============================================