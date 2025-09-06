-- Create RLS policies for group tour images bucket (skip if exists)
DO $$ 
BEGIN
  -- Check if policies exist before creating them
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public can view group tour images'
  ) THEN
    CREATE POLICY "Public can view group tour images" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'group-tour-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload group tour images'
  ) THEN
    CREATE POLICY "Authenticated users can upload group tour images" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (bucket_id = 'group-tour-images' AND auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update group tour images'
  ) THEN
    CREATE POLICY "Authenticated users can update group tour images" 
    ON storage.objects 
    FOR UPDATE 
    USING (bucket_id = 'group-tour-images' AND auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete group tour images'
  ) THEN
    CREATE POLICY "Authenticated users can delete group tour images" 
    ON storage.objects 
    FOR DELETE 
    USING (bucket_id = 'group-tour-images' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- Function to get public URL for group tour images
CREATE OR REPLACE FUNCTION public.get_group_tour_image_url(image_path TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF image_path IS NULL OR image_path = '' THEN
    RETURN '/placeholder.svg';
  END IF;
  
  -- If it's already a full URL, return as is
  IF image_path LIKE 'http%' THEN
    RETURN image_path;
  END IF;
  
  -- If it starts with /places/, it's a static asset
  IF image_path LIKE '/places/%' THEN
    RETURN image_path;
  END IF;
  
  -- Otherwise, construct Supabase storage URL
  RETURN 'https://duouhbzwivonyssvtiqo.supabase.co/storage/v1/object/public/group-tour-images/' || image_path;
END;
$$;