-- Create authors table for blog posts
CREATE TABLE IF NOT EXISTS authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#8B5CF6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  gallery_images JSONB DEFAULT '[]',
  author_id UUID REFERENCES authors(id),
  category_id UUID REFERENCES blog_categories(id),
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  reading_time INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contact info table
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access and authenticated write access
CREATE POLICY "Public can read authors" ON authors FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage authors" ON authors FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read blog categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage blog categories" ON blog_categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read published blog posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read approved comments" ON blog_comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can create comments" ON blog_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can manage comments" ON blog_comments FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read contact info" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage contact info" ON contact_info FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can create contact submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read contact submissions" ON contact_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage contact submissions" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');

-- Create triggers for updated_at
CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default contact info
INSERT INTO contact_info (section, key, value) VALUES
('general', 'company_name', '"Nymphette Tours"'),
('general', 'tagline', '"Discover the World with Expert Guidance"'),
('general', 'phone', '"+1 (555) 123-4567"'),
('general', 'email', '"hello@nymphettetours.com"'),
('general', 'address', '"123 Travel Street, Adventure City, AC 12345"'),
('general', 'whatsapp', '"+1 (555) 123-4567"'),
('social', 'facebook', '"https://facebook.com/nymphettetours"'),
('social', 'instagram', '"https://instagram.com/nymphettetours"'),
('social', 'twitter', '"https://twitter.com/nymphettetours"'),
('social', 'youtube', '"https://youtube.com/@nymphettetours"'),
('office_hours', 'monday_friday', '"9:00 AM - 6:00 PM"'),
('office_hours', 'saturday', '"10:00 AM - 4:00 PM"'),
('office_hours', 'sunday', '"Closed"');

-- Insert sample blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Travel Tips', 'travel-tips', 'Essential advice for travelers', '#3B82F6'),
('Destinations', 'destinations', 'Discover amazing places around the world', '#10B981'),
('Culture & History', 'culture-history', 'Explore rich cultures and historical sites', '#8B5CF6'),
('Adventure', 'adventure', 'Thrilling adventures and outdoor activities', '#F59E0B'),
('Food & Cuisine', 'food-cuisine', 'Culinary experiences and local flavors', '#EF4444');

-- Insert sample author
INSERT INTO authors (name, email, bio, avatar_url, social_links) VALUES
('Sarah Johnson', 'sarah@nymphettetours.com', 'Travel enthusiast and expert guide with over 10 years of experience exploring hidden gems around the world.', '/placeholder.svg', '{"twitter": "https://twitter.com/sarahtravels", "instagram": "https://instagram.com/sarahtravels"}');