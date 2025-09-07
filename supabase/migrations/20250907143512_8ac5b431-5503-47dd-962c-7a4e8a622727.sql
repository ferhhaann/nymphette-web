-- First, drop the existing constraint if it exists
ALTER TABLE seo_settings DROP CONSTRAINT IF EXISTS seo_settings_page_type_check;

-- Add a new constraint that includes 'country' as a valid page type
ALTER TABLE seo_settings ADD CONSTRAINT seo_settings_page_type_check 
CHECK (page_type IN ('homepage', 'packages', 'blog', 'about', 'contact', 'group-tours', 'custom', 'country'));

-- Now add sample SEO settings for country pages
INSERT INTO seo_settings (page_url, meta_title, meta_description, meta_keywords, page_type, is_active) 
VALUES 
  ('/regions/asia/country/japan', 'Japan Travel Guide - Discover Amazing Japan Tours | Nymphette Tours', 'Explore Japan with our comprehensive travel packages. From Tokyo to Kyoto, discover the best of Japanese culture, food, and destinations. Book your Japan tour today!', 'japan travel, japan tours, tokyo travel, kyoto tours, japan vacation, japanese culture', 'country', true),
  ('/regions/europe/country/france', 'France Travel Packages - Experience the Best of France | Nymphette Tours', 'Discover France with our curated travel packages. From Paris to Provence, explore French culture, cuisine, and landmarks. Book your France vacation today!', 'france travel, paris tours, france vacation, french culture, europe travel', 'country', true),
  ('/regions/asia/country/thailand', 'Thailand Travel Guide - Best Thailand Tours & Packages | Nymphette Tours', 'Experience Thailand with our expert-guided tours. From Bangkok to Phuket, discover temples, beaches, and Thai culture. Book your Thailand adventure!', 'thailand travel, bangkok tours, phuket vacation, thai culture, southeast asia', 'country', true)
ON CONFLICT (page_url) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  page_type = EXCLUDED.page_type,
  is_active = EXCLUDED.is_active;