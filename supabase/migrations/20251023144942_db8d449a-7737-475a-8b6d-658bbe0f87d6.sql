-- Delete all United Arab Emirates data
DO $$
DECLARE
  uae_id uuid;
BEGIN
  -- Get UAE country ID
  SELECT id INTO uae_id FROM countries WHERE slug = 'united-arab-emirates';
  
  IF uae_id IS NOT NULL THEN
    -- Delete related data
    DELETE FROM country_content WHERE country_id = uae_id;
    DELETE FROM country_faqs WHERE country_id = uae_id;
    DELETE FROM country_essential_tips WHERE country_id = uae_id;
    DELETE FROM country_attractions WHERE country_id = uae_id;
    DELETE FROM country_must_visit WHERE country_id = uae_id;
    DELETE FROM country_cities WHERE country_id = uae_id;
    DELETE FROM country_hero_images WHERE country_id = uae_id;
    DELETE FROM country_sections WHERE country_id = uae_id;
    DELETE FROM travel_purposes WHERE country_id = uae_id;
    DELETE FROM packages WHERE country_slug = 'united-arab-emirates';
    
    -- Delete the country itself
    DELETE FROM countries WHERE id = uae_id;
  END IF;
END $$;

-- Now insert UAE with correct structure
WITH inserted_country AS (
  INSERT INTO countries (
    name, slug, region, capital, currency, climate, best_season, languages,
    speciality, culture, description, overview_description, contact_phone, 
    contact_email, is_popular, annual_visitors, gender_male_percentage, 
    gender_female_percentage, contact_info
  ) VALUES (
    'United Arab Emirates',
    'united-arab-emirates',
    'Middle East',
    'Abu Dhabi',
    'UAE Dirham (AED)',
    'Desert climate with hot summers and mild winters',
    'November to March',
    ARRAY['Arabic', 'English'],
    'Luxury tourism, modern architecture, desert safaris, and world-class shopping',
    'A fascinating blend of traditional Arabian heritage and ultra-modern innovation',
    'The United Arab Emirates is a dazzling federation of seven emirates that has transformed from a desert landscape into one of the world''s most luxurious destinations.',
    'Experience the perfect blend of Arabian tradition and modern luxury in the UAE.',
    '+971-4-123-4567',
    'info@uaetourism.ae',
    true,
    21000000,
    65,
    35,
    jsonb_build_object(
      'email', 'info@uaetourism.ae',
      'phone', '+971-4-123-4567',
      'address', 'Tourism Information Center, Dubai, UAE',
      'whatsapp', '+971-50-123-4567'
    )
  )
  RETURNING id
)
-- Insert country sections with correct structure
INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
SELECT id, 'hero', 'Welcome to United Arab Emirates', 
  jsonb_build_object(
    'subtitle', 'Where Ancient Heritage Meets Modern Luxury',
    'description', 'Experience the extraordinary blend of tradition and innovation in the land of golden deserts and towering skyscrapers'
  ), 0, true FROM inserted_country
UNION ALL
SELECT id, 'overview', 'Discover the UAE',
  jsonb_build_object(
    'description', 'The United Arab Emirates seamlessly blends ancient Arabian culture with cutting-edge modernity. From the world''s tallest building to vast deserts, from luxury shopping to traditional souks, UAE offers unforgettable experiences.'
  ), 1, true FROM inserted_country
UNION ALL
SELECT id, 'about', 'About United Arab Emirates',
  jsonb_build_object(
    'description', 'The UAE consists of seven emirates: Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah. Each has unique attractions. Abu Dhabi is known for cultural institutions, Dubai for luxury and innovation. Despite rapid modernization, strong ties to Bedouin heritage remain.'
  ), 2, true FROM inserted_country
UNION ALL
SELECT id, 'fun_facts', 'Fun Facts About UAE',
  jsonb_build_object(
    'facts', jsonb_build_array(
      'Home to Burj Khalifa, the world''s tallest building at 828 meters',
      'Palm Jumeirah is the world''s largest man-made island',
      'Seven emirates united to form the UAE in 1971',
      'Produces drinking water from desalination plants',
      'Dubai Police use Lamborghinis and Ferraris as patrol cars',
      'Over 200 nationalities live and work in the UAE'
    )
  ), 3, true FROM inserted_country
UNION ALL
SELECT id, 'before_you_go', 'Before You Go',
  jsonb_build_object(
    'tips', jsonb_build_array(
      'Visa on arrival for many nationalities, e-visa available online',
      'Major airlines fly to Dubai and Abu Dhabi international airports',
      'Currency exchange available at airports, malls, and exchange houses',
      'Free WiFi available in malls, hotels, and public areas',
      'International roaming works well, SIM cards easily available'
    )
  ), 4, true FROM inserted_country
UNION ALL
SELECT id, 'best_time', 'Best Time to Visit',
  jsonb_build_object(
    'content', 'November to March offers pleasant weather (20-30°C) perfect for outdoor activities. Summer (June-August) is extremely hot (40-50°C) but offers hotel discounts. UAE experiences minimal rainfall, making it a year-round destination.'
  ), 5, true FROM inserted_country
UNION ALL
SELECT id, 'reasons_to_visit', 'Why Visit UAE',
  jsonb_build_object(
    'reasons', jsonb_build_array(
      'Iconic modern architecture including Burj Khalifa and Burj Al Arab',
      'World-class shopping in massive malls and traditional souks',
      'Thrilling desert safaris with dune bashing and camel rides',
      'Diverse culinary scene from street food to Michelin-starred restaurants',
      'Beautiful beaches and water sports along the Arabian Gulf',
      'Rich cultural heritage sites and museums',
      'Luxury hotels and resorts offering world-class hospitality',
      'Instagram-worthy locations at every corner'
    )
  ), 6, true FROM inserted_country
UNION ALL
SELECT id, 'food_shopping', 'Food & Shopping',
  jsonb_build_object(
    'food', 'UAE''s culinary scene is incredibly diverse. Must-try dishes include machboos (spiced rice with meat), harees, luqaimat (sweet dumplings), and fresh dates. Shawarma and falafel are popular street foods. Friday brunch is a UAE tradition.',
    'shopping', 'UAE is a shopper''s paradise. Dubai Mall and Mall of Emirates feature luxury brands. Gold Souk and Spice Souk offer traditional shopping with bargaining. Dubai Shopping Festival (January-February) offers massive discounts.'
  ), 7, true FROM inserted_country
UNION ALL
SELECT id, 'dos_donts', 'Do''s and Don''ts',
  jsonb_build_object(
    'dos', jsonb_build_array(
      'Dress modestly, especially in public areas and government buildings',
      'Respect Islamic customs, particularly during Ramadan',
      'Ask permission before photographing local people',
      'Use your right hand for greetings and when eating',
      'Remove shoes when entering someone''s home or mosque',
      'Carry your passport or ID at all times'
    ),
    'donts', jsonb_build_array(
      'Don''t show public displays of affection',
      'Don''t consume alcohol in public areas (only in licensed venues)',
      'Don''t eat, drink, or smoke in public during Ramadan fasting hours',
      'Don''t use offensive language or gestures',
      'Don''t photograph government buildings without permission',
      'Don''t engage in drug use - penalties are severe'
    )
  ), 8, true FROM inserted_country
UNION ALL
SELECT id, 'art_culture', 'Art & Culture',
  jsonb_build_object(
    'content', 'UAE''s art scene thrives with Louvre Abu Dhabi, Dubai Opera, and Sharjah Art Museum. The country celebrates heritage through festivals, traditional dance, and heritage villages. Islamic architecture is showcased in magnificent mosques.'
  ), 9, true FROM inserted_country;