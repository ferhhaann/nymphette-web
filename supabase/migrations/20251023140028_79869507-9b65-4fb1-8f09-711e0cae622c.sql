-- Enable real-time updates for country-related tables
ALTER PUBLICATION supabase_realtime ADD TABLE country_hero_images;
ALTER PUBLICATION supabase_realtime ADD TABLE travel_purposes;
ALTER PUBLICATION supabase_realtime ADD TABLE country_faqs;

-- Set replica identity for real-time to work properly
ALTER TABLE country_hero_images REPLICA IDENTITY FULL;
ALTER TABLE travel_purposes REPLICA IDENTITY FULL;
ALTER TABLE country_faqs REPLICA IDENTITY FULL;