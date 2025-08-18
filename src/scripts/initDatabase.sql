-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  country TEXT NOT NULL,
  country_slug TEXT,
  region TEXT NOT NULL,
  duration TEXT NOT NULL,
  price TEXT NOT NULL,
  original_price TEXT,
  rating DECIMAL(2,1) DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  image TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  best_time TEXT,
  group_size TEXT,
  overview_section_title TEXT,
  overview_description TEXT,
  overview_highlights_label TEXT,
  overview_badge_variant TEXT,
  overview_badge_style TEXT,
  itinerary JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content table for dynamic content management
CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

-- Create RLS policies for packages table
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to packages
CREATE POLICY "Public can read packages" ON packages
  FOR SELECT USING (true);

-- Allow authenticated users to insert, update, delete packages
CREATE POLICY "Authenticated users can manage packages" ON packages
  FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for content table
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Allow public read access to content
CREATE POLICY "Public can read content" ON content
  FOR SELECT USING (true);

-- Allow authenticated users to insert, update, delete content
CREATE POLICY "Authenticated users can manage content" ON content
  FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();