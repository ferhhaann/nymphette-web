-- Create a migration to sync country content properly

-- Update countries table to make JSONB fields more structured and ensure they display correctly

-- First, let's add some sample structured content for countries that might be missing sections
-- This will ensure admin panel edits show up on the frontend

-- Add some indexes for better performance
CREATE INDEX IF NOT EXISTS idx_countries_slug ON countries(slug);
CREATE INDEX IF NOT EXISTS idx_countries_region ON countries(region);
CREATE INDEX IF NOT EXISTS idx_countries_popular ON countries(is_popular);
CREATE INDEX IF NOT EXISTS idx_country_sections_country_enabled ON country_sections(country_id, is_enabled);
CREATE INDEX IF NOT EXISTS idx_travel_purposes_country ON travel_purposes(country_id);

-- Update countries to have better default structures for content fields
UPDATE countries 
SET 
  contact_info = COALESCE(contact_info, '{"email": "hello@nymphettetours.com", "phone": "+1 (555) 123-4567", "address": "", "whatsapp": ""}'::jsonb),
  visitor_statistics = COALESCE(visitor_statistics, '{"annual": null, "gender": {"male": null, "female": null}, "purposes": [], "topOrigins": []}'::jsonb),
  fun_facts = COALESCE(fun_facts, '[]'::jsonb),
  before_you_go_tips = COALESCE(before_you_go_tips, '[]'::jsonb),
  reasons_to_visit = COALESCE(reasons_to_visit, '[]'::jsonb),
  dos_donts = COALESCE(dos_donts, '{"dos": [], "donts": []}'::jsonb),
  hero_images = COALESCE(hero_images, '[]'::jsonb)
WHERE 
  contact_info IS NULL 
  OR visitor_statistics IS NULL 
  OR fun_facts IS NULL 
  OR before_you_go_tips IS NULL 
  OR reasons_to_visit IS NULL 
  OR dos_donts IS NULL 
  OR hero_images IS NULL;