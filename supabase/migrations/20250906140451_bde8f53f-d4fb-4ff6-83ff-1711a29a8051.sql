-- Update blog-images storage policies to allow public uploads temporarily
-- since authentication is not implemented yet

DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;  
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

-- Allow public uploads to blog-images bucket (temporary until auth is implemented)
CREATE POLICY "Public can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Public can update blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog-images');

CREATE POLICY "Public can delete blog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog-images');

-- Keep the existing read policy
CREATE POLICY "Public can view blog images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');