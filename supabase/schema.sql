-- CodeSync Snippets Table
-- Run this in your Supabase SQL Editor to create the snippets table

-- Drop existing table if it exists to start fresh
DROP TABLE IF EXISTS snippets CASCADE;

CREATE TABLE snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT DEFAULT 'Untitled Snippet',
  code TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'java',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups by updated date
CREATE INDEX idx_snippets_updated_at ON snippets(updated_at DESC);

-- Index for language filtering
CREATE INDEX idx_snippets_language ON snippets(language);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_snippets_updated_at
  BEFORE UPDATE ON snippets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to read all snippets
CREATE POLICY "Enable read access for all users"
  ON snippets FOR SELECT
  TO anon
  USING (true);

-- Policy: Allow anonymous users to insert snippets
CREATE POLICY "Enable insert access for all users"
  ON snippets FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anonymous users to update all snippets
CREATE POLICY "Enable update access for all users"
  ON snippets FOR UPDATE
  TO anon
  USING (true);

-- Policy: Allow anonymous users to delete all snippets
CREATE POLICY "Enable delete access for all users"
  ON snippets FOR DELETE
  TO anon
  USING (true);
