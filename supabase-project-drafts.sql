-- 为已上线实例补充 project_drafts 表

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE IF NOT EXISTS project_drafts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source_url TEXT NOT NULL DEFAULT '',
  source_type TEXT NOT NULL DEFAULT 'website',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE project_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on drafts" ON project_drafts;
CREATE POLICY "Allow all operations on drafts" ON project_drafts FOR ALL USING (true);

DROP TRIGGER IF EXISTS update_project_drafts_updated_at ON project_drafts;
CREATE TRIGGER update_project_drafts_updated_at
  BEFORE UPDATE ON project_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
