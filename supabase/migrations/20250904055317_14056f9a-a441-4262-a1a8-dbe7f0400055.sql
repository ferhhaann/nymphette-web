-- Add country_id foreign key to packages table
ALTER TABLE packages ADD COLUMN country_id UUID;

-- Add foreign key constraint to ensure packages can only exist if country exists
ALTER TABLE packages ADD CONSTRAINT fk_packages_country_id 
  FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE;

-- Create index for better performance on country_id lookups
CREATE INDEX idx_packages_country_id ON packages(country_id);

-- Update existing packages to link them to countries based on country_slug
UPDATE packages 
SET country_id = countries.id 
FROM countries 
WHERE packages.country_slug = countries.slug;

-- For packages without country_slug, try to match by country name
UPDATE packages 
SET country_id = countries.id 
FROM countries 
WHERE packages.country_id IS NULL 
  AND LOWER(packages.country) = LOWER(countries.name);

-- Remove packages that don't have a matching country
DELETE FROM packages WHERE country_id IS NULL;