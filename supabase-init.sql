-- ============================================
-- Supabase 数据库初始化脚本
-- 项目：Navigator - 个人项目导航网站
-- 版本：2.0（整合版）
-- ============================================
--
-- 使用说明：
-- 1. 在 Supabase SQL Editor 中执行此脚本
-- 2. 脚本会创建所有必要的表、函数、触发器和策略
-- 3. 示例数据默认注释，如需初始化可取消注释执行
--
-- ============================================

-- ============================================
-- 1. 公共函数
-- ============================================

-- 自动更新 updated_at 字段的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 2. Projects 表
-- ============================================

CREATE TABLE IF NOT EXISTS projects (
  -- 基础信息
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  live_url TEXT NOT NULL,
  github_url TEXT,
  tags JSONB NOT NULL DEFAULT '[]',
  category TEXT NOT NULL,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'live',

  -- 详细信息
  detailed_description TEXT,
  screenshots JSONB DEFAULT '[]',
  tech_stack JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  challenges JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  start_date TEXT,
  duration TEXT,

  -- 显示控制（详情页各 Tab 的显示/隐藏）
  show_gallery BOOLEAN DEFAULT true,
  show_overview BOOLEAN DEFAULT true,
  show_tech_stack BOOLEAN DEFAULT true,
  show_challenges BOOLEAN DEFAULT true,
  show_timeline BOOLEAN DEFAULT true,

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全（RLS）
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 创建允许所有操作的策略（适合单用户管理系统）
DROP POLICY IF EXISTS "Allow all operations" ON projects;
CREATE POLICY "Allow all operations" ON projects FOR ALL USING (true);

-- 创建 updated_at 自动更新触发器
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. User Settings 表
-- ============================================

CREATE TABLE IF NOT EXISTS user_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  show_images BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全（RLS）
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 创建允许所有操作的策略
DROP POLICY IF EXISTS "Allow all operations on settings" ON user_settings;
CREATE POLICY "Allow all operations on settings" ON user_settings FOR ALL USING (true);

-- 创建 updated_at 自动更新触发器
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 插入默认设置（如果不存在）
INSERT INTO user_settings (id, show_images, theme)
VALUES ('default', true, 'default')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. 验证表结构
-- ============================================

-- 查看 projects 表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- 查看 user_settings 表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_settings'
ORDER BY ordinal_position;

-- ============================================
-- 5. 示例数据（可选）
-- ============================================
-- 如需初始化示例数据，取消以下注释并执行

/*
-- 清空现有数据（谨慎使用）
-- TRUNCATE TABLE projects;

-- 示例项目 1
INSERT INTO projects (
  id, title, description, live_url, github_url, tags, category, status,
  detailed_description, features
) VALUES (
  'example-1',
  '示例项目',
  '这是一个示例项目，展示 Navigator 的功能。',
  'https://example.com',
  'https://github.com/example/project',
  '["React", "TypeScript", "Tailwind"]'::jsonb,
  'web',
  'live',
  '# 示例项目

这是一个示例项目的详细描述。

## 功能特性

- 功能 1
- 功能 2
- 功能 3',
  '["功能 1", "功能 2", "功能 3"]'::jsonb
);

-- 查询所有项目
SELECT id, title, category, status, created_at
FROM projects
ORDER BY created_at DESC;
*/

-- ============================================
-- 完成！
-- ============================================
--
-- 表结构说明：
--
-- projects 表（24 列）：
--   - 基础信息：id, title, description, live_url, github_url, tags, category, image, status
--   - 详细信息：detailed_description, screenshots, tech_stack, features, challenges, timeline, start_date, duration
--   - 显示控制：show_gallery, show_overview, show_tech_stack, show_challenges, show_timeline
--   - 时间戳：created_at, updated_at
--
-- user_settings 表（5 列）：
--   - id, show_images, theme, created_at, updated_at
--
-- ============================================
