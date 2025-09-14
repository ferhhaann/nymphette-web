-- Set up proper SEO settings with structured data for homepage
-- First check if homepage SEO settings exist, if not create them

INSERT INTO seo_settings (
  page_url,
  meta_title,
  meta_description,
  meta_keywords,
  canonical_url,
  og_title,
  og_description,
  og_image,
  page_type,
  structured_data,
  is_active
) VALUES (
  '/',
  'Nymphette International Tours - Premium Travel Packages & Group Tours Worldwide',
  'Discover premium travel packages, curated group tours, and custom trips to Asia, Europe, Africa & more. Expert travel planning with 24/7 support. Book your dream vacation today!',
  'travel packages, group tours, custom trips, Asia tours, Europe travel, Africa safari, vacation packages, travel agency, international tours, luxury travel, honeymoon packages',
  'https://nymphetteinternationaltours.com/',
  'Nymphette International Tours - Premium Travel Packages & Group Tours Worldwide',
  'Discover premium travel packages, curated group tours, and custom trips to Asia, Europe, Africa & more. Expert travel planning with 24/7 support.',
  'https://nymphetteinternationaltours.com/src/assets/hero-travel.jpg',
  'homepage',
  jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', 'TravelAgency',
    'name', 'Nymphette International Tours',
    'url', 'https://nymphetteinternationaltours.com/',
    'logo', 'https://nymphetteinternationaltours.com/lovable-uploads/55a5a12c-6872-4f3f-b1d6-da7e436ed8f1.png',
    'description', 'Premium travel agency offering curated packages, group tours, and custom trips to destinations worldwide including Asia, Europe, Africa, Americas, Pacific Islands, and Middle East.',
    'telephone', '+1-800-NYMPHETTE',
    'email', 'info@nymphetteinternationaltours.com',
    'address', jsonb_build_object(
      '@type', 'PostalAddress',
      'addressCountry', 'Global'
    ),
    'sameAs', jsonb_build_array(
      'https://facebook.com/nymphetteinternationaltours',
      'https://instagram.com/nymphetteinternationaltours',
      'https://twitter.com/nymphetteinternationaltours'
    ),
    'areaServed', jsonb_build_array('Asia', 'Europe', 'Africa', 'Americas', 'Pacific Islands', 'Middle East'),
    'serviceType', jsonb_build_array('Travel Packages', 'Group Tours', 'Custom Trips', 'Luxury Travel', 'Adventure Tours'),
    'priceRange', '₹25,000 - ₹150,000',
    'aggregateRating', jsonb_build_object(
      '@type', 'AggregateRating',
      'ratingValue', '4.8',
      'reviewCount', '1250'
    )
  ),
  true
) ON CONFLICT (page_url) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  canonical_url = EXCLUDED.canonical_url,
  og_title = EXCLUDED.og_title,
  og_description = EXCLUDED.og_description,
  og_image = EXCLUDED.og_image,
  structured_data = EXCLUDED.structured_data,
  updated_at = now();