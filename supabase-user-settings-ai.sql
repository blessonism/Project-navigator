-- 为已上线实例补充 AI 同步设置字段（user_settings）

ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS ai_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_base_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS ai_model TEXT DEFAULT 'gpt-4.1-mini',
  ADD COLUMN IF NOT EXISTS ai_api_key TEXT DEFAULT '';

UPDATE user_settings
SET
  ai_enabled = COALESCE(ai_enabled, false),
  ai_base_url = COALESCE(ai_base_url, ''),
  ai_model = COALESCE(NULLIF(ai_model, ''), 'gpt-4.1-mini'),
  ai_api_key = COALESCE(ai_api_key, '')
WHERE id = 'default';

INSERT INTO user_settings (id, show_images, theme, ai_enabled, ai_base_url, ai_model, ai_api_key)
VALUES ('default', true, 'default', false, '', 'gpt-4.1-mini', '')
ON CONFLICT (id) DO NOTHING;
