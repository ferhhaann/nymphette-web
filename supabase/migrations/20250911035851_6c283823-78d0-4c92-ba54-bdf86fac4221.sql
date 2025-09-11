-- Insert popular destinations content section for admin management
INSERT INTO public.content (section, key, value) VALUES 
('popular-destinations', 'title', '"Popular Travel Destinations"'),
('popular-destinations', 'subtitle', '"Discover our most loved destinations with carefully curated travel packages"')
ON CONFLICT (section, key) DO UPDATE SET
value = EXCLUDED.value;