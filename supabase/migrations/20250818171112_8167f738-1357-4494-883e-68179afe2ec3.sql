-- Update the Japan package with missing data
UPDATE packages 
SET 
  country_slug = 'japan',
  overview_section_title = 'Overview',
  overview_description = 'Immerse yourself in Japan''s fascinating contrast of ancient traditions and modern innovation. From bustling Tokyo to serene temples, discover the heart of the Land of the Rising Sun.',
  overview_highlights_label = 'Package Highlights',
  overview_badge_variant = 'outline',
  overview_badge_style = 'border-primary text-primary',
  itinerary = '[
    {
      "day": 1,
      "title": "Arrival in Tokyo",
      "description": "Welcome to Japan! Experience the bustling capital city.",
      "activities": ["Narita Airport arrival", "Tokyo station transfer", "Shibuya crossing"],
      "meals": ["Welcome dinner"],
      "accommodation": "Modern hotel in Shinjuku"
    },
    {
      "day": 2,
      "title": "Tokyo Exploration",
      "description": "Discover Tokyo''s iconic landmarks and neighborhoods.",
      "activities": ["Tokyo Skytree visit", "Senso-ji Temple", "Asakusa district", "Shibuya crossing"],
      "meals": ["Breakfast"],
      "accommodation": "Modern hotel in Shinjuku"
    },
    {
      "day": 3,
      "title": "Mount Fuji Day Trip",
      "description": "Experience the majestic Mount Fuji and surrounding lakes.",
      "activities": ["Mount Fuji 5th Station", "Lake Kawaguchi", "Hakone hot springs"],
      "meals": ["Breakfast", "Lunch"],
      "accommodation": "Modern hotel in Shinjuku"
    },
    {
      "day": 4,
      "title": "Tokyo to Kyoto",
      "description": "Travel to the ancient capital by bullet train.",
      "activities": ["Shinkansen bullet train", "Kyoto arrival", "Gion district walk"],
      "meals": ["Breakfast"],
      "accommodation": "Traditional ryokan in Kyoto"
    },
    {
      "day": 5,
      "title": "Kyoto Temple Tour",
      "description": "Explore Kyoto''s most beautiful temples and gardens.",
      "activities": ["Golden Pavilion (Kinkaku-ji)", "Bamboo Grove", "Fushimi Inari Shrine"],
      "meals": ["Breakfast"],
      "accommodation": "Traditional ryokan in Kyoto"
    },
    {
      "day": 6,
      "title": "Arashiyama & Cultural Experience",
      "description": "Immerse in traditional Japanese culture.",
      "activities": ["Arashiyama Bamboo Grove", "Tea ceremony", "Kimono experience"],
      "meals": ["Breakfast", "Traditional lunch"],
      "accommodation": "Traditional ryokan in Kyoto"
    },
    {
      "day": 7,
      "title": "Nara Day Trip",
      "description": "Visit the ancient capital and friendly deer park.",
      "activities": ["Todai-ji Temple", "Nara Park", "Deer feeding", "Kasuga Taisha Shrine"],
      "meals": ["Breakfast"],
      "accommodation": "Traditional ryokan in Kyoto"
    },
    {
      "day": 8,
      "title": "Return to Tokyo",
      "description": "Final day in Tokyo for shopping and last-minute sightseeing.",
      "activities": ["Return to Tokyo", "Free time in Harajuku", "Last-minute shopping"],
      "meals": ["Breakfast"],
      "accommodation": "Modern hotel in Tokyo"
    },
    {
      "day": 9,
      "title": "Departure",
      "description": "Check out and transfer to airport for departure.",
      "activities": ["Hotel check-out", "Airport transfer", "Departure"],
      "meals": ["Breakfast"]
    }
  ]'::jsonb
WHERE id = '90609f5e-4979-4500-9d12-5b35b30c78d8';

-- Update other packages with missing country_slug data
UPDATE packages SET country_slug = 'thailand' WHERE country = 'Thailand' AND country_slug IS NULL;
UPDATE packages SET country_slug = 'indonesia' WHERE country = 'Indonesia' AND country_slug IS NULL;
UPDATE packages SET country_slug = 'france-switzerland' WHERE country = 'France & Switzerland' AND country_slug IS NULL;
UPDATE packages SET country_slug = 'italy' WHERE country = 'Italy' AND country_slug IS NULL;
UPDATE packages SET country_slug = 'usa' WHERE country = 'USA' AND country_slug IS NULL;
UPDATE packages SET country_slug = 'uae' WHERE country = 'UAE' AND country_slug IS NULL;
UPDATE packages SET country_slug = 'kenya' WHERE country = 'Kenya' AND country_slug IS NULL;
UPDATE packages SET country_slug = 'maldives' WHERE country = 'Maldives' AND country_slug IS NULL;

-- Add overview data to other packages that are missing it
UPDATE packages 
SET 
  overview_section_title = 'Overview',
  overview_highlights_label = 'Package Highlights',
  overview_badge_variant = 'outline',
  overview_badge_style = 'border-primary text-primary'
WHERE overview_section_title IS NULL;