-- Insert sample content for empty sections - fixed JSON format
-- Hero section content
INSERT INTO content (section, key, value) VALUES 
('hero', 'title', '"Discover Amazing Destinations"'),
('hero', 'subtitle', '"Your Gateway to Unforgettable Travel Experiences"'),
('hero', 'description', '"Explore the world with our curated travel packages and expert guidance. From cultural immersion to adventure tours, we make your dream destinations a reality."'),
('hero', 'cta_text', '"Start Your Journey"'),
('hero', 'background_images', '["https://images.unsplash.com/photo-1488646953014-85cb44e25828", "https://images.unsplash.com/photo-1469474968028-56623f02e42e", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"]')
ON CONFLICT (section, key) DO NOTHING;

-- Featured packages content
INSERT INTO content (section, key, value) VALUES 
('featured-packages', 'title', '"Featured Travel Packages"'),
('featured-packages', 'subtitle', '"Handpicked destinations for every type of traveler"'),
('featured-packages', 'description', '"Discover our most popular travel packages, carefully curated to offer you the best experiences at incredible value."')
ON CONFLICT (section, key) DO NOTHING;

-- Why choose us content
INSERT INTO content (section, key, value) VALUES 
('why-choose-us', 'title', '"Why Choose Nymphette Tours"'),
('why-choose-us', 'subtitle', '"Your trusted travel partner"'),
('why-choose-us', 'features', '{"expert_guides": {"title": "Expert Local Guides", "description": "Our experienced guides provide authentic insights and unforgettable experiences"}, "customized_trips": {"title": "Customized Itineraries", "description": "Tailored travel plans designed specifically for your preferences and interests"}, "24_7_support": {"title": "24/7 Support", "description": "Round-the-clock assistance to ensure your journey is smooth and worry-free"}, "best_prices": {"title": "Best Value Guarantee", "description": "Competitive pricing with no hidden fees and maximum value for your investment"}}')
ON CONFLICT (section, key) DO NOTHING;

-- Regions content
INSERT INTO content (section, key, value) VALUES 
('regions', 'title', '"Explore by Region"'),
('regions', 'subtitle', '"Discover diverse cultures, landscapes, and experiences across continents"'),
('regions', 'description', '"From the bustling cities of Asia to the pristine beaches of the Pacific Islands, explore our comprehensive regional travel guides."')
ON CONFLICT (section, key) DO NOTHING;

-- Contact content
INSERT INTO content (section, key, value) VALUES 
('contact', 'title', '"Get in Touch"'),
('contact', 'subtitle', '"Ready to plan your next adventure?"'),
('contact', 'description', '"Our travel experts are here to help you create the perfect itinerary. Contact us today to start planning your dream vacation."'),
('contact', 'address', '"123 Travel Street, Adventure City, AC 12345"'),
('contact', 'phone', '"+1 (555) 123-4567"'),
('contact', 'email', '"hello@nymphettetours.com"'),
('contact', 'hours', '"Monday - Friday: 9:00 AM - 6:00 PM EST"')
ON CONFLICT (section, key) DO NOTHING;

-- Footer content
INSERT INTO content (section, key, value) VALUES 
('footer', 'company_description', '"Nymphette Tours is your trusted partner for unforgettable travel experiences. We specialize in creating personalized journeys that connect you with the world''s most amazing destinations."'),
('footer', 'quick_links', '["About Us", "Destinations", "Packages", "Blog", "Contact"]'),
('footer', 'destinations', '["Japan", "Thailand", "Italy", "France", "Maldives", "Indonesia"]'),
('footer', 'legal_links', '["Privacy Policy", "Terms of Service", "Cookie Policy", "Refund Policy"]'),
('footer', 'copyright', '"© 2024 Nymphette Tours. All rights reserved."')
ON CONFLICT (section, key) DO NOTHING;