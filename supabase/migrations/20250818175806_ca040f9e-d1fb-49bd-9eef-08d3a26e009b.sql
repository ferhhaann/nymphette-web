-- Create table for country content sections
CREATE TABLE public.country_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID NOT NULL,
  section_type TEXT NOT NULL,
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.country_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Country content is viewable by everyone" 
ON public.country_content 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage country content" 
ON public.country_content 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create table for country attractions
CREATE TABLE public.country_attractions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'attraction',
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.country_attractions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Country attractions are viewable by everyone" 
ON public.country_attractions 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage country attractions" 
ON public.country_attractions 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create table for country cities
CREATE TABLE public.country_cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  highlights TEXT[],
  image_url TEXT,
  is_capital BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.country_cities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Country cities are viewable by everyone" 
ON public.country_cities 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage country cities" 
ON public.country_cities 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Add updated_at triggers
CREATE TRIGGER update_country_content_updated_at
BEFORE UPDATE ON public.country_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_country_content_country_id ON public.country_content(country_id);
CREATE INDEX idx_country_content_section_type ON public.country_content(section_type);
CREATE INDEX idx_country_attractions_country_id ON public.country_attractions(country_id);
CREATE INDEX idx_country_cities_country_id ON public.country_cities(country_id);