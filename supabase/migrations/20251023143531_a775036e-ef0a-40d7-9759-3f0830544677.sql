-- Insert United Arab Emirates country with comprehensive data
WITH inserted_country AS (
  INSERT INTO countries (
    name, slug, region, capital, currency, climate, best_season, languages,
    speciality, culture, description, overview_description, about_content,
    best_time_content, food_shopping_content, art_culture_content, travel_tips,
    contact_phone, contact_email, is_popular, annual_visitors,
    gender_male_percentage, gender_female_percentage,
    visitor_statistics, fun_facts, before_you_go_tips, reasons_to_visit, dos_donts,
    contact_info
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
    'The United Arab Emirates is a dazzling federation of seven emirates that has transformed from a desert landscape into one of the world''s most luxurious destinations. Home to iconic landmarks like the Burj Khalifa, Palm Jumeirah, and Sheikh Zayed Grand Mosque, the UAE offers visitors an extraordinary mix of futuristic cities, pristine beaches, vast deserts, and rich cultural heritage.',
    'Experience the perfect blend of Arabian tradition and modern luxury in the UAE. From the towering skyscrapers of Dubai to the cultural treasures of Abu Dhabi, from thrilling desert adventures to world-class shopping, the UAE offers an unforgettable journey through innovation, hospitality, and timeless beauty.',
    'The United Arab Emirates consists of seven emirates: Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah. Each emirate has its own unique character and attractions. Abu Dhabi, the capital, is known for its cultural institutions and grand architecture. Dubai is famous for its luxury shopping, ultramodern architecture, and vibrant nightlife. The UAE has rapidly developed from a pearl diving and trading economy to become a global hub for tourism, business, and innovation. Despite modernization, the country maintains strong ties to its Bedouin heritage and Islamic traditions.',
    'The best time to visit UAE is between November and March when temperatures are pleasant (20-30°C). Winter months offer perfect conditions for outdoor activities, desert safaris, and beach visits. Summer (June-August) is extremely hot (40-50°C) but offers significant hotel discounts and indoor attractions. The UAE experiences minimal rainfall, making it a year-round destination for indoor activities.',
    'UAE is a paradise for food lovers and shoppers. From traditional Emirati cuisine to international fine dining, the culinary scene is world-class. Don''t miss trying shawarma, hummus, falafel, machboos, and luqaimat. The Dubai Mall, Mall of the Emirates, and traditional souks offer unparalleled shopping experiences. Gold Souk and Spice Souk provide authentic Arabian shopping experiences.',
    'UAE''s art and culture scene is thriving with institutions like Louvre Abu Dhabi, Dubai Opera, and Sharjah Art Museum. The country celebrates its heritage through cultural festivals, traditional dance performances, and heritage villages. Islamic architecture is showcased in magnificent mosques, while contemporary art galleries display works from international and local artists.',
    'Respect local customs and dress modestly in public areas. Alcohol is only available in licensed venues. Friday is the main prayer day. Public displays of affection should be minimal. Photography of government buildings and local people should be done with permission. The UAE uses type G power sockets (240V). Taxis and metro are convenient for transportation. English is widely spoken in tourist areas.',
    '+971-4-123-4567',
    'info@uaetourism.ae',
    true,
    21000000,
    65,
    35,
    jsonb_build_object(
      'annual', 21000000,
      'gender', jsonb_build_object('male', 65, 'female', 35),
      'purposes', jsonb_build_array(
        jsonb_build_object('name', 'Leisure', 'percentage', 65),
        jsonb_build_object('name', 'Business', 'percentage', 20),
        jsonb_build_object('name', 'Shopping', 'percentage', 10),
        jsonb_build_object('name', 'Transit', 'percentage', 5)
      ),
      'topOrigins', jsonb_build_array(
        jsonb_build_object('country', 'India', 'percentage', 25),
        jsonb_build_object('country', 'Saudi Arabia', 'percentage', 15),
        jsonb_build_object('country', 'United Kingdom', 'percentage', 10),
        jsonb_build_object('country', 'China', 'percentage', 8),
        jsonb_build_object('country', 'United States', 'percentage', 7)
      )
    ),
    jsonb_build_array(
      jsonb_build_object('icon', 'Building2', 'text', 'Home to Burj Khalifa, the world''s tallest building at 828 meters'),
      jsonb_build_object('icon', 'Palmtree', 'text', 'Palm Jumeirah is the world''s largest man-made island'),
      jsonb_build_object('icon', 'Crown', 'text', 'Seven emirates united to form the UAE in 1971'),
      jsonb_build_object('icon', 'Droplets', 'text', 'Produces drinking water from desalination plants'),
      jsonb_build_object('icon', 'Car', 'text', 'Dubai Police use Lamborghinis and Ferraris as patrol cars'),
      jsonb_build_object('icon', 'Globe', 'text', 'Over 200 nationalities live and work in the UAE')
    ),
    jsonb_build_array(
      jsonb_build_object('icon', 'FileCheck', 'text', 'Visa on arrival for many nationalities, e-visa available online'),
      jsonb_build_object('icon', 'Plane', 'text', 'Major airlines fly to Dubai and Abu Dhabi international airports'),
      jsonb_build_object('icon', 'Banknote', 'text', 'Currency exchange available at airports, malls, and exchange houses'),
      jsonb_build_object('icon', 'Wifi', 'text', 'Free WiFi available in malls, hotels, and public areas'),
      jsonb_build_object('icon', 'Phone', 'text', 'International roaming works well, SIM cards easily available')
    ),
    jsonb_build_array(
      jsonb_build_object('icon', 'Building2', 'text', 'Iconic modern architecture including Burj Khalifa and Burj Al Arab'),
      jsonb_build_object('icon', 'ShoppingBag', 'text', 'World-class shopping in massive malls and traditional souks'),
      jsonb_build_object('icon', 'Palmtree', 'text', 'Thrilling desert safaris with dune bashing and camel rides'),
      jsonb_build_object('icon', 'Utensils', 'text', 'Diverse culinary scene from street food to Michelin-starred restaurants'),
      jsonb_build_object('icon', 'Sun', 'text', 'Beautiful beaches and water sports along the Arabian Gulf'),
      jsonb_build_object('icon', 'Landmark', 'text', 'Rich cultural heritage sites and museums'),
      jsonb_build_object('icon', 'Star', 'text', 'Luxury hotels and resorts offering world-class hospitality'),
      jsonb_build_object('icon', 'Camera', 'text', 'Instagram-worthy locations at every corner')
    ),
    jsonb_build_object(
      'dos', jsonb_build_array(
        'Dress modestly, especially in public areas and government buildings',
        'Respect Islamic customs, particularly during Ramadan',
        'Ask permission before photographing local people',
        'Use your right hand for greetings and when eating',
        'Remove shoes when entering someone''s home or a mosque',
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
    ),
    jsonb_build_object(
      'email', 'info@uaetourism.ae',
      'phone', '+971-4-123-4567',
      'address', 'Tourism Information Center, Dubai, UAE',
      'whatsapp', '+971-50-123-4567'
    )
  )
  RETURNING id
)
-- Insert country sections
INSERT INTO country_sections (country_id, section_name, title, content, order_index, is_enabled)
SELECT id, 'hero', 'Welcome to United Arab Emirates', jsonb_build_object(
  'subtitle', 'Where Ancient Heritage Meets Modern Luxury',
  'description', 'Experience the extraordinary blend of tradition and innovation in the land of golden deserts and towering skyscrapers'
), 0, true FROM inserted_country
UNION ALL
SELECT id, 'overview', 'Discover the UAE', jsonb_build_object(
  'text', 'The United Arab Emirates is a captivating destination that seamlessly blends ancient Arabian culture with cutting-edge modernity. From the world''s tallest building to vast desert landscapes, from luxury shopping to traditional souks, the UAE offers experiences that cater to every traveler''s dream.'
), 1, true FROM inserted_country
UNION ALL
SELECT id, 'culture', 'Rich Cultural Heritage', jsonb_build_object(
  'text', 'UAE culture is deeply rooted in Islamic traditions and Bedouin heritage. The country honors its past while embracing the future, evident in its magnificent mosques, cultural festivals, traditional majlis gatherings, and world-class museums like the Louvre Abu Dhabi.'
), 2, true FROM inserted_country
UNION ALL
SELECT id, 'adventure', 'Desert Adventures', jsonb_build_object(
  'text', 'Experience the thrill of the Arabian desert with dune bashing, camel rides, sandboarding, and overnight camping under the stars. Desert safaris offer authentic Bedouin experiences with traditional entertainment, henna painting, and delicious BBQ dinners.'
), 3, true FROM inserted_country;