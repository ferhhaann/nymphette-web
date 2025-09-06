-- Create SEO settings table for managing meta tags and structured data
CREATE TABLE public.seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url TEXT NOT NULL UNIQUE,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  meta_keywords TEXT,
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  structured_data JSONB,
  robots_meta TEXT DEFAULT 'index,follow',
  page_type TEXT NOT NULL CHECK (page_type IN ('homepage', 'packages', 'blog', 'about', 'contact', 'group-tours', 'custom')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for frontend)
CREATE POLICY "Public can view active SEO settings" 
ON public.seo_settings 
FOR SELECT 
USING (is_active = true);

-- Create policies for admin management (no auth system yet, so allow all operations)
CREATE POLICY "Anyone can manage SEO settings" 
ON public.seo_settings 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_seo_settings_updated_at
BEFORE UPDATE ON public.seo_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default SEO settings for main pages
INSERT INTO public.seo_settings (page_url, meta_title, meta_description, meta_keywords, page_type, structured_data) VALUES
('/', 'Nymphette Tours - Premium Travel Packages & Group Tours Worldwide', 'Discover premium travel packages, curated group tours, and custom trips to Asia, Europe, Africa & more. Expert travel planning with 24/7 support. Book your dream vacation today!', 'travel packages, group tours, custom trips, Asia tours, Europe travel, Africa safari, vacation packages, travel agency, international tours, luxury travel', 'homepage', '{"@context": "https://schema.org", "@type": "TravelAgency", "name": "Nymphette Tours", "url": "/", "description": "Premium travel agency offering curated packages, group tours, and custom trips worldwide"}'),

('/packages', 'Travel Packages - Explore Destinations Worldwide | Nymphette Tours', 'Browse our curated travel packages across Asia, Europe, Africa, Americas, Pacific Islands, and Middle East. Find your perfect vacation with expert travel planning and 24/7 support.', 'travel packages, Asia tours, Europe travel, Africa safari, Americas vacation, Pacific Islands, Middle East tours, group tours, custom trips', 'packages', '{"@context": "https://schema.org", "@type": "WebPage", "name": "Travel Packages", "description": "Browse curated travel packages worldwide"}'),

('/group-tours', 'Group Tours - Join Fellow Travelers on Amazing Adventures | Nymphette Tours', 'Discover amazing group tours and join fellow travelers on unforgettable journeys. Small groups, expert guides, authentic experiences, and new friendships worldwide.', 'group tours, join travelers, small group travel, guided tours, travel groups, adventure tours, cultural tours, travel companions, group adventures', 'group-tours', '{"@context": "https://schema.org", "@type": "WebPage", "name": "Group Tours", "description": "Join fellow travelers on group adventures"}'),

('/blog', 'Travel Blog - Stories, Tips & Destination Guides | Nymphette Tours', 'Discover travel stories, destination guides, expert tips, and travel insights from our experienced writers. Get inspired for your next adventure with insider knowledge.', 'travel blog, travel stories, destination guides, travel tips, travel insights, travel experiences, travel inspiration, destination advice', 'blog', '{"@context": "https://schema.org", "@type": "Blog", "name": "Nymphette Tours Travel Blog", "description": "Travel stories and destination guides"}'),

('/about', 'About Nymphette Tours - Premier Travel Agency Since 1999', 'Learn about Nymphette Tours, a premier travel agency with 25+ years of experience creating unforgettable journeys worldwide. Meet our expert team and discover our story.', 'about nymphette tours, travel agency history, travel experts, founded 1999, travel team, travel company story', 'about', '{"@context": "https://schema.org", "@type": "AboutPage", "name": "About Nymphette Tours", "description": "Learn about our travel agency since 1999"}'),

('/contact', 'Contact Nymphette Tours - Get Expert Travel Assistance', 'Contact our travel experts for personalized assistance with bookings, custom packages, and travel planning. Available 24/7 for all your travel needs worldwide.', 'contact nymphette tours, travel assistance, book travel packages, custom travel planning, travel consultation, travel support', 'contact', '{"@context": "https://schema.org", "@type": "ContactPage", "name": "Contact Us", "description": "Get expert travel assistance and support"}');

-- Create indexes for better performance
CREATE INDEX idx_seo_settings_page_url ON public.seo_settings(page_url);
CREATE INDEX idx_seo_settings_page_type ON public.seo_settings(page_type);
CREATE INDEX idx_seo_settings_is_active ON public.seo_settings(is_active);