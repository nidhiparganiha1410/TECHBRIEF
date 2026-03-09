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
-- This updates the app_metadata to grant admin privileges securely
-- Replace 'your-email@example.com' with your actual email
UPDATE auth.users 
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-email@example.com';

-- 6. Helper Function for Admin Check
-- Using SECURITY DEFINER to avoid recursion and app_metadata for security
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- We check the JWT's app_metadata for the role.
  -- This is the most secure way to handle roles in Supabase.
  RETURN (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Enable RLS (Row Level Security)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 8. Create Policies (Allow public read, admin write)
-- Articles
DROP POLICY IF EXISTS "Public read articles" ON articles;
DROP POLICY IF EXISTS "Admin manage articles" ON articles;
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Admin manage articles" ON articles FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Categories
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Admin manage categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON categories FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Pages
DROP POLICY IF EXISTS "Public read pages" ON pages;
DROP POLICY IF EXISTS "Admin manage pages" ON pages;
CREATE POLICY "Public read pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Admin manage pages" ON pages FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Settings
DROP POLICY IF EXISTS "Public read settings" ON settings;
DROP POLICY IF EXISTS "Admin manage settings" ON settings;
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON settings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
