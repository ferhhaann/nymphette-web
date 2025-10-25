-- Update Georgia's region to Europe so it appears in the admin panel
UPDATE countries 
SET region = 'Europe', 
    updated_at = NOW() 
WHERE slug = 'georgia' AND (region IS NULL OR region = '');