-- Add sample attractions for Indonesia
INSERT INTO country_attractions (country_id, name, description, image_url, type, category, order_index) VALUES
-- Most Visited Places
('37b4ddd0-4ad6-47a6-a1a1-fb9c8841cc68', 'Bali Beaches', 'World-famous beaches with crystal clear waters and stunning sunsets', '/places/indonesia/bali.jpg', 'most_visited', 'Beach', 1),
('37b4ddd0-4ad6-47a6-a1a1-fb9c8841cc68', 'Borobudur Temple', 'Ancient Buddhist temple and UNESCO World Heritage Site', 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop', 'most_visited', 'Temple', 2),
('37b4ddd0-4ad6-47a6-a1a1-fb9c8841cc68', 'Jakarta City', 'Capital city with modern attractions and cultural sites', 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800&h=600&fit=crop', 'most_visited', 'City', 3),
('37b4ddd0-4ad6-47a6-a1a1-fb9c8841cc68', 'Yogyakarta', 'Cultural heart of Java with traditional arts and heritage', 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&h=600&fit=crop', 'most_visited', 'Cultural', 4),

-- Most Attractive Places
('37b4ddd0-4ad6-47a6-a1a1-fb9c8841cc68', 'Mount Bromo', 'Active volcano with breathtaking sunrise views', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop', 'most_attractive', 'Volcano', 1),
('37b4ddd0-4ad6-47a6-a1a1-fb9c8841cc68', 'Raja Ampat', 'Marine paradise with world-class diving and pristine coral reefs', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop', 'most_attractive', 'Marine', 2),
('37b4ddd0-4ad6-47a6-a1a1-fb9c8841cc68', 'Komodo National Park', 'Home to the famous Komodo dragons and pink beaches', 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop', 'most_attractive', 'National Park', 3),
('37b4ddd0-4ad6-47a6-a1a1-fb9c8841cc68', 'Lake Toba', 'Massive volcanic lake with traditional Batak culture', 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=800&h=600&fit=crop', 'most_attractive', 'Lake', 4),
('37b4ddd0-4ad6-47a6-a1a1-fb9c8841cc68', 'Ubud Rice Terraces', 'Stunning terraced landscapes and cultural experiences', 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop', 'most_attractive', 'Nature', 5);