-- Remove duplicate United Arab Emirates entry (keep the Middle East one)
DELETE FROM countries 
WHERE name = 'United Arab Emirates' AND region = 'Asia' AND slug = 'united_arab_emirates';