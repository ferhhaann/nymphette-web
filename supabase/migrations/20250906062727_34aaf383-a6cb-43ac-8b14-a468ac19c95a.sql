-- Force PostgREST schema cache refresh
-- This comment forces PostgREST to reload its schema cache and recognize the foreign key relationships

-- Ensure the foreign key exists (this should already be in place)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'group_tours_category_id_fkey'
    ) THEN
        ALTER TABLE group_tours 
        ADD CONSTRAINT group_tours_category_id_fkey 
        FOREIGN KEY (category_id) REFERENCES group_tour_categories(id);
    END IF;
END $$;