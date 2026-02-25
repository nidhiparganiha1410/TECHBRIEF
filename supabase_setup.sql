-- Supabase Setup SQL for Tech Brief Pro

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- 2. Create Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title JSONB NOT NULL,
  summary JSONB NOT NULL,
  excerpt TEXT,
  content JSONB NOT NULL,
  content_blocks JSONB,
  highlights JSONB,
  status TEXT DEFAULT 'draft',
  visibility TEXT DEFAULT 'public',
  category TEXT,
  author TEXT,
  author_id TEXT,
  date TIMESTAMPTZ DEFAULT now(),
  "imageUrl" TEXT,
  "videoUrl" TEXT,
  "isFeatured" BOOLEAN DEFAULT false,
  seo JSONB,
  categories JSONB,
  tags TEXT[] DEFAULT '{}',
  publish_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  revision_ids JSONB DEFAULT '[]'
);

-- 3. Create Pages Table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  status TEXT DEFAULT 'draft',
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- 5. Set up Admin User
-- This updates the user metadata to grant admin privileges
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin", "full_name": "Admin User"}'::jsonb
WHERE id = '47f05701-59f8-4061-a332-be4208d4920b';

-- 6. Enable RLS (Row Level Security)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 7. Create Policies (Allow public read, admin write)
-- Articles
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Admin write articles" ON articles FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- Categories
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON categories FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- Pages
CREATE POLICY "Public read pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Admin write pages" ON pages FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- Settings
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin write settings" ON settings FOR ALL USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
);
