-- Add remaining UAE data
DO $$
DECLARE
  uae_id uuid;
BEGIN
  SELECT id INTO uae_id FROM countries WHERE slug = 'united-arab-emirates';

  -- Cities
  INSERT INTO country_cities (country_id, name, description, highlights, is_capital, order_index) VALUES
  (uae_id, 'Dubai', 'The jewel of the UAE, known for luxury and innovation', ARRAY['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Dubai Marina'], false, 1),
  (uae_id, 'Abu Dhabi', 'The sophisticated capital', ARRAY['Sheikh Zayed Grand Mosque', 'Louvre Abu Dhabi', 'Emirates Palace'], true, 2),
  (uae_id, 'Sharjah', 'The cultural capital', ARRAY['Islamic Museum', 'Al Noor Island', 'Traditional souks'], false, 3);

  -- Must Visit Places
  INSERT INTO country_must_visit (country_id, name, description, type, highlights, order_index) VALUES
  (uae_id, 'Burj Khalifa', 'World''s tallest building at 828 meters', 'landmark', ARRAY['Observation deck', 'Dubai Fountain', 'Fine dining'], 1),
  (uae_id, 'Sheikh Zayed Grand Mosque', 'Architectural masterpiece', 'religious', ARRAY['Stunning architecture', 'Free tours', 'Night illumination'], 2),
  (uae_id, 'Palm Jumeirah', 'Iconic man-made island', 'landmark', ARRAY['Atlantis The Palm', 'Beach clubs', 'Monorail'], 3);

  -- Attractions
  INSERT INTO country_attractions (country_id, name, description, category, type, order_index) VALUES
  (uae_id, 'Desert Safari', 'Thrilling dune bashing adventure', 'adventure', 'activity', 1),
  (uae_id, 'Gold Souk', 'Traditional gold market', 'shopping', 'market', 2),
  (uae_id, 'Burj Al Arab', 'World''s only 7-star hotel', 'landmark', 'hotel', 3);

  -- Essential Tips
  INSERT INTO country_essential_tips (country_id, title, note, icon, order_index) VALUES
  (uae_id, 'Currency', 'UAE Dirham (AED). 1 USD ≈ 3.67 AED. Cards widely accepted.', 'Banknote', 1),
  (uae_id, 'Dress Code', 'Dress modestly in public. Cover shoulders and knees.', 'Shirt', 2),
  (uae_id, 'Transportation', 'Excellent metro in Dubai. Taxis and ride-sharing available.', 'Car', 3),
  (uae_id, 'Language', 'Arabic is official. English widely spoken in tourist areas.', 'Languages', 4),
  (uae_id, 'Safety', 'Very safe with low crime rates. Emergency: 999.', 'Shield', 5);

  -- FAQs
  INSERT INTO country_faqs (country_id, question, answer) VALUES
  (uae_id, 'Do I need a visa?', 'Many nationalities get visa-on-arrival or can apply for e-visa online.'),
  (uae_id, 'Is it safe?', 'Yes, UAE is one of the world''s safest countries with very low crime rates.'),
  (uae_id, 'Best time to visit?', 'November to March offers pleasant weather. Summer is hot but cheaper.'),
  (uae_id, 'Can I drink alcohol?', 'Alcohol available in licensed venues only. Not in public places.'),
  (uae_id, 'How expensive is it?', 'Can be expensive but options exist for all budgets. Street food and public transport are affordable.');

  -- Country Content (additional sections)
  INSERT INTO country_content (country_id, section_type, title, content, order_index) VALUES
  (uae_id, 'accommodation', 'Where to Stay', jsonb_build_object(
    'text', 'From ultra-luxury 7-star hotels to budget options. Dubai Marina, Downtown Dubai, and Palm Jumeirah are popular.',
    'highlights', jsonb_build_array('Luxury: Burj Al Arab, Atlantis', 'Mid-range: Ibis, Novotel', 'Budget: Holiday apartments')
  ), 1),
  (uae_id, 'transportation', 'Getting Around', jsonb_build_object(
    'text', 'Excellent metro system in Dubai. Taxis metered and safe. Ride-sharing apps available.',
    'highlights', jsonb_build_array('Dubai Metro', 'Taxis', 'Car rental', 'Buses')
  ), 2);
END $$;