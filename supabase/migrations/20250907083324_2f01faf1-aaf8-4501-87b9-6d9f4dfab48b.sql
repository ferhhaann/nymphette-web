-- Fix critical security vulnerability in seo_settings table
-- Drop the overly permissive policy that allows anyone to manage SEO settings
DROP POLICY IF EXISTS "Anyone can manage SEO settings" ON seo_settings;

-- Create secure policies for SEO settings management
-- Only authenticated users can insert SEO settings
CREATE POLICY "Authenticated users can create SEO settings" 
ON seo_settings 
FOR INSERT 
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update SEO settings
CREATE POLICY "Authenticated users can update SEO settings" 
ON seo_settings 
FOR UPDATE 
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can delete SEO settings
CREATE POLICY "Authenticated users can delete SEO settings" 
ON seo_settings 
FOR DELETE 
TO authenticated
USING (auth.role() = 'authenticated');

-- Keep the existing public read policy for active SEO settings (needed for website functionality)
-- This policy already exists: "Public can view active SEO settings"