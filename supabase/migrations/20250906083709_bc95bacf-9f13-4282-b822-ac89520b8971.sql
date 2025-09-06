-- Force complete PostgREST schema cache reload
-- Create and immediately drop a function to trigger schema cache refresh

CREATE OR REPLACE FUNCTION public.force_schema_refresh()
RETURNS void AS $$
BEGIN
    -- This function exists solely to force PostgREST schema cache refresh
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- Drop the function immediately to trigger cache reload
DROP FUNCTION public.force_schema_refresh();

-- Ensure the foreign key constraint exists and is properly named
ALTER TABLE group_tours DROP CONSTRAINT IF EXISTS group_tours_category_id_fkey;
ALTER TABLE group_tours 
ADD CONSTRAINT group_tours_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES group_tour_categories(id);

-- Force a complete schema reload by sending a NOTIFY
NOTIFY pgrst, 'reload schema';