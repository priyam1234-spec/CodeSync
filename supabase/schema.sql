-- 1. Reset Table
DROP TABLE IF EXISTS snippets CASCADE;

CREATE TABLE snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT DEFAULT 'Untitled Snippet',
  code TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'java',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Permissions (CRITICAL STEP)
-- This tells the database that the 'anon' user is actually allowed to 
-- perform actions on this table. Without this, RLS policies often fail.
GRANT ALL ON TABLE snippets TO anon;
GRANT ALL ON TABLE snippets TO authenticated;
GRANT ALL ON TABLE snippets TO service_role;

-- 3. Row Level Security
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

-- 4. Simplified Policies (Targeting 'public' covers both anon and auth)
CREATE POLICY "Public Read" ON snippets FOR SELECT USING (true);
CREATE POLICY "Public Insert" ON snippets FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update" ON snippets FOR UPDATE USING (true);
CREATE POLICY "Public Delete" ON snippets FOR DELETE USING (true);

-- 5. Auto-Update Timestamp Logic
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_snippets_updated_at
  BEFORE UPDATE ON snippets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
