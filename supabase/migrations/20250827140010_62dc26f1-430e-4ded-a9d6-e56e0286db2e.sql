-- Add new columns to countries table for comprehensive country details
ALTER TABLE countries 
ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
ADD COLUMN IF NOT EXISTS hero_images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS overview_description TEXT,
ADD COLUMN IF NOT EXISTS about_content TEXT,
ADD COLUMN IF NOT EXISTS fun_facts JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS before_you_go_tips JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS best_time_content TEXT,
ADD COLUMN IF NOT EXISTS reasons_to_visit JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS food_shopping_content TEXT,
ADD COLUMN IF NOT EXISTS dos_donts JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS art_culture_content TEXT,
ADD COLUMN IF NOT EXISTS travel_tips TEXT,
ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{"phone": "+1 (555) 123-4567", "email": "hello@nymphettetours.com", "whatsapp": "", "address": ""}'::jsonb;

-- Create country_sections table for managing all content sections
CREATE TABLE IF NOT EXISTS country_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL, -- 'hero', 'quick_facts', 'visitor_snapshot', 'overview', 'about', 'fun_facts', etc.
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER DEFAULT 0,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create country_hero_images table for multiple hero images
CREATE TABLE IF NOT EXISTS country_hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_country_sections_country_id ON country_sections(country_id);
CREATE INDEX IF NOT EXISTS idx_country_sections_section_name ON country_sections(section_name);
CREATE INDEX IF NOT EXISTS idx_country_hero_images_country_id ON country_hero_images(country_id);

-- Enable RLS
ALTER TABLE country_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_hero_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Country sections are viewable by everyone" ON country_sections FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage country sections" ON country_sections FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Country hero images are viewable by everyone" ON country_hero_images FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage hero images" ON country_hero_images FOR ALL USING (auth.role() = 'authenticated');

-- Insert default sections for Japan as an example
INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
SELECT 
  id,
  'hero',
  'Discover Japan',
  '{"description": "Experience the Land of the Rising Sun - where ancient traditions meet cutting-edge technology", "highlights": ["Ancient temples and modern cities", "Cherry blossoms and bullet trains", "Rich culture and exquisite cuisine"]}'::jsonb,
  1,
  true
FROM countries WHERE slug = 'japan'
ON CONFLICT DO NOTHING;

INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
SELECT 
  id,
  'overview',
  'Overview',
  '{"description": "Japan is a captivating blend of ancient traditions and modern innovation. From the bustling streets of Tokyo to the serene temples of Kyoto, this island nation offers unforgettable experiences for every traveler."}'::jsonb,
  2,
  true
FROM countries WHERE slug = 'japan'
ON CONFLICT DO NOTHING;

INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
SELECT 
  id,
  'about',
  'About Japan',
  '{"description": "Japan is an archipelago of 6,852 islands stretching along East Asia''s Pacific coast. Known for its rich history spanning over 2,000 years, Japan has evolved from a feudal society to one of the world''s most technologically advanced nations while preserving its cultural heritage."}'::jsonb,
  3,
  true
FROM countries WHERE slug = 'japan'
ON CONFLICT DO NOTHING;

INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
SELECT 
  id,
  'fun_facts',
  'Fun Facts',
  '{"facts": ["Japan has over 6,800 islands", "There are more than 3,000 McDonald''s restaurants", "Square watermelons are grown for easier stacking", "Japan has one of the world''s lowest crime rates", "Bowing is still a common greeting", "There are more pets than children in Japan"]}'::jsonb,
  4,
  true
FROM countries WHERE slug = 'japan'
ON CONFLICT DO NOTHING;

INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
SELECT 
  id,
  'before_you_go',
  'Before You Go',
  '{"tips": ["Get a JR Pass for unlimited train travel", "Download offline translation apps", "Carry cash - many places don''t accept cards", "Learn basic bowing etiquette", "Book accommodations early during cherry blossom season", "Pack comfortable walking shoes"]}'::jsonb,
  5,
  true
FROM countries WHERE slug = 'japan'
ON CONFLICT DO NOTHING;

INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
SELECT 
  id,
  'best_time',
  'Best Time to Visit',
  '{"content": "Spring (March-May) offers cherry blossoms and mild weather. Autumn (September-November) brings stunning fall colors and comfortable temperatures. Summer can be hot and humid, while winter is perfect for skiing and hot springs."}'::jsonb,
  6,
  true
FROM countries WHERE slug = 'japan'
ON CONFLICT DO NOTHING;

INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
SELECT 
  id,
  'reasons_to_visit',
  'Reasons to Visit',
  '{"reasons": ["World-class cuisine and dining experiences", "Ancient temples and modern architecture", "Efficient transportation system", "Safe and clean environment", "Unique cultural experiences", "Beautiful natural landscapes", "Cutting-edge technology", "Rich art and cultural heritage"]}'::jsonb,
  7,
  true
FROM countries WHERE slug = 'japan'
ON CONFLICT DO NOTHING;

INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
SELECT 
  id,
  'food_shopping',
  'Food & Shopping',
  '{"food": "Experience sushi, ramen, tempura, and kaiseki cuisine. Don''t miss trying authentic Japanese sweets and matcha.", "shopping": "Shop for electronics in Akihabara, traditional crafts in Kyoto, and unique fashion in Harajuku. Popular souvenirs include kimono, sake, and Japanese knives."}'::jsonb,
  8,
  true
FROM countries WHERE slug = 'japan'
ON CONFLICT DO NOTHING;

INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
SELECT 
  id,
  'dos_donts',
  'Dos and Don''ts',
  '{"dos": ["Bow when greeting", "Remove shoes when entering homes", "Use both hands when receiving business cards", "Be punctual", "Keep quiet on public transport"], "donts": ["Don''t tip - it''s not customary", "Don''t eat while walking", "Don''t point with chopsticks", "Don''t blow your nose in public", "Don''t wear shoes inside temples"]}'::jsonb,
  9,
  true
FROM countries WHERE slug = 'japan'
ON CONFLICT DO NOTHING;

INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
SELECT 
  id,
  'art_culture',
  'Art & Culture',
  '{"content": "Japan''s cultural heritage includes traditional arts like tea ceremony, flower arrangement (ikebana), and martial arts. Modern pop culture has given the world anime, manga, and J-pop. Visit museums, attend traditional performances, and experience both ancient and contemporary Japanese art forms."}'::jsonb,
  10,
  true
FROM countries WHERE slug = 'japan'
ON CONFLICT DO NOTHING;