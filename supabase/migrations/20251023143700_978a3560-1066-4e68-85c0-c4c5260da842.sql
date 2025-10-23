-- Get UAE country ID
DO $$
DECLARE
  uae_country_id uuid;
BEGIN
  SELECT id INTO uae_country_id FROM countries WHERE slug = 'united-arab-emirates';

  -- Insert major cities
  INSERT INTO country_cities (country_id, name, description, highlights, is_capital, order_index) VALUES
  (uae_country_id, 'Dubai', 'The jewel of the UAE, known for luxury, innovation, and world records', ARRAY[
    'Burj Khalifa - World''s tallest building',
    'Palm Jumeirah - Iconic man-made island',
    'Dubai Mall - Largest shopping mall',
    'Dubai Marina - Stunning waterfront district',
    'Old Dubai - Traditional souks and heritage'
  ], false, 1),
  (uae_country_id, 'Abu Dhabi', 'The sophisticated capital blending culture with modernity', ARRAY[
    'Sheikh Zayed Grand Mosque',
    'Louvre Abu Dhabi',
    'Emirates Palace',
    'Yas Island entertainment hub',
    'Qasr Al Watan palace'
  ], true, 2),
  (uae_country_id, 'Sharjah', 'The cultural capital with rich heritage and arts', ARRAY[
    'Sharjah Museum of Islamic Civilization',
    'Al Noor Island',
    'Traditional souks',
    'Art galleries and cultural centers'
  ], false, 3),
  (uae_country_id, 'Ras Al Khaimah', 'Adventure destination with mountains and beaches', ARRAY[
    'Jebel Jais - UAE''s highest peak',
    'World''s longest zipline',
    'Beautiful beaches',
    'Desert adventures'
  ], false, 4);

  -- Insert must-visit attractions
  INSERT INTO country_must_visit (country_id, name, description, type, highlights, order_index) VALUES
  (uae_country_id, 'Burj Khalifa', 'The world''s tallest building standing at 828 meters with breathtaking observation decks offering panoramic views of Dubai', 'landmark', ARRAY['At The Top observation deck', 'Dubai Fountain shows', 'Armani Hotel', 'Fine dining restaurants'], 1),
  (uae_country_id, 'Sheikh Zayed Grand Mosque', 'One of the world''s largest mosques, an architectural masterpiece featuring stunning white marble, gold-plated chandeliers, and the world''s largest hand-knotted carpet', 'religious', ARRAY['Stunning Islamic architecture', 'Free guided tours', 'Beautiful night illumination', 'Peaceful courtyard'], 2),
  (uae_country_id, 'Palm Jumeirah', 'The iconic palm-shaped artificial island featuring luxury hotels, residences, and beach clubs', 'landmark', ARRAY['Atlantis The Palm', 'Beach clubs', 'Monorail ride', 'Stunning views'], 3),
  (uae_country_id, 'Dubai Mall', 'World''s largest shopping and entertainment destination with over 1,200 stores, aquarium, and ice rink', 'shopping', ARRAY['Dubai Aquarium', 'Olympic-size ice rink', 'VR Park', '200+ dining options'], 4),
  (uae_country_id, 'Louvre Abu Dhabi', 'A universal museum showcasing art and civilization from around the world in stunning architecture', 'museum', ARRAY['World-class art collection', 'Jean Nouvel architecture', 'Cultural exhibitions', 'Waterfront location'], 5),
  (uae_country_id, 'Dubai Marina', 'A stunning waterfront district with skyscrapers, yacht clubs, and vibrant dining scene', 'district', ARRAY['Marina Walk promenade', 'Yacht cruises', 'Beach clubs', 'Restaurants and cafes'], 6);

  -- Insert country attractions
  INSERT INTO country_attractions (country_id, name, description, category, type, order_index) VALUES
  (uae_country_id, 'Desert Safari', 'Thrilling 4x4 dune bashing adventure with camel rides, sandboarding, and traditional Bedouin camp experience', 'adventure', 'activity', 1),
  (uae_country_id, 'Gold Souk', 'Traditional market displaying dazzling arrays of gold jewelry with competitive prices and authentic Arabian shopping experience', 'shopping', 'market', 2),
  (uae_country_id, 'Burj Al Arab', 'The world''s only 7-star hotel, an iconic sail-shaped luxury resort symbol of Dubai', 'landmark', 'hotel', 3),
  (uae_country_id, 'Ferrari World', 'The world''s largest indoor theme park featuring record-breaking rides and Ferrari experiences', 'entertainment', 'theme-park', 4),
  (uae_country_id, 'Dubai Creek', 'Historic waterway offering traditional abra rides and views of old and new Dubai', 'heritage', 'waterway', 5),
  (uae_country_id, 'Jebel Jais', 'UAE''s highest mountain with world''s longest zipline and stunning viewpoints', 'nature', 'mountain', 6);

  -- Insert essential tips
  INSERT INTO country_essential_tips (country_id, title, note, icon, order_index) VALUES
  (uae_country_id, 'Currency', 'UAE Dirham (AED) is the official currency. 1 USD ≈ 3.67 AED. Credit cards widely accepted.', 'Banknote', 1),
  (uae_country_id, 'Dress Code', 'Dress modestly in public. Swimwear only at beaches/pools. Cover shoulders and knees at malls and restaurants.', 'Shirt', 2),
  (uae_country_id, 'Transportation', 'Excellent metro in Dubai, taxis readily available, ride-sharing apps work well. Consider renting a car for flexibility.', 'Car', 3),
  (uae_country_id, 'Language', 'Arabic is official but English widely spoken in tourist areas, hotels, and restaurants.', 'Languages', 4),
  (uae_country_id, 'Safety', 'UAE is one of the world''s safest countries with very low crime rates. Emergency number: 999.', 'Shield', 5),
  (uae_country_id, 'Ramadan', 'During Ramadan, respect fasting hours. No eating/drinking/smoking in public during daylight.', 'Moon', 6);

  -- Insert FAQs
  INSERT INTO country_faqs (country_id, question, answer) VALUES
  (uae_country_id, 'Do I need a visa to visit UAE?', 'Many nationalities receive visa-on-arrival or can apply for e-visa online. Check with UAE embassy for your country''s requirements. Tourist visas are typically valid for 30-90 days.'),
  (uae_country_id, 'Is it safe to travel to UAE?', 'Yes, UAE is one of the safest countries in the world with very low crime rates. The government maintains strict laws ensuring tourist safety. However, always follow local laws and customs.'),
  (uae_country_id, 'What is the best time to visit UAE?', 'November to March offers pleasant weather (20-30°C) perfect for outdoor activities. Summer (June-August) is extremely hot (40-50°C) but offers hotel discounts and indoor attractions.'),
  (uae_country_id, 'Can I drink alcohol in UAE?', 'Alcohol is available in licensed venues like hotels, restaurants, and clubs in Dubai and Abu Dhabi. It''s illegal to drink in public places. Sharjah and some emirates are completely dry.'),
  (uae_country_id, 'How expensive is UAE?', 'UAE can be expensive but offers options for all budgets. Dubai and Abu Dhabi are pricier than other emirates. Budget for accommodation, dining, and attractions accordingly. Street food and public transport are affordable.'),
  (uae_country_id, 'What should I wear in UAE?', 'Dress modestly in public areas. Women should cover shoulders and knees. Men should avoid sleeveless shirts in malls/restaurants. Beachwear only at beaches and pools. Mosques require full coverage.'),
  (uae_country_id, 'Is UAE family-friendly?', 'Absolutely! UAE offers numerous family attractions including theme parks (Ferrari World, IMG Worlds), water parks, beaches, aquariums, and safe public spaces. Many hotels offer kids'' clubs and family packages.'),
  (uae_country_id, 'Can I visit mosques in UAE?', 'Sheikh Zayed Grand Mosque in Abu Dhabi welcomes non-Muslim visitors with free guided tours. Most other mosques are for Muslims only. Modest dress and respectful behavior required.');

  -- Insert country content sections
  INSERT INTO country_content (country_id, section_type, title, content, order_index) VALUES
  (uae_country_id, 'accommodation', 'Where to Stay', jsonb_build_object(
    'text', 'UAE offers world-class accommodation from ultra-luxury 7-star hotels to budget-friendly options. Dubai Marina, Downtown Dubai, and Palm Jumeirah offer proximity to attractions. Abu Dhabi''s Yas Island and Corniche are popular. Book in advance during peak season (November-March). Consider location based on your itinerary to minimize travel time.',
    'highlights', jsonb_build_array(
      'Luxury hotels: Burj Al Arab, Emirates Palace, Atlantis',
      'Mid-range: Ibis, Novotel, Rove Hotels',
      'Budget: Premier Inn, ibis budget, holiday apartments',
      'Unique stays: Desert camps, beach resorts'
    )
  ), 1),
  (uae_country_id, 'transportation', 'Getting Around', jsonb_build_object(
    'text', 'UAE has excellent transportation infrastructure. Dubai Metro is efficient and affordable covering major attractions. Taxis are plentiful and metered. Ride-sharing apps (Uber, Careem) operate in major cities. Renting a car offers flexibility for exploring multiple emirates. Inter-emirate buses connect major cities. Consider Dubai Tourist Pass for unlimited metro and bus travel.',
    'highlights', jsonb_build_array(
      'Dubai Metro: Red and Green lines cover major areas',
      'Taxis: Metered, safe, and readily available',
      'Car rental: International license accepted, right-hand drive',
      'Buses: Affordable inter-city and local options'
    )
  ), 2),
  (uae_country_id, 'cuisine', 'Food & Dining', jsonb_build_object(
    'text', 'UAE''s culinary scene is incredibly diverse, from authentic Emirati cuisine to international fine dining. Must-try local dishes include machboos (spiced rice with meat), harees (wheat and meat porridge), luqaimat (sweet dumplings), and fresh dates. Shawarma and falafel are popular street foods. Friday brunch is a UAE tradition. Explore traditional restaurants in Al Fahidi district or high-end dining in Burj Khalifa.',
    'highlights', jsonb_build_array(
      'Emirati cuisine: Al Fanar, Arabian Tea House',
      'Street food: Shawarma, manakish, fresh juices',
      'Fine dining: At.mosphere, Nobu, Zuma',
      'International: Every cuisine imaginable available'
    )
  ), 3),
  (uae_country_id, 'shopping', 'Shopping Paradise', jsonb_build_object(
    'text', 'UAE is a shopper''s paradise offering everything from traditional souks to ultra-modern malls. Dubai Mall and Mall of Emirates feature luxury brands and entertainment. Gold Souk and Spice Souk in Deira offer traditional shopping experiences with bargaining opportunities. Abu Dhabi''s Yas Mall and Marina Mall are equally impressive. Dubai Shopping Festival (January-February) offers massive discounts.',
    'highlights', jsonb_build_array(
      'Mega malls: Dubai Mall, Mall of Emirates, Yas Mall',
      'Traditional markets: Gold Souk, Spice Souk, Textile Souk',
      'Luxury: Dubai Marina Mall, The Galleria',
      'Shopping festivals: DSF (January-February), DSS (July-August)'
    )
  ), 4);
END $$;