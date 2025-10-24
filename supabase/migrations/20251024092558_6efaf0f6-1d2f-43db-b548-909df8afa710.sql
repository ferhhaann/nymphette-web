-- Delete all countries except UAE and Thailand
DELETE FROM countries 
WHERE slug NOT IN ('uae', 'thailand');