-- Update country_attractions table to support different categories
ALTER TABLE country_attractions 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'attraction';

-- Add comment for clarity
COMMENT ON COLUMN country_attractions.type IS 'Type of attraction: most_visited, most_attractive, etc.';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_country_attractions_type_country ON country_attractions(country_id, type);
CREATE INDEX IF NOT EXISTS idx_country_attractions_order ON country_attractions(country_id, type, order_index);