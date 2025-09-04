-- Update existing packages with better images and complete itineraries
UPDATE packages SET 
  image = '/places/thailand/bangkok.jpg',
  itinerary = '[
    {
      "day": 1,
      "title": "Arrival in Bangkok",
      "description": "Welcome to the Land of Smiles",
      "activities": ["Airport transfer", "Hotel check-in", "Welcome orientation", "Street food tour"],
      "meals": ["Welcome dinner"],
      "accommodation": "4-star hotel in Sukhumvit"
    },
    {
      "day": 2,
      "title": "Bangkok Temples & Culture",
      "description": "Explore ancient temples and royal palaces",
      "activities": ["Grand Palace visit", "Wat Pho temple", "Wat Arun temple", "Chao Phraya river cruise"],
      "meals": ["Breakfast", "Traditional Thai lunch", "Dinner"],
      "accommodation": "4-star hotel in Sukhumvit"
    },
    {
      "day": 3,
      "title": "Floating Markets & Shopping",
      "description": "Experience local markets and modern shopping",
      "activities": ["Damnoen Saduak floating market", "Train market", "Chatuchak market", "MBK shopping"],
      "meals": ["Breakfast", "Market lunch", "Dinner"],
      "accommodation": "4-star hotel in Sukhumvit"
    }
  ]'::jsonb
WHERE title = 'Thailand' AND region = 'Asia';

-- Insert 10 new packages for Asia region
INSERT INTO packages (title, country, country_slug, region, duration, price, original_price, image, category, highlights, inclusions, exclusions, itinerary, rating, reviews, featured, best_time, group_size, overview_description) VALUES

('Japan Samurai Experience', 'Japan', 'japan', 'Asia', '8 Days / 7 Nights', '₹1,85,000', '₹2,10,000', '/places/japan/tokyo.jpg', 'Cultural', 
ARRAY['Traditional temples', 'Mount Fuji views', 'Samurai experience', 'Cherry blossoms'], 
ARRAY['7 nights accommodation', 'Daily breakfast', 'Cultural experiences', 'Professional guide'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Tokyo Arrival", "description": "Welcome to modern Japan", "activities": ["Airport transfer", "Hotel check-in", "Tokyo Tower visit"], "meals": ["Welcome dinner"], "accommodation": "Tokyo hotel"},
  {"day": 2, "title": "Traditional Culture", "description": "Ancient temples and traditions", "activities": ["Senso-ji temple", "Imperial Palace", "Traditional tea ceremony"], "meals": ["Breakfast", "Traditional lunch"], "accommodation": "Tokyo hotel"},
  {"day": 3, "title": "Mount Fuji Day Trip", "description": "Iconic mountain experience", "activities": ["Lake Kawaguchi", "Mount Fuji 5th station", "Hot springs"], "meals": ["Breakfast", "Lake lunch"], "accommodation": "Tokyo hotel"}
]'::jsonb, 4.8, 156, true, 'March-May, September-November', '8-12 people', 'Experience authentic Japanese culture with samurai traditions and stunning natural beauty'),

('South Korea K-Culture Tour', 'South Korea', 'south-korea', 'Asia', '6 Days / 5 Nights', '₹1,25,000', '₹1,45,000', '/places/south-korea/seoul.jpg', 'Cultural', 
ARRAY['K-pop experiences', 'Traditional palaces', 'Modern Seoul', 'DMZ tour'], 
ARRAY['5 nights accommodation', 'Daily breakfast', 'Cultural activities', 'Professional guide'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Seoul Arrival", "description": "Welcome to dynamic Seoul", "activities": ["Airport transfer", "Myeongdong shopping", "N Seoul Tower"], "meals": ["Korean BBQ dinner"], "accommodation": "Seoul hotel"},
  {"day": 2, "title": "Royal Palaces", "description": "Historic Korean architecture", "activities": ["Gyeongbokgung Palace", "Bukchon Hanok Village", "Insadong cultural district"], "meals": ["Breakfast", "Traditional lunch"], "accommodation": "Seoul hotel"},
  {"day": 3, "title": "DMZ Experience", "description": "Korean War history", "activities": ["DMZ tour", "Joint Security Area", "War Memorial"], "meals": ["Breakfast", "DMZ lunch"], "accommodation": "Seoul hotel"}
]'::jsonb, 4.6, 89, false, 'April-June, September-November', '6-10 people', 'Discover modern Korean culture and historic traditions in the vibrant capital'),

('Philippines Island Paradise', 'Philippines', 'philippines', 'Asia', '7 Days / 6 Nights', '₹95,000', '₹1,15,000', '/places/philippines/manila.jpg', 'Beach', 
ARRAY['Pristine beaches', 'Island hopping', 'Coral reefs', 'Local culture'], 
ARRAY['6 nights accommodation', 'Daily breakfast', 'Island tours', 'Snorkeling gear'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Manila Arrival", "description": "Welcome to the Philippines", "activities": ["Airport transfer", "City orientation", "Intramuros tour"], "meals": ["Filipino dinner"], "accommodation": "Manila hotel"},
  {"day": 2, "title": "Palawan Journey", "description": "Island paradise begins", "activities": ["Flight to Palawan", "El Nido arrival", "Beach relaxation"], "meals": ["Breakfast", "Seafood lunch"], "accommodation": "Beach resort"},
  {"day": 3, "title": "Island Hopping", "description": "Hidden lagoons and beaches", "activities": ["Big Lagoon", "Small Lagoon", "Secret Beach", "Snorkeling"], "meals": ["Breakfast", "Beach picnic"], "accommodation": "Beach resort"}
]'::jsonb, 4.7, 134, false, 'December-May', '8-14 people', 'Explore stunning tropical islands with crystal clear waters and vibrant marine life'),

('Malaysia Cultural Fusion', 'Malaysia', 'malaysia', 'Asia', '6 Days / 5 Nights', '₹85,000', '₹1,05,000', '/places/malaysia/kuala-lumpur.jpg', 'Cultural', 
ARRAY['Petronas Towers', 'George Town heritage', 'Cultural diversity', 'Street food'], 
ARRAY['5 nights accommodation', 'Daily breakfast', 'Cultural tours', 'Food experiences'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Kuala Lumpur Arrival", "description": "Modern Malaysian capital", "activities": ["Airport transfer", "Petronas Towers", "KL Tower"], "meals": ["Malaysian dinner"], "accommodation": "KL hotel"},
  {"day": 2, "title": "Cultural Heritage", "description": "Diverse Malaysian culture", "activities": ["Batu Caves", "Chinatown", "Little India", "Central Market"], "meals": ["Breakfast", "Street food lunch"], "accommodation": "KL hotel"},
  {"day": 3, "title": "Penang Journey", "description": "UNESCO World Heritage", "activities": ["Flight to Penang", "George Town tour", "Street art trail"], "meals": ["Breakfast", "Penang lunch"], "accommodation": "Penang hotel"}
]'::jsonb, 4.5, 98, false, 'Year-round', '6-12 people', 'Experience the perfect blend of modern city life and rich cultural heritage'),

('Myanmar Golden Pagodas', 'Myanmar', 'myanmar', 'Asia', '8 Days / 7 Nights', '₹1,35,000', '₹1,55,000', '/places/myanmar/yangon.jpg', 'Cultural', 
ARRAY['Shwedagon Pagoda', 'Bagan temples', 'Inle Lake', 'Golden Rock'], 
ARRAY['7 nights accommodation', 'Daily breakfast', 'Temple tours', 'Cultural experiences'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Yangon Arrival", "description": "Golden Land welcome", "activities": ["Airport transfer", "Shwedagon Pagoda", "Colonial architecture"], "meals": ["Myanmar dinner"], "accommodation": "Yangon hotel"},
  {"day": 2, "title": "Bagan Ancient City", "description": "Thousand temples", "activities": ["Flight to Bagan", "Sunrise balloon ride", "Temple exploration"], "meals": ["Breakfast", "Local lunch"], "accommodation": "Bagan hotel"},
  {"day": 3, "title": "Inle Lake", "description": "Floating gardens", "activities": ["Flight to Heho", "Boat to Inle Lake", "Floating market"], "meals": ["Breakfast", "Lake lunch"], "accommodation": "Lake resort"}
]'::jsonb, 4.9, 67, true, 'October-March', '6-10 people', 'Discover ancient Buddhist temples and traditional lake communities'),

('Cambodia Angkor Discovery', 'Cambodia', 'cambodia', 'Asia', '6 Days / 5 Nights', '₹95,000', '₹1,15,000', '/places/cambodia/angkor-wat.jpg', 'Cultural', 
ARRAY['Angkor Wat', 'Bayon Temple', 'Ta Prohm', 'Floating villages'], 
ARRAY['5 nights accommodation', 'Daily breakfast', 'Temple passes', 'Professional guide'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Siem Reap Arrival", "description": "Ancient Khmer capital", "activities": ["Airport transfer", "Angkor National Museum", "Night market"], "meals": ["Khmer dinner"], "accommodation": "Siem Reap hotel"},
  {"day": 2, "title": "Angkor Wat Sunrise", "description": "Iconic temple complex", "activities": ["Sunrise at Angkor Wat", "Angkor Thom", "Bayon Temple"], "meals": ["Breakfast", "Temple lunch"], "accommodation": "Siem Reap hotel"},
  {"day": 3, "title": "Jungle Temples", "description": "Nature reclaimed temples", "activities": ["Ta Prohm temple", "Banteay Srei", "Traditional village"], "meals": ["Breakfast", "Village lunch"], "accommodation": "Siem Reap hotel"}
]'::jsonb, 4.8, 189, false, 'November-March', '8-15 people', 'Explore the magnificent Angkor temple complex and ancient Khmer civilization'),

('Laos Tranquil Escape', 'Laos', 'laos', 'Asia', '7 Days / 6 Nights', '₹75,000', '₹95,000', '/places/laos/luang-prabang.jpg', 'Cultural', 
ARRAY['UNESCO heritage', 'Mekong River', 'Buddhist temples', 'Traditional crafts'], 
ARRAY['6 nights accommodation', 'Daily breakfast', 'Cultural tours', 'Boat trips'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Luang Prabang Arrival", "description": "UNESCO World Heritage city", "activities": ["Airport transfer", "Royal Palace Museum", "Night market"], "meals": ["Lao dinner"], "accommodation": "Heritage hotel"},
  {"day": 2, "title": "Mekong River", "description": "Sacred river journey", "activities": ["Pak Ou Caves", "Traditional villages", "Sunset cruise"], "meals": ["Breakfast", "River lunch"], "accommodation": "Heritage hotel"},
  {"day": 3, "title": "Kuang Si Falls", "description": "Turquoise waterfalls", "activities": ["Kuang Si Waterfall", "Bear sanctuary", "Swimming"], "meals": ["Breakfast", "Picnic lunch"], "accommodation": "Heritage hotel"}
]'::jsonb, 4.6, 76, false, 'October-April', '6-12 people', 'Experience peaceful Buddhist culture and stunning natural landscapes'),

('Taiwan Culinary Journey', 'Taiwan', 'taiwan', 'Asia', '6 Days / 5 Nights', '₹1,15,000', '₹1,35,000', '/places/taiwan/taipei.jpg', 'Cultural', 
ARRAY['Night markets', 'Bubble tea origin', 'Hot springs', 'Traditional temples'], 
ARRAY['5 nights accommodation', 'Daily breakfast', 'Food tours', 'Cultural experiences'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Taipei Arrival", "description": "Modern Taiwanese capital", "activities": ["Airport transfer", "Taipei 101", "Shilin Night Market"], "meals": ["Street food dinner"], "accommodation": "Taipei hotel"},
  {"day": 2, "title": "Cultural Heritage", "description": "Ancient traditions", "activities": ["National Palace Museum", "Longshan Temple", "Dihua Street"], "meals": ["Breakfast", "Traditional lunch"], "accommodation": "Taipei hotel"},
  {"day": 3, "title": "Hot Springs & Nature", "description": "Natural relaxation", "activities": ["Beitou hot springs", "Yangmingshan National Park", "Traditional tea ceremony"], "meals": ["Breakfast", "Hot spring lunch"], "accommodation": "Taipei hotel"}
]'::jsonb, 4.7, 112, false, 'October-April', '6-10 people', 'Discover incredible street food culture and traditional Chinese heritage'),

('Sri Lanka Ceylon Explorer', 'Sri Lanka', 'sri-lanka', 'Asia', '8 Days / 7 Nights', '₹1,05,000', '₹1,25,000', '/places/sri-lanka/colombo.jpg', 'Cultural', 
ARRAY['Ancient cities', 'Tea plantations', 'Wildlife safaris', 'Beach paradise'], 
ARRAY['7 nights accommodation', 'Daily breakfast', 'Safari tours', 'Cultural sites'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Colombo Arrival", "description": "Pearl of the Indian Ocean", "activities": ["Airport transfer", "City tour", "Independence Memorial"], "meals": ["Sri Lankan dinner"], "accommodation": "Colombo hotel"},
  {"day": 2, "title": "Cultural Triangle", "description": "Ancient civilization", "activities": ["Drive to Dambulla", "Cave Temple", "Sigiriya Rock Fortress"], "meals": ["Breakfast", "Local lunch"], "accommodation": "Cultural triangle hotel"},
  {"day": 3, "title": "Tea Country", "description": "Hill station charm", "activities": ["Drive to Nuwara Eliya", "Tea plantation visit", "Colonial architecture"], "meals": ["Breakfast", "Plantation lunch"], "accommodation": "Hill country hotel"}
]'::jsonb, 4.8, 145, false, 'December-April, July-September', '8-14 people', 'Journey through ancient cities, lush tea gardens, and pristine beaches'),

('Nepal Himalayan Adventure', 'Nepal', 'nepal', 'Asia', '10 Days / 9 Nights', '₹1,45,000', '₹1,65,000', '/places/nepal/kathmandu.jpg', 'Adventure', 
ARRAY['Everest Base Camp trek', 'Sherpa culture', 'Mountain views', 'Buddhist monasteries'], 
ARRAY['9 nights accommodation', 'All meals during trek', 'Trekking permits', 'Experienced guide'], 
ARRAY['International flights', 'Personal trekking gear', 'Travel insurance'], 
'[
  {"day": 1, "title": "Kathmandu Arrival", "description": "Gateway to the Himalayas", "activities": ["Airport transfer", "Swayambhunath Stupa", "Thamel bazaar"], "meals": ["Nepali dinner"], "accommodation": "Kathmandu hotel"},
  {"day": 2, "title": "Lukla Flight", "description": "Beginning of trek", "activities": ["Flight to Lukla", "Trek to Phakding", "Acclimatization"], "meals": ["Breakfast", "Trail lunch", "Mountain dinner"], "accommodation": "Mountain lodge"},
  {"day": 3, "title": "Namche Bazaar", "description": "Sherpa capital", "activities": ["Trek to Namche", "Suspension bridges", "Mountain views"], "meals": ["Breakfast", "Trail lunch", "Lodge dinner"], "accommodation": "Namche lodge"}
]'::jsonb, 4.9, 234, true, 'September-November, March-May', '6-12 people', 'Trek to the base of the worlds highest peak and experience Sherpa hospitality');

-- Insert 10 new packages for Europe region
INSERT INTO packages (title, country, country_slug, region, duration, price, original_price, image, category, highlights, inclusions, exclusions, itinerary, rating, reviews, featured, best_time, group_size, overview_description) VALUES

('Switzerland Alpine Magic', 'Switzerland', 'switzerland', 'Europe', '7 Days / 6 Nights', '₹2,25,000', '₹2,55,000', '/places/switzerland/alps.jpg', 'Adventure', 
ARRAY['Jungfraujoch glacier', 'Alpine railways', 'Lake Geneva', 'Chocolate factory'], 
ARRAY['6 nights accommodation', 'Daily breakfast', 'Train passes', 'Cable car rides'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Zurich Arrival", "description": "Swiss precision begins", "activities": ["Airport transfer", "Lake Zurich cruise", "Old town walk"], "meals": ["Swiss dinner"], "accommodation": "Zurich hotel"},
  {"day": 2, "title": "Interlaken Journey", "description": "Heart of the Alps", "activities": ["Train to Interlaken", "Harder Kulm viewpoint", "Adventure activities"], "meals": ["Breakfast", "Mountain lunch"], "accommodation": "Interlaken hotel"},
  {"day": 3, "title": "Jungfraujoch Glacier", "description": "Top of Europe", "activities": ["Glacier express", "Ice Palace", "Sphinx Observatory"], "meals": ["Breakfast", "Glacier restaurant"], "accommodation": "Interlaken hotel"}
]'::jsonb, 4.9, 167, true, 'June-September', '8-12 people', 'Experience breathtaking alpine scenery and Swiss hospitality in the heart of Europe'),

('Norway Fjords & Northern Lights', 'Norway', 'norway', 'Europe', '8 Days / 7 Nights', '₹2,85,000', '₹3,15,000', '/places/norway/fjords.jpg', 'Adventure', 
ARRAY['Geiranger Fjord', 'Northern Lights', 'Midnight sun', 'Viking heritage'], 
ARRAY['7 nights accommodation', 'Daily breakfast', 'Fjord cruises', 'Northern Lights tour'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Oslo Arrival", "description": "Norwegian capital", "activities": ["Airport transfer", "Viking Ship Museum", "Opera House"], "meals": ["Nordic dinner"], "accommodation": "Oslo hotel"},
  {"day": 2, "title": "Bergen Railway", "description": "Scenic train journey", "activities": ["Train to Bergen", "Flam Railway", "Fjord cruise"], "meals": ["Breakfast", "Train lunch"], "accommodation": "Bergen hotel"},
  {"day": 3, "title": "Geiranger Fjord", "description": "UNESCO World Heritage", "activities": ["Fjord cruise", "Seven Sisters waterfall", "Eagle Road"], "meals": ["Breakfast", "Fjord lunch"], "accommodation": "Geiranger hotel"}
]'::jsonb, 4.8, 198, true, 'May-September (Northern Lights: September-March)', '6-14 people', 'Witness stunning fjords and the magical Aurora Borealis in the land of Vikings'),

('Iceland Fire & Ice', 'Iceland', 'iceland', 'Europe', '7 Days / 6 Nights', '₹2,45,000', '₹2,75,000', '/places/iceland/reykjavik.jpg', 'Adventure', 
ARRAY['Golden Circle', 'Blue Lagoon', 'Northern Lights', 'Glacial lagoons'], 
ARRAY['6 nights accommodation', 'Daily breakfast', 'Golden Circle tour', 'Blue Lagoon entry'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Reykjavik Arrival", "description": "Land of fire and ice", "activities": ["Airport transfer", "Reykjavik city walk", "Harpa Concert Hall"], "meals": ["Icelandic dinner"], "accommodation": "Reykjavik hotel"},
  {"day": 2, "title": "Golden Circle", "description": "Natural wonders", "activities": ["Thingvellir National Park", "Geysir geothermal area", "Gullfoss waterfall"], "meals": ["Breakfast", "Countryside lunch"], "accommodation": "Reykjavik hotel"},
  {"day": 3, "title": "Blue Lagoon", "description": "Geothermal spa", "activities": ["Blue Lagoon relaxation", "Silica mud mask", "Geothermal pools"], "meals": ["Breakfast", "Spa lunch"], "accommodation": "Reykjavik hotel"}
]'::jsonb, 4.7, 156, false, 'September-March (Northern Lights), May-September (Midnight Sun)', '8-12 people', 'Explore dramatic landscapes, geothermal wonders, and pristine wilderness'),

('Portugal Hidden Gems', 'Portugal', 'portugal', 'Europe', '6 Days / 5 Nights', '₹1,45,000', '₹1,65,000', '/places/portugal/lisbon.jpg', 'Cultural', 
ARRAY['Lisbon trams', 'Porto wine cellars', 'Sintra palaces', 'Fado music'], 
ARRAY['5 nights accommodation', 'Daily breakfast', 'Wine tastings', 'Cultural tours'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Lisbon Arrival", "description": "City of seven hills", "activities": ["Airport transfer", "Tram 28 tour", "Fado dinner show"], "meals": ["Portuguese dinner"], "accommodation": "Lisbon hotel"},
  {"day": 2, "title": "Sintra Day Trip", "description": "Romantic palaces", "activities": ["Pena Palace", "Quinta da Regaleira", "Cascais coastline"], "meals": ["Breakfast", "Sintra lunch"], "accommodation": "Lisbon hotel"},
  {"day": 3, "title": "Porto Journey", "description": "Port wine capital", "activities": ["Train to Porto", "Ribeira district", "Port wine cellars"], "meals": ["Breakfast", "Porto lunch"], "accommodation": "Porto hotel"}
]'::jsonb, 4.6, 134, false, 'April-October', '8-14 people', 'Discover charming Portuguese culture, historic cities, and world-famous wines'),

('Scotland Highlands & Castles', 'Scotland', 'scotland', 'Europe', '8 Days / 7 Nights', '₹1,95,000', '₹2,25,000', '/places/scotland/edinburgh.jpg', 'Cultural', 
ARRAY['Edinburgh Castle', 'Loch Ness', 'Isle of Skye', 'Whisky distilleries'], 
ARRAY['7 nights accommodation', 'Daily breakfast', 'Castle entries', 'Whisky tastings'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Edinburgh Arrival", "description": "Scottish capital", "activities": ["Airport transfer", "Edinburgh Castle", "Royal Mile walk"], "meals": ["Scottish dinner"], "accommodation": "Edinburgh hotel"},
  {"day": 2, "title": "Highlands Journey", "description": "Dramatic landscapes", "activities": ["Drive to Highlands", "Stirling Castle", "Loch Katrine"], "meals": ["Breakfast", "Highland lunch"], "accommodation": "Highland hotel"},
  {"day": 3, "title": "Loch Ness Mystery", "description": "Legendary lake", "activities": ["Loch Ness cruise", "Urquhart Castle", "Nessie hunting"], "meals": ["Breakfast", "Loch lunch"], "accommodation": "Highland hotel"}
]'::jsonb, 4.8, 189, false, 'May-September', '6-12 people', 'Experience ancient castles, mysterious lochs, and Highland warrior traditions'),

('Ireland Emerald Isle', 'Ireland', 'ireland', 'Europe', '7 Days / 6 Nights', '₹1,75,000', '₹2,05,000', '/places/ireland/dublin.jpg', 'Cultural', 
ARRAY['Cliffs of Moher', 'Ring of Kerry', 'Dublin pubs', 'Traditional music'], 
ARRAY['6 nights accommodation', 'Daily breakfast', 'Scenic drives', 'Cultural experiences'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Dublin Arrival", "description": "City of literature", "activities": ["Airport transfer", "Trinity College", "Temple Bar district"], "meals": ["Irish dinner"], "accommodation": "Dublin hotel"},
  {"day": 2, "title": "Wicklow Mountains", "description": "Garden of Ireland", "activities": ["Glendalough monastery", "Powerscourt Gardens", "Wicklow Way"], "meals": ["Breakfast", "Garden lunch"], "accommodation": "Dublin hotel"},
  {"day": 3, "title": "Galway Journey", "description": "Cultural heart", "activities": ["Drive to Galway", "Cliffs of Moher", "Traditional music session"], "meals": ["Breakfast", "Coastal lunch"], "accommodation": "Galway hotel"}
]'::jsonb, 4.7, 145, false, 'April-October', '8-14 people', 'Discover Celtic heritage, dramatic coastlines, and warm Irish hospitality'),

('Austria Musical Vienna', 'Austria', 'austria', 'Europe', '6 Days / 5 Nights', '₹1,65,000', '₹1,85,000', '/places/austria/vienna.jpg', 'Cultural', 
ARRAY['Schönbrunn Palace', 'Mozart concerts', 'Salzburg old town', 'Alpine lakes'], 
ARRAY['5 nights accommodation', 'Daily breakfast', 'Concert tickets', 'Palace tours'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Vienna Arrival", "description": "Imperial capital", "activities": ["Airport transfer", "Schönbrunn Palace", "Vienna State Opera"], "meals": ["Austrian dinner"], "accommodation": "Vienna hotel"},
  {"day": 2, "title": "Musical Heritage", "description": "Classical masters", "activities": ["Mozart House", "St. Stephens Cathedral", "Concert performance"], "meals": ["Breakfast", "Café lunch"], "accommodation": "Vienna hotel"},
  {"day": 3, "title": "Salzburg Journey", "description": "Mozart birthplace", "activities": ["Train to Salzburg", "Old Town tour", "Sound of Music locations"], "meals": ["Breakfast", "Alpine lunch"], "accommodation": "Salzburg hotel"}
]'::jsonb, 4.9, 178, false, 'April-October', '6-10 people', 'Immerse in classical music heritage and imperial Austrian grandeur'),

('Croatia Adriatic Coast', 'Croatia', 'croatia', 'Europe', '8 Days / 7 Nights', '₹1,85,000', '₹2,15,000', '/places/croatia/dubrovnik.jpg', 'Cultural', 
ARRAY['Dubrovnik walls', 'Plitvice Lakes', 'Split palace', 'Island hopping'], 
ARRAY['7 nights accommodation', 'Daily breakfast', 'National park entry', 'Boat transfers'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Dubrovnik Arrival", "description": "Pearl of the Adriatic", "activities": ["Airport transfer", "City walls walk", "Old town tour"], "meals": ["Croatian dinner"], "accommodation": "Dubrovnik hotel"},
  {"day": 2, "title": "Game of Thrones", "description": "Kings Landing filming", "activities": ["Filming locations tour", "Lokrum Island", "Cable car sunset"], "meals": ["Breakfast", "Island lunch"], "accommodation": "Dubrovnik hotel"},
  {"day": 3, "title": "Split Journey", "description": "Diocletian Palace", "activities": ["Drive to Split", "Palace complex", "Riva waterfront"], "meals": ["Breakfast", "Dalmatian lunch"], "accommodation": "Split hotel"}
]'::jsonb, 4.8, 167, false, 'May-September', '8-14 people', 'Explore medieval cities, pristine national parks, and stunning Adriatic islands'),

('Czech Republic Bohemian Beauty', 'Czech Republic', 'czech-republic', 'Europe', '6 Days / 5 Nights', '₹1,25,000', '₹1,45,000', '/places/czech/prague.jpg', 'Cultural', 
ARRAY['Prague Castle', 'Charles Bridge', 'Beer culture', 'Medieval towns'], 
ARRAY['5 nights accommodation', 'Daily breakfast', 'Castle tours', 'Beer tastings'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Prague Arrival", "description": "City of a hundred spires", "activities": ["Airport transfer", "Prague Castle", "Golden Lane"], "meals": ["Czech dinner"], "accommodation": "Prague hotel"},
  {"day": 2, "title": "Old Town Magic", "description": "Medieval charm", "activities": ["Astronomical Clock", "Charles Bridge", "Jewish Quarter"], "meals": ["Breakfast", "Traditional lunch"], "accommodation": "Prague hotel"},
  {"day": 3, "title": "Cesky Krumlov", "description": "UNESCO town", "activities": ["Day trip to Cesky Krumlov", "Medieval castle", "River rafting"], "meals": ["Breakfast", "Medieval lunch"], "accommodation": "Prague hotel"}
]'::jsonb, 4.7, 189, false, 'April-October', '8-12 people', 'Experience fairy-tale architecture, rich history, and world-famous beer culture'),

('Hungary Thermal Spas', 'Hungary', 'hungary', 'Europe', '5 Days / 4 Nights', '₹95,000', '₹1,15,000', '/places/hungary/budapest.jpg', 'Cultural', 
ARRAY['Thermal baths', 'Danube cruise', 'Parliament building', 'Ruin bars'], 
ARRAY['4 nights accommodation', 'Daily breakfast', 'Spa entries', 'River cruise'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Budapest Arrival", "description": "Pearl of the Danube", "activities": ["Airport transfer", "Parliament tour", "Danube evening cruise"], "meals": ["Hungarian dinner"], "accommodation": "Budapest hotel"},
  {"day": 2, "title": "Thermal Relaxation", "description": "Healing waters", "activities": ["Széchenyi Thermal Baths", "City Park", "Heroes Square"], "meals": ["Breakfast", "Spa lunch"], "accommodation": "Budapest hotel"},
  {"day": 3, "title": "Buda Castle", "description": "Royal heritage", "activities": ["Castle complex", "Fishermans Bastion", "Wine tasting"], "meals": ["Breakfast", "Castle lunch"], "accommodation": "Budapest hotel"}
]'::jsonb, 4.6, 123, false, 'Year-round', '6-12 people', 'Relax in historic thermal baths and explore elegant Austro-Hungarian architecture');

-- Insert 10 new packages for Africa region
INSERT INTO packages (title, country, country_slug, region, duration, price, original_price, image, category, highlights, inclusions, exclusions, itinerary, rating, reviews, featured, best_time, group_size, overview_description) VALUES

('Madagascar Wildlife Expedition', 'Madagascar', 'madagascar', 'Africa', '10 Days / 9 Nights', '₹2,45,000', '₹2,75,000', '/places/madagascar/antananarivo.jpg', 'Wildlife', 
ARRAY['Lemur encounters', 'Baobab trees', 'Tsingy formations', 'Endemic species'], 
ARRAY['9 nights accommodation', 'All meals', 'National park fees', 'Wildlife guide'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Antananarivo Arrival", "description": "Red Island welcome", "activities": ["Airport transfer", "City orientation", "Royal Palace"], "meals": ["Malagasy dinner"], "accommodation": "Capital hotel"},
  {"day": 2, "title": "Andasibe National Park", "description": "Indri lemur sanctuary", "activities": ["Lemur tracking", "Orchid garden", "Night walk"], "meals": ["Breakfast", "Park lunch", "Dinner"], "accommodation": "Park lodge"},
  {"day": 3, "title": "Morondava Journey", "description": "Baobab avenue", "activities": ["Flight to Morondava", "Baobab sunset", "Local village"], "meals": ["Breakfast", "Village lunch", "Dinner"], "accommodation": "Coastal hotel"}
]'::jsonb, 4.9, 87, true, 'April-November', '6-12 people', 'Discover unique wildlife and landscapes found nowhere else on Earth'),

('Botswana Okavango Delta', 'Botswana', 'botswana', 'Africa', '8 Days / 7 Nights', '₹3,25,000', '₹3,65,000', '/places/botswana/okavango.jpg', 'Wildlife', 
ARRAY['Okavango Delta', 'Chobe elephants', 'Victoria Falls', 'Mokoro canoes'], 
ARRAY['7 nights accommodation', 'All meals', 'Game drives', 'Flight transfers'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Maun Arrival", "description": "Gateway to Okavango", "activities": ["Airport transfer", "Scenic flight", "Camp orientation"], "meals": ["Welcome dinner"], "accommodation": "Safari camp"},
  {"day": 2, "title": "Delta Exploration", "description": "Water wilderness", "activities": ["Mokoro canoe safari", "Walking safari", "Bird watching"], "meals": ["Breakfast", "Bush lunch", "Dinner"], "accommodation": "Safari camp"},
  {"day": 3, "title": "Chobe National Park", "description": "Elephant paradise", "activities": ["Game drive", "Chobe River cruise", "Sunset cocktails"], "meals": ["Breakfast", "Picnic lunch", "Dinner"], "accommodation": "River lodge"}
]'::jsonb, 4.8, 145, true, 'May-October', '6-10 people', 'Experience pristine wilderness and abundant wildlife in luxury safari camps'),

('Ethiopia Historic Route', 'Ethiopia', 'ethiopia', 'Africa', '9 Days / 8 Nights', '₹1,85,000', '₹2,15,000', '/places/ethiopia/addis-ababa.jpg', 'Cultural', 
ARRAY['Rock churches of Lalibela', 'Simien Mountains', 'Danakil Depression', 'Coffee ceremonies'], 
ARRAY['8 nights accommodation', 'Daily breakfast', 'Domestic flights', 'Cultural tours'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Addis Ababa Arrival", "description": "Roof of Africa", "activities": ["Airport transfer", "National Museum", "Coffee ceremony"], "meals": ["Ethiopian dinner"], "accommodation": "Addis hotel"},
  {"day": 2, "title": "Lalibela Journey", "description": "New Jerusalem", "activities": ["Flight to Lalibela", "Rock-hewn churches", "Orthodox ceremony"], "meals": ["Breakfast", "Local lunch", "Dinner"], "accommodation": "Lalibela hotel"},
  {"day": 3, "title": "Simien Mountains", "description": "Natural UNESCO site", "activities": ["Gelada monkey tracking", "Dramatic landscapes", "Village visit"], "meals": ["Breakfast", "Mountain lunch", "Dinner"], "accommodation": "Mountain lodge"}
]'::jsonb, 4.7, 98, false, 'October-March', '8-14 people', 'Journey through ancient Christian civilization and dramatic highland landscapes'),

('Ghana Cultural Heritage', 'Ghana', 'ghana', 'Africa', '7 Days / 6 Nights', '₹1,45,000', '₹1,65,000', '/places/ghana/accra.jpg', 'Cultural', 
ARRAY['Cape Coast Castle', 'Ashanti culture', 'Kakum canopy walk', 'Traditional festivals'], 
ARRAY['6 nights accommodation', 'Daily breakfast', 'Cultural tours', 'Traditional performances'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Accra Arrival", "description": "Gateway to West Africa", "activities": ["Airport transfer", "Independence Square", "Makola Market"], "meals": ["Ghanaian dinner"], "accommodation": "Accra hotel"},
  {"day": 2, "title": "Cape Coast Castle", "description": "Slave trade history", "activities": ["Castle tour", "Elmina Castle", "Local fishing village"], "meals": ["Breakfast", "Coastal lunch", "Dinner"], "accommodation": "Cape Coast hotel"},
  {"day": 3, "title": "Kumasi Journey", "description": "Ashanti kingdom", "activities": ["Drive to Kumasi", "Manhyia Palace", "Kente weaving"], "meals": ["Breakfast", "Royal lunch", "Dinner"], "accommodation": "Kumasi hotel"}
]'::jsonb, 4.6, 76, false, 'November-March', '8-12 people', 'Explore rich West African culture and confront the legacy of the slave trade'),

('Rwanda Gorilla Encounter', 'Rwanda', 'rwanda', 'Africa', '6 Days / 5 Nights', '₹2,85,000', '₹3,25,000', '/places/rwanda/kigali.jpg', 'Wildlife', 
ARRAY['Mountain gorillas', 'Volcanoes National Park', 'Cultural village', 'Genocide memorial'], 
ARRAY['5 nights accommodation', 'All meals', 'Gorilla permits', 'Professional guides'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Kigali Arrival", "description": "Land of a thousand hills", "activities": ["Airport transfer", "City tour", "Genocide Memorial"], "meals": ["Rwandan dinner"], "accommodation": "Kigali hotel"},
  {"day": 2, "title": "Volcanoes National Park", "description": "Gorilla sanctuary", "activities": ["Drive to Musanze", "Park briefing", "Cultural village"], "meals": ["Breakfast", "Village lunch", "Dinner"], "accommodation": "Park lodge"},
  {"day": 3, "title": "Gorilla Trekking", "description": "Ultimate wildlife encounter", "activities": ["Gorilla tracking", "Forest walk", "Conservation talk"], "meals": ["Early breakfast", "Trail lunch", "Celebration dinner"], "accommodation": "Park lodge"}
]'::jsonb, 4.9, 234, true, 'June-September, December-February', '4-8 people', 'Come face-to-face with endangered mountain gorillas in their natural habitat'),

('Namibia Desert Adventure', 'Namibia', 'namibia', 'Africa', '9 Days / 8 Nights', '₹2,65,000', '₹2,95,000', '/places/namibia/windhoek.jpg', 'Adventure', 
ARRAY['Sossusvlei dunes', 'Skeleton Coast', 'Himba tribe', 'Desert elephants'], 
ARRAY['8 nights accommodation', 'All meals', 'Desert tours', '4WD vehicles'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Windhoek Arrival", "description": "German colonial capital", "activities": ["Airport transfer", "City tour", "Craft markets"], "meals": ["Namibian dinner"], "accommodation": "Windhoek hotel"},
  {"day": 2, "title": "Sossusvlei Journey", "description": "Worlds highest dunes", "activities": ["Drive to Sossusvlei", "Deadvlei photo stop", "Sunset dune climb"], "meals": ["Breakfast", "Picnic lunch", "Desert dinner"], "accommodation": "Desert lodge"},
  {"day": 3, "title": "Swakopmund Coast", "description": "Adventure capital", "activities": ["Drive to coast", "Desert activities", "German architecture"], "meals": ["Breakfast", "Coastal lunch", "Dinner"], "accommodation": "Coastal hotel"}
]'::jsonb, 4.8, 156, false, 'May-September', '6-12 people', 'Experience otherworldly desert landscapes and unique desert-adapted wildlife'),

('Senegal Music & Culture', 'Senegal', 'senegal', 'Africa', '7 Days / 6 Nights', '₹1,25,000', '₹1,45,000', '/places/senegal/dakar.jpg', 'Cultural', 
ARRAY['Goree Island', 'Traditional music', 'Saint-Louis heritage', 'Djembe workshops'], 
ARRAY['6 nights accommodation', 'Daily breakfast', 'Cultural tours', 'Music workshops'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Dakar Arrival", "description": "Westernmost point of Africa", "activities": ["Airport transfer", "Independence Monument", "Sandaga Market"], "meals": ["Senegalese dinner"], "accommodation": "Dakar hotel"},
  {"day": 2, "title": "Goree Island", "description": "UNESCO heritage site", "activities": ["Ferry to Goree", "Slave House visit", "Island tour"], "meals": ["Breakfast", "Island lunch", "Dinner"], "accommodation": "Dakar hotel"},
  {"day": 3, "title": "Saint-Louis Journey", "description": "Former colonial capital", "activities": ["Drive to Saint-Louis", "UNESCO old town", "Djoudj bird sanctuary"], "meals": ["Breakfast", "Colonial lunch", "Dinner"], "accommodation": "Saint-Louis hotel"}
]'::jsonb, 4.5, 89, false, 'November-May', '8-14 people', 'Immerse in vibrant West African music, art, and colonial history'),

('Uganda Primate Safari', 'Uganda', 'uganda', 'Africa', '8 Days / 7 Nights', '₹2,15,000', '₹2,45,000', '/places/uganda/kampala.jpg', 'Wildlife', 
ARRAY['Gorilla trekking', 'Chimpanzee tracking', 'Murchison Falls', 'Queen Elizabeth Park'], 
ARRAY['7 nights accommodation', 'All meals', 'Primate permits', 'Game drives'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Entebbe Arrival", "description": "Pearl of Africa", "activities": ["Airport transfer", "Botanical Gardens", "Lake Victoria sunset"], "meals": ["Ugandan dinner"], "accommodation": "Entebbe hotel"},
  {"day": 2, "title": "Bwindi Journey", "description": "Impenetrable forest", "activities": ["Drive to Bwindi", "Community visit", "Pre-trek briefing"], "meals": ["Breakfast", "En route lunch", "Dinner"], "accommodation": "Forest lodge"},
  {"day": 3, "title": "Gorilla Trekking", "description": "Mountain gorilla encounter", "activities": ["Gorilla tracking", "Forest walk", "Cultural performance"], "meals": ["Early breakfast", "Trail lunch", "Celebration dinner"], "accommodation": "Forest lodge"}
]'::jsonb, 4.9, 178, true, 'June-August, December-February', '4-8 people', 'Track mountain gorillas and chimpanzees in pristine African rainforests'),

('Mozambique Island Paradise', 'Mozambique', 'mozambique', 'Africa', '8 Days / 7 Nights', '₹1,95,000', '₹2,25,000', '/places/mozambique/maputo.jpg', 'Beach', 
ARRAY['Bazaruto Archipelago', 'Dhow sailing', 'Coral reefs', 'Portuguese heritage'], 
ARRAY['7 nights accommodation', 'All meals', 'Marine activities', 'Island transfers'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Maputo Arrival", "description": "Portuguese colonial charm", "activities": ["Airport transfer", "City tour", "Iron House visit"], "meals": ["Mozambican dinner"], "accommodation": "Maputo hotel"},
  {"day": 2, "title": "Bazaruto Archipelago", "description": "Island paradise", "activities": ["Flight to Vilanculos", "Dhow transfer", "Snorkeling"], "meals": ["Breakfast", "Island lunch", "Dinner"], "accommodation": "Beach resort"},
  {"day": 3, "title": "Marine Adventures", "description": "Coral reef exploration", "activities": ["Diving/snorkeling", "Dugong watching", "Sunset dhow cruise"], "meals": ["Breakfast", "Beach lunch", "Dinner"], "accommodation": "Beach resort"}
]'::jsonb, 4.7, 134, false, 'April-November', '6-12 people', 'Discover pristine beaches, vibrant coral reefs, and Portuguese colonial heritage'),

('Libya Archaeological Wonders', 'Libya', 'libya', 'Africa', '8 Days / 7 Nights', '₹2,05,000', '₹2,35,000', '/places/libya/tripoli.jpg', 'Cultural', 
ARRAY['Leptis Magna', 'Sabratha ruins', 'Ghadames oasis', 'Roman amphitheaters'], 
ARRAY['7 nights accommodation', 'All meals', 'Archaeological guides', 'Desert tours'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Tripoli Arrival", "description": "Mediterranean gateway", "activities": ["Airport transfer", "Old city medina", "Red Castle Museum"], "meals": ["Libyan dinner"], "accommodation": "Tripoli hotel"},
  {"day": 2, "title": "Leptis Magna", "description": "Roman archaeological site", "activities": ["Leptis Magna ruins", "Amphitheater", "Basilica complex"], "meals": ["Breakfast", "Site lunch", "Dinner"], "accommodation": "Tripoli hotel"},
  {"day": 3, "title": "Sabratha Journey", "description": "UNESCO World Heritage", "activities": ["Sabratha ruins", "Roman theater", "Coastal views"], "meals": ["Breakfast", "Archaeological lunch", "Dinner"], "accommodation": "Tripoli hotel"}
]'::jsonb, 4.6, 67, false, 'October-April', '8-12 people', 'Explore some of the best-preserved Roman ruins in North Africa');

-- Insert 10 new packages for Americas region
INSERT INTO packages (title, country, country_slug, region, duration, price, original_price, image, category, highlights, inclusions, exclusions, itinerary, rating, reviews, featured, best_time, group_size, overview_description) VALUES

('Mexico Ancient Civilizations', 'Mexico', 'mexico', 'Americas', '8 Days / 7 Nights', '₹1,65,000', '₹1,85,000', '/places/mexico/mexico-city.jpg', 'Cultural', 
ARRAY['Chichen Itza', 'Teotihuacan pyramids', 'Cenotes swimming', 'Mayan culture'], 
ARRAY['7 nights accommodation', 'Daily breakfast', 'Archaeological tours', 'Cultural experiences'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Mexico City Arrival", "description": "Aztec capital heritage", "activities": ["Airport transfer", "Zocalo square", "Cathedral visit"], "meals": ["Mexican dinner"], "accommodation": "Mexico City hotel"},
  {"day": 2, "title": "Teotihuacan Pyramids", "description": "City of the Gods", "activities": ["Pyramid of the Sun", "Pyramid of the Moon", "Temple of Quetzalcoatl"], "meals": ["Breakfast", "Archaeological lunch", "Dinner"], "accommodation": "Mexico City hotel"},
  {"day": 3, "title": "Cancun & Chichen Itza", "description": "Mayan wonder of the world", "activities": ["Flight to Cancun", "Chichen Itza tour", "Cenote swimming"], "meals": ["Breakfast", "Mayan lunch", "Dinner"], "accommodation": "Cancun resort"}
]'::jsonb, 4.8, 189, false, 'October-April', '8-14 people', 'Discover ancient Mayan and Aztec civilizations with stunning archaeological sites'),

('Chile Patagonia Adventure', 'Chile', 'chile', 'Americas', '10 Days / 9 Nights', '₹2,85,000', '₹3,25,000', '/places/chile/santiago.jpg', 'Adventure', 
ARRAY['Torres del Paine', 'Glacier trekking', 'Wine valleys', 'Atacama Desert'], 
ARRAY['9 nights accommodation', 'Daily breakfast', 'National park fees', 'Adventure gear'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Santiago Arrival", "description": "Andean capital", "activities": ["Airport transfer", "Cerro San Cristobal", "Wine tasting"], "meals": ["Chilean dinner"], "accommodation": "Santiago hotel"},
  {"day": 2, "title": "Torres del Paine", "description": "Patagonian wilderness", "activities": ["Flight to Punta Arenas", "Transfer to park", "Base trek"], "meals": ["Breakfast", "Trail lunch", "Dinner"], "accommodation": "Park lodge"},
  {"day": 3, "title": "Glacier Exploration", "description": "Ancient ice formations", "activities": ["Grey Glacier boat trip", "Iceberg watching", "Nature walk"], "meals": ["Breakfast", "Glacier lunch", "Dinner"], "accommodation": "Park lodge"}
]'::jsonb, 4.9, 145, true, 'October-March', '6-12 people', 'Experience dramatic Patagonian landscapes and pristine wilderness adventures'),

('Colombia Coffee & Culture', 'Colombia', 'colombia', 'Americas', '7 Days / 6 Nights', '₹1,35,000', '₹1,55,000', '/places/colombia/bogota.jpg', 'Cultural', 
ARRAY['Coffee triangle', 'Cartagena colonial', 'Salsa dancing', 'Emerald museums'], 
ARRAY['6 nights accommodation', 'Daily breakfast', 'Coffee tours', 'Cultural activities'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Bogota Arrival", "description": "High altitude capital", "activities": ["Airport transfer", "Gold Museum", "La Candelaria district"], "meals": ["Colombian dinner"], "accommodation": "Bogota hotel"},
  {"day": 2, "title": "Coffee Region", "description": "World heritage landscape", "activities": ["Flight to Armenia", "Coffee farm visit", "Traditional lunch"], "meals": ["Breakfast", "Farm lunch", "Dinner"], "accommodation": "Coffee hacienda"},
  {"day": 3, "title": "Cartagena Journey", "description": "Caribbean colonial gem", "activities": ["Flight to Cartagena", "Walled city tour", "Sunset walls walk"], "meals": ["Breakfast", "Caribbean lunch", "Dinner"], "accommodation": "Colonial hotel"}
]'::jsonb, 4.7, 167, false, 'December-March, July-August', '8-14 people', 'Experience vibrant culture, world-class coffee, and stunning colonial architecture'),

('Ecuador Galapagos Discovery', 'Ecuador', 'ecuador', 'Americas', '9 Days / 8 Nights', '₹3,45,000', '₹3,85,000', '/places/ecuador/quito.jpg', 'Wildlife', 
ARRAY['Galapagos wildlife', 'Giant tortoises', 'Snorkeling', 'Darwin research'], 
ARRAY['8 nights accommodation', 'All meals', 'Galapagos cruise', 'National park fees'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Quito Arrival", "description": "Equatorial capital", "activities": ["Airport transfer", "Old town UNESCO site", "Equator monument"], "meals": ["Ecuadorian dinner"], "accommodation": "Quito hotel"},
  {"day": 2, "title": "Galapagos Journey", "description": "Enchanted islands", "activities": ["Flight to Galapagos", "Santa Cruz arrival", "Tortoise reserve"], "meals": ["Breakfast", "Island lunch", "Dinner"], "accommodation": "Island hotel"},
  {"day": 3, "title": "Island Hopping", "description": "Unique wildlife", "activities": ["Boat to Isabela", "Marine iguana watching", "Snorkeling"], "meals": ["Breakfast", "Boat lunch", "Dinner"], "accommodation": "Island hotel"}
]'::jsonb, 4.9, 234, true, 'June-August, December-May', '4-12 people', 'Witness unique evolution and endemic wildlife in Darwins living laboratory'),

('Costa Rica Eco Adventure', 'Costa Rica', 'costa-rica', 'Americas', '8 Days / 7 Nights', '₹1,75,000', '₹2,05,000', '/places/costa-rica/san-jose.jpg', 'Adventure', 
ARRAY['Cloud forests', 'Volcano hiking', 'Wildlife spotting', 'Zip-lining'], 
ARRAY['7 nights accommodation', 'Daily breakfast', 'Adventure activities', 'National park fees'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "San Jose Arrival", "description": "Central American gem", "activities": ["Airport transfer", "City tour", "National Theater"], "meals": ["Costa Rican dinner"], "accommodation": "San Jose hotel"},
  {"day": 2, "title": "Monteverde Cloud Forest", "description": "Mystical ecosystem", "activities": ["Drive to Monteverde", "Canopy walk", "Night wildlife tour"], "meals": ["Breakfast", "Forest lunch", "Dinner"], "accommodation": "Mountain lodge"},
  {"day": 3, "title": "Arenal Volcano", "description": "Active volcano adventure", "activities": ["Transfer to Arenal", "Volcano hike", "Hot springs"], "meals": ["Breakfast", "Adventure lunch", "Dinner"], "accommodation": "Volcano lodge"}
]'::jsonb, 4.8, 178, false, 'December-April', '6-14 people', 'Experience incredible biodiversity and thrilling eco-adventures in pristine rainforests'),

('Jamaica Reggae & Beaches', 'Jamaica', 'jamaica', 'Americas', '6 Days / 5 Nights', '₹1,25,000', '₹1,45,000', '/places/jamaica/kingston.jpg', 'Beach', 
ARRAY['Bob Marley museum', 'Blue Mountain coffee', 'Reggae music', 'Seven Mile Beach'], 
ARRAY['5 nights accommodation', 'Daily breakfast', 'Music tours', 'Beach activities'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Kingston Arrival", "description": "Reggae capital", "activities": ["Airport transfer", "Bob Marley Museum", "Trench Town tour"], "meals": ["Jamaican dinner"], "accommodation": "Kingston hotel"},
  {"day": 2, "title": "Blue Mountains", "description": "Coffee paradise", "activities": ["Blue Mountain drive", "Coffee plantation", "Waterfall visit"], "meals": ["Breakfast", "Mountain lunch", "Dinner"], "accommodation": "Mountain lodge"},
  {"day": 3, "title": "Negril Beach", "description": "Seven Mile Beach paradise", "activities": ["Transfer to Negril", "Beach relaxation", "Sunset cliff jumping"], "meals": ["Breakfast", "Beach lunch", "Dinner"], "accommodation": "Beach resort"}
]'::jsonb, 4.6, 156, false, 'November-April', '8-14 people', 'Feel the rhythm of reggae culture and relax on world-famous Caribbean beaches'),

('Guatemala Mayan Heritage', 'Guatemala', 'guatemala', 'Americas', '7 Days / 6 Nights', '₹1,45,000', '₹1,65,000', '/places/guatemala/guatemala-city.jpg', 'Cultural', 
ARRAY['Tikal pyramids', 'Lake Atitlan', 'Mayan culture', 'Colonial Antigua'], 
ARRAY['6 nights accommodation', 'Daily breakfast', 'Archaeological tours', 'Cultural experiences'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Guatemala City Arrival", "description": "Central American culture", "activities": ["Airport transfer", "National Palace", "Cathedral tour"], "meals": ["Guatemalan dinner"], "accommodation": "Guatemala City hotel"},
  {"day": 2, "title": "Antigua Colonial", "description": "UNESCO World Heritage", "activities": ["Drive to Antigua", "Colonial architecture", "Jade museum"], "meals": ["Breakfast", "Colonial lunch", "Dinner"], "accommodation": "Antigua hotel"},
  {"day": 3, "title": "Lake Atitlan", "description": "Most beautiful lake", "activities": ["Boat to Lake Atitlan", "Mayan villages", "Volcano views"], "meals": ["Breakfast", "Lake lunch", "Dinner"], "accommodation": "Lake hotel"}
]'::jsonb, 4.7, 123, false, 'November-April', '8-12 people', 'Explore ancient Mayan civilization and stunning volcanic landscapes'),

('Bolivia Salt Flats Wonder', 'Bolivia', 'bolivia', 'Americas', '8 Days / 7 Nights', '₹1,85,000', '₹2,15,000', '/places/bolivia/la-paz.jpg', 'Adventure', 
ARRAY['Salar de Uyuni', 'Flamingo reserves', 'High altitude lakes', 'Moon Valley'], 
ARRAY['7 nights accommodation', 'All meals', 'Salt flats tour', '4WD vehicles'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "La Paz Arrival", "description": "Highest capital", "activities": ["Airport transfer", "Witch market", "Moon Valley tour"], "meals": ["Bolivian dinner"], "accommodation": "La Paz hotel"},
  {"day": 2, "title": "Uyuni Journey", "description": "Salt flats adventure", "activities": ["Flight to Uyuni", "Salt flats tour", "Sunset photography"], "meals": ["Breakfast", "Salt lunch", "Dinner"], "accommodation": "Salt hotel"},
  {"day": 3, "title": "Colored Lakes", "description": "High altitude wonders", "activities": ["Eduardo Avaroa Reserve", "Flamingo watching", "Geysers"], "meals": ["Breakfast", "Desert lunch", "Dinner"], "accommodation": "Desert lodge"}
]'::jsonb, 4.8, 189, true, 'May-October', '6-12 people', 'Experience the otherworldly beauty of the worlds largest salt flats'),

('Uruguay Tango & Beaches', 'Uruguay', 'uruguay', 'Americas', '6 Days / 5 Nights', '₹1,15,000', '₹1,35,000', '/places/uruguay/montevideo.jpg', 'Cultural', 
ARRAY['Montevideo old city', 'Punta del Este', 'Tango shows', 'Wine tasting'], 
ARRAY['5 nights accommodation', 'Daily breakfast', 'City tours', 'Cultural shows'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Montevideo Arrival", "description": "River Plate culture", "activities": ["Airport transfer", "Old city walk", "Port market"], "meals": ["Uruguayan dinner"], "accommodation": "Montevideo hotel"},
  {"day": 2, "title": "Punta del Este", "description": "South American St. Tropez", "activities": ["Drive to Punta del Este", "La Mano sculpture", "Beach time"], "meals": ["Breakfast", "Coastal lunch", "Dinner"], "accommodation": "Beach resort"},
  {"day": 3, "title": "Colonia del Sacramento", "description": "Portuguese colonial", "activities": ["Historic quarter", "Lighthouse climb", "Cobblestone streets"], "meals": ["Breakfast", "Colonial lunch", "Dinner"], "accommodation": "Historic hotel"}
]'::jsonb, 4.5, 98, false, 'October-March', '8-12 people', 'Discover sophisticated South American culture and pristine Atlantic beaches'),

('Venezuela Angel Falls', 'Venezuela', 'venezuela', 'Americas', '8 Days / 7 Nights', '₹2,25,000', '₹2,55,000', '/places/venezuela/caracas.jpg', 'Adventure', 
ARRAY['Angel Falls', 'Canaima National Park', 'Tepui mountains', 'Indigenous culture'], 
ARRAY['7 nights accommodation', 'All meals', 'Park flights', 'Adventure guides'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Caracas Arrival", "description": "Bolivarian capital", "activities": ["Airport transfer", "City overview", "Bolivar Square"], "meals": ["Venezuelan dinner"], "accommodation": "Caracas hotel"},
  {"day": 2, "title": "Canaima Journey", "description": "Lost world begins", "activities": ["Flight to Canaima", "Lagoon visit", "Indigenous village"], "meals": ["Breakfast", "Jungle lunch", "Dinner"], "accommodation": "Jungle camp"},
  {"day": 3, "title": "Angel Falls Expedition", "description": "Worlds highest waterfall", "activities": ["Boat to Angel Falls", "Waterfall base", "Photography"], "meals": ["Breakfast", "Waterfall lunch", "Dinner"], "accommodation": "Jungle camp"}
]'::jsonb, 4.9, 156, true, 'December-April', '4-10 people', 'Witness the worlds highest waterfall in pristine Venezuelan wilderness');

-- Insert 10 new packages for Pacific Islands region
INSERT INTO packages (title, country, country_slug, region, duration, price, original_price, image, category, highlights, inclusions, exclusions, itinerary, rating, reviews, featured, best_time, group_size, overview_description) VALUES

('Fiji Island Paradise', 'Fiji', 'fiji', 'Pacific Islands', '7 Days / 6 Nights', '₹2,15,000', '₹2,45,000', '/places/fiji/suva.jpg', 'Beach', 
ARRAY['Crystal clear lagoons', 'Coral reefs', 'Traditional bure stays', 'Kava ceremonies'], 
ARRAY['6 nights accommodation', 'All meals', 'Island transfers', 'Cultural activities'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Nadi Arrival", "description": "Bula! Welcome to Fiji", "activities": ["Airport transfer", "Garden of Sleeping Giant", "Traditional welcome"], "meals": ["Fijian dinner"], "accommodation": "Nadi resort"},
  {"day": 2, "title": "Mamanuca Islands", "description": "Tropical paradise", "activities": ["Island hopping", "Snorkeling", "Beach relaxation"], "meals": ["Breakfast", "Island lunch", "Dinner"], "accommodation": "Island resort"},
  {"day": 3, "title": "Coral Coast", "description": "Cultural immersion", "activities": ["Village visit", "Kava ceremony", "Traditional crafts"], "meals": ["Breakfast", "Village lunch", "Dinner"], "accommodation": "Coastal resort"}
]'::jsonb, 4.8, 189, false, 'May-October', '8-16 people', 'Experience authentic Fijian hospitality and pristine tropical islands'),

('Tahiti French Polynesia', 'French Polynesia', 'french-polynesia', 'Pacific Islands', '8 Days / 7 Nights', '₹3,25,000', '₹3,65,000', '/places/tahiti/papeete.jpg', 'Beach', 
ARRAY['Overwater bungalows', 'Black pearl farms', 'Volcanic mountains', 'Polynesian culture'], 
ARRAY['7 nights accommodation', 'Daily breakfast', 'Island transfers', 'Cultural tours'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Tahiti Arrival", "description": "Queen of the Pacific", "activities": ["Airport transfer", "Papeete market", "Venus Point"], "meals": ["Polynesian dinner"], "accommodation": "Tahiti hotel"},
  {"day": 2, "title": "Moorea Island", "description": "Heart-shaped island", "activities": ["Ferry to Moorea", "Snorkeling tour", "Pineapple plantation"], "meals": ["Breakfast", "Island lunch", "Dinner"], "accommodation": "Moorea resort"},
  {"day": 3, "title": "Bora Bora Journey", "description": "Most beautiful island", "activities": ["Flight to Bora Bora", "Lagoon tour", "Mount Otemanu"], "meals": ["Breakfast", "Lagoon lunch", "Dinner"], "accommodation": "Overwater bungalow"}
]'::jsonb, 4.9, 234, true, 'May-October', '6-12 people', 'Discover the ultimate tropical paradise with luxury overwater accommodations'),

('Hawaii Volcanic Wonders', 'Hawaii', 'hawaii', 'Pacific Islands', '8 Days / 7 Nights', '₹2,85,000', '₹3,25,000', '/places/hawaii/honolulu.jpg', 'Adventure', 
ARRAY['Active volcanoes', 'Pearl Harbor', 'Luau culture', 'Road to Hana'], 
ARRAY['7 nights accommodation', 'Daily breakfast', 'Island tours', 'Cultural experiences'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Honolulu Arrival", "description": "Aloha spirit begins", "activities": ["Airport transfer", "Waikiki Beach", "Diamond Head sunset"], "meals": ["Hawaiian dinner"], "accommodation": "Waikiki hotel"},
  {"day": 2, "title": "Pearl Harbor", "description": "Historical significance", "activities": ["Pearl Harbor tour", "USS Arizona", "Downtown Honolulu"], "meals": ["Breakfast", "Memorial lunch", "Dinner"], "accommodation": "Waikiki hotel"},
  {"day": 3, "title": "Big Island Journey", "description": "Volcanic landscapes", "activities": ["Flight to Big Island", "Volcanoes National Park", "Lava viewing"], "meals": ["Breakfast", "Volcanic lunch", "Dinner"], "accommodation": "Volcano lodge"}
]'::jsonb, 4.8, 178, false, 'April-May, September-November', '8-14 people', 'Experience active volcanoes, rich culture, and diverse Hawaiian landscapes'),

('Samoa Traditional Culture', 'Samoa', 'samoa', 'Pacific Islands', '6 Days / 5 Nights', '₹1,75,000', '₹2,05,000', '/places/samoa/apia.jpg', 'Cultural', 
ARRAY['Traditional fale', 'Fire dancing', 'Waterfall swimming', 'Polynesian traditions'], 
ARRAY['5 nights accommodation', 'All meals', 'Cultural tours', 'Traditional ceremonies'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Apia Arrival", "description": "Heart of Polynesia", "activities": ["Airport transfer", "Robert Louis Stevenson Museum", "Market visit"], "meals": ["Samoan feast"], "accommodation": "Beach fale"},
  {"day": 2, "title": "Cultural Immersion", "description": "Traditional lifestyle", "activities": ["Village ceremony", "Coconut demonstration", "Traditional crafts"], "meals": ["Breakfast", "Village lunch", "Dinner"], "accommodation": "Beach fale"},
  {"day": 3, "title": "Natural Wonders", "description": "Paradise landscapes", "activities": ["Togitogiga Waterfall", "Lalomanu Beach", "Snorkeling"], "meals": ["Breakfast", "Beach lunch", "Dinner"], "accommodation": "Beach fale"}
]'::jsonb, 4.7, 145, false, 'May-October', '6-12 people', 'Experience authentic Polynesian culture and pristine natural beauty'),

('Tonga Kingdom Heritage', 'Tonga', 'tonga', 'Pacific Islands', '7 Days / 6 Nights', '₹1,95,000', '₹2,25,000', '/places/tonga/nukualofa.jpg', 'Cultural', 
ARRAY['Royal Palace', 'Whale watching', 'Coral gardens', 'Polynesian monarchy'], 
ARRAY['6 nights accommodation', 'Daily breakfast', 'Royal tours', 'Marine activities'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Nukualofa Arrival", "description": "Last Polynesian kingdom", "activities": ["Airport transfer", "Royal Palace tour", "Centenary Church"], "meals": ["Royal dinner"], "accommodation": "Capital hotel"},
  {"day": 2, "title": "Whale Watching", "description": "Humpback whale season", "activities": ["Whale watching tour", "Swimming with whales", "Marine sanctuary"], "meals": ["Breakfast", "Boat lunch", "Dinner"], "accommodation": "Capital hotel"},
  {"day": 3, "title": "Vavau Islands", "description": "Sailing paradise", "activities": ["Flight to Vavau", "Island hopping", "Coral gardens"], "meals": ["Breakfast", "Island lunch", "Dinner"], "accommodation": "Island resort"}
]'::jsonb, 4.6, 98, false, 'July-November', '6-10 people', 'Discover the only remaining Polynesian kingdom and incredible whale encounters'),

('Palau Diving Paradise', 'Palau', 'palau', 'Pacific Islands', '7 Days / 6 Nights', '₹2,75,000', '₹3,15,000', '/places/palau/koror.jpg', 'Adventure', 
ARRAY['Jellyfish Lake', 'Blue Corner diving', 'Rock Islands', 'WWII wrecks'], 
ARRAY['6 nights accommodation', 'All meals', 'Diving packages', 'Marine park fees'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Koror Arrival", "description": "Diving capital", "activities": ["Airport transfer", "Equipment fitting", "Check dive"], "meals": ["Palauan dinner"], "accommodation": "Dive resort"},
  {"day": 2, "title": "Jellyfish Lake", "description": "Unique ecosystem", "activities": ["Jellyfish Lake swim", "Rock Islands tour", "Snorkeling"], "meals": ["Breakfast", "Lake lunch", "Dinner"], "accommodation": "Dive resort"},
  {"day": 3, "title": "Blue Corner Diving", "description": "World-class dive site", "activities": ["Blue Corner dive", "Shark encounter", "Current drift"], "meals": ["Breakfast", "Boat lunch", "Dinner"], "accommodation": "Dive resort"}
]'::jsonb, 4.9, 167, true, 'November-May', '4-10 people', 'Experience world-class diving and unique marine ecosystems'),

('Vanuatu Adventure Culture', 'Vanuatu', 'vanuatu', 'Pacific Islands', '6 Days / 5 Nights', '₹1,85,000', '₹2,15,000', '/places/vanuatu/port-vila.jpg', 'Adventure', 
ARRAY['Active volcanoes', 'Bungee jumping origin', 'Traditional tribes', 'Blue holes'], 
ARRAY['5 nights accommodation', 'Daily breakfast', 'Adventure tours', 'Cultural visits'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Port Vila Arrival", "description": "Melanesian culture", "activities": ["Airport transfer", "Local market", "Cultural center"], "meals": ["Vanuatu dinner"], "accommodation": "Port Vila hotel"},
  {"day": 2, "title": "Tanna Volcano", "description": "Active volcano experience", "activities": ["Flight to Tanna", "Mount Yasur volcano", "Lava viewing"], "meals": ["Breakfast", "Volcano lunch", "Dinner"], "accommodation": "Volcano lodge"},
  {"day": 3, "title": "Cultural Village", "description": "Traditional lifestyle", "activities": ["Tribal village visit", "Custom ceremonies", "Traditional dancing"], "meals": ["Breakfast", "Village lunch", "Dinner"], "accommodation": "Volcano lodge"}
]'::jsonb, 4.7, 123, false, 'April-October', '6-12 people', 'Experience active volcanoes and authentic Melanesian tribal culture'),

('New Caledonia French Pacific', 'New Caledonia', 'new-caledonia', 'Pacific Islands', '7 Days / 6 Nights', '₹2,25,000', '₹2,55,000', '/places/new-caledonia/noumea.jpg', 'Beach', 
ARRAY['Lagoon UNESCO site', 'French cuisine', 'Kanak culture', 'Coral reefs'], 
ARRAY['6 nights accommodation', 'Daily breakfast', 'Lagoon tours', 'Cultural experiences'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Noumea Arrival", "description": "French Pacific charm", "activities": ["Airport transfer", "Noumea aquarium", "French quarter"], "meals": ["French dinner"], "accommodation": "Noumea hotel"},
  {"day": 2, "title": "Lagoon Discovery", "description": "UNESCO World Heritage", "activities": ["Amédée Lighthouse", "Snorkeling", "Coral viewing"], "meals": ["Breakfast", "Lighthouse lunch", "Dinner"], "accommodation": "Noumea hotel"},
  {"day": 3, "title": "Kanak Culture", "description": "Indigenous heritage", "activities": ["Cultural center", "Traditional village", "Local crafts"], "meals": ["Breakfast", "Cultural lunch", "Dinner"], "accommodation": "Noumea hotel"}
]'::jsonb, 4.6, 134, false, 'April-November', '8-14 people', 'Combine French sophistication with Pacific island paradise'),

('Cook Islands Rarotonga', 'Cook Islands', 'cook-islands', 'Pacific Islands', '6 Days / 5 Nights', '₹1,95,000', '₹2,25,000', '/places/cook-islands/avarua.jpg', 'Beach', 
ARRAY['Lagoon tours', 'Island culture', 'Polynesian dancing', 'Coral gardens'], 
ARRAY['5 nights accommodation', 'Daily breakfast', 'Island tours', 'Cultural shows'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Rarotonga Arrival", "description": "Polynesian paradise", "activities": ["Airport transfer", "Island orientation", "Sunset cruise"], "meals": ["Island dinner"], "accommodation": "Beach resort"},
  {"day": 2, "title": "Island Circle Tour", "description": "Cultural exploration", "activities": ["Cross-island trek", "Marae sites", "Local villages"], "meals": ["Breakfast", "Village lunch", "Dinner"], "accommodation": "Beach resort"},
  {"day": 3, "title": "Aitutaki Day Trip", "description": "Most beautiful lagoon", "activities": ["Flight to Aitutaki", "Lagoon cruise", "One Foot Island"], "meals": ["Breakfast", "Lagoon lunch", "Dinner"], "accommodation": "Beach resort"}
]'::jsonb, 4.8, 156, false, 'April-November', '6-12 people', 'Discover one of the worlds most beautiful lagoons and authentic Polynesian culture'),

('Kiribati Authentic Pacific', 'Kiribati', 'kiribati', 'Pacific Islands', '8 Days / 7 Nights', '₹2,45,000', '₹2,75,000', '/places/kiribati/tarawa.jpg', 'Cultural', 
ARRAY['Atoll life', 'WWII history', 'Traditional fishing', 'Micronesian culture'], 
ARRAY['7 nights accommodation', 'All meals', 'Cultural tours', 'Historical sites'], 
ARRAY['International flights', 'Personal expenses', 'Travel insurance'], 
'[
  {"day": 1, "title": "Tarawa Arrival", "description": "Remote Pacific atoll", "activities": ["Airport transfer", "Island orientation", "Local village"], "meals": ["Local dinner"], "accommodation": "Local guesthouse"},
  {"day": 2, "title": "WWII History", "description": "Battle of Tarawa", "activities": ["Historical sites", "War memorials", "Museum visit"], "meals": ["Breakfast", "Historical lunch", "Dinner"], "accommodation": "Local guesthouse"},
  {"day": 3, "title": "Atoll Culture", "description": "Traditional lifestyle", "activities": ["Traditional fishing", "Coconut harvesting", "Local crafts"], "meals": ["Breakfast", "Traditional lunch", "Dinner"], "accommodation": "Local guesthouse"}
]'::jsonb, 4.5, 67, false, 'May-October', '4-8 people', 'Experience authentic atoll life in one of the most remote Pacific destinations');