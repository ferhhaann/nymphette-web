-- Insert hero images for Japan
INSERT INTO country_hero_images (country_id, image_url, alt_text, caption, order_index)
SELECT 
  id,
  '/src/assets/hero/japan-hero-1.jpg',
  'Mount Fuji with cherry blossoms',
  'Mount Fuji with beautiful cherry blossoms in spring',
  1
FROM countries WHERE slug = 'japan'
ON CONFLICT DO NOTHING;

INSERT INTO country_hero_images (country_id, image_url, alt_text, caption, order_index)
SELECT 
  id,
  '/src/assets/hero/japan-hero-2.jpg',
  'Tokyo skyline at sunset',
  'Modern Tokyo skyline showcasing Japan''s urban landscape',
  2
FROM countries WHERE slug = 'japan'
ON CONFLICT DO NOTHING;

INSERT INTO country_hero_images (country_id, image_url, alt_text, caption, order_index)
SELECT 
  id,
  '/src/assets/hero/japan-hero-3.jpg',
  'Traditional Japanese temple with torii gate',
  'Peaceful temple setting representing Japan''s spiritual heritage',
  3
FROM countries WHERE slug = 'japan'
ON CONFLICT DO NOTHING;