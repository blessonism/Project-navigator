-- ============================================
-- 用户设置表创建脚本
-- 用于同步主题和图片显示设置到 Supabase
-- ============================================

-- 1. 创建 user_settings 表
CREATE TABLE IF NOT EXISTS user_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  show_images BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 启用行级安全（RLS）
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 3. 创建允许所有操作的策略
DROP POLICY IF EXISTS "Allow all operations on settings" ON user_settings;
CREATE POLICY "Allow all operations on settings" ON user_settings FOR ALL USING (true);

-- 4. 创建自动更新 updated_at 的触发器
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. 插入默认设置（如果不存在）
INSERT INTO user_settings (id, show_images, theme)
VALUES ('default', true, 'default')
ON CONFLICT (id) DO NOTHING;

-- 6. 验证表创建
SELECT * FROM user_settings;

-- ============================================
-- 完成！
-- ============================================
--
-- 使用说明：
-- 1. 在 Supabase SQL Editor 中执行此脚本
-- 2. 确认 user_settings 表创建成功
-- 3. 应用将自动同步设置到此表
--
-- 注意事项：
-- - 使用单一记录（id='default'）存储所有设置
-- - 适合单用户管理系统
-- - 如需多用户支持，可以将 id 改为用户 ID
-- ============================================