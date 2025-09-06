-- Create group_tour_categories table
CREATE TABLE IF NOT EXISTS group_tour_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Mountain',
  color TEXT DEFAULT '#8B5CF6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create group_tours table
CREATE TABLE IF NOT EXISTS group_tours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  category_id UUID REFERENCES group_tour_categories(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  max_participants INTEGER NOT NULL,
  available_spots INTEGER NOT NULL,
  min_age INTEGER DEFAULT 18,
  max_age INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('Easy', 'Moderate', 'Challenging', 'Expert')),
  group_type TEXT CHECK (group_type IN ('Mixed', 'Solo Travelers', 'Families', 'Corporate', 'Adventure Seekers')),
  image_url TEXT,
  gallery_images JSONB DEFAULT '[]',
  highlights TEXT[] DEFAULT '{}',
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]',
  badges TEXT[] DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('Active', 'Inactive', 'Sold Out', 'Cancelled')) DEFAULT 'Active',
  featured BOOLEAN DEFAULT false,
  early_bird_discount DECIMAL(5,2) DEFAULT 0,
  last_minute_discount DECIMAL(5,2) DEFAULT 0,
  is_eco_friendly BOOLEAN DEFAULT false,
  contact_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tour_reviews table
CREATE TABLE IF NOT EXISTS tour_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES group_tours(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_image TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_date DATE DEFAULT CURRENT_DATE,
  is_verified BOOLEAN DEFAULT false,
  social_media_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE group_tour_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for group_tour_categories
CREATE POLICY "Categories are viewable by everyone" ON group_tour_categories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage categories" ON group_tour_categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for group_tours
CREATE POLICY "Group tours are viewable by everyone" ON group_tours
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage group tours" ON group_tours
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for tour_reviews
CREATE POLICY "Reviews are viewable by everyone" ON tour_reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage reviews" ON tour_reviews
  FOR ALL USING (auth.role() = 'authenticated');

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_group_tour_categories_updated_at 
  BEFORE UPDATE ON group_tour_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_tours_updated_at 
  BEFORE UPDATE ON group_tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO group_tour_categories (name, description, icon, color) VALUES
('Adventure & Trekking', 'Thrilling adventures and trekking experiences', 'Mountain', '#16A34A'),
('Cultural Tours', 'Immerse in local culture and traditions', 'Globe', '#DC2626'),
('Beach & Islands', 'Relaxing beach destinations and island hopping', 'Waves', '#0EA5E9'),
('City Breaks', 'Urban exploration and city adventures', 'Building', '#7C3AED'),
('Wildlife Safari', 'Wildlife watching and nature experiences', 'Binoculars', '#EA580C'),
('Luxury Tours', 'Premium and luxury travel experiences', 'Crown', '#EAB308');