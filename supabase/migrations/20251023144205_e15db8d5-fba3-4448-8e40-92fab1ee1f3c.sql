-- Fix UAE country sections to match component expectations
UPDATE country_sections 
SET content = jsonb_build_object('description', content->>'text')
WHERE country_id = (SELECT id FROM countries WHERE slug = 'united-arab-emirates')
  AND section_name = 'overview';

UPDATE country_sections 
SET content = jsonb_build_object('description', content->>'text')
WHERE country_id = (SELECT id FROM countries WHERE slug = 'united-arab-emirates')
  AND section_name = 'culture';

UPDATE country_sections 
SET content = jsonb_build_object('description', content->>'text')
WHERE country_id = (SELECT id FROM countries WHERE slug = 'united-arab-emirates')
  AND section_name = 'adventure';