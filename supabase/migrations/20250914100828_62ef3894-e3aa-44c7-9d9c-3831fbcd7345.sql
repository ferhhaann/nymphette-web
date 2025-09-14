-- Remove all homepage content items except the 3 we want to keep
DELETE FROM content 
WHERE section = 'homepage' 
AND key NOT IN ('hero_title', 'promo_description', 'journey_description');

-- Ensure the journey_description exists with default value if not present
INSERT INTO content (section, key, value)
SELECT 'homepage', 'journey_description', '"Contact us today and let our expert travel consultants help you plan the perfect trip tailored to your preferences and budget."'
WHERE NOT EXISTS (
    SELECT 1 FROM content 
    WHERE section = 'homepage' 
    AND key = 'journey_description'
);