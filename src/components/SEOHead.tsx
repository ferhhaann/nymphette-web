import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url = "/",
  type = "website",
  structuredData
}: SEOHeadProps) => {
  useEffect(() => {
    const fetchAndUpdateSEO = async () => {
      try {
        // Get current path for SEO lookup
        const currentPath = window.location.pathname;
        
        // Fetch SEO settings from database
        const { data: seoSettings, error } = await supabase
          .from('seo_settings')
          .select('*')
          .eq('page_url', currentPath)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          console.warn('SEOHead component query error:', error);
        }

        // Use database values or fallback to props/defaults
        const finalTitle = title || seoSettings?.meta_title || "Nymphette Tours - Premium Travel Packages & Group Tours Worldwide";
        const finalDescription = description || seoSettings?.meta_description || "Discover premium travel packages, curated group tours, and custom trips worldwide. Expert travel planning with 24/7 support.";
        const finalKeywords = keywords || seoSettings?.meta_keywords || "travel packages, group tours, custom trips, vacation packages, travel agency, international tours";
        const finalImage = image || seoSettings?.og_image || "/src/assets/hero-travel.jpg";
        const finalStructuredData = structuredData || seoSettings?.structured_data;

        // Update document title
        document.title = finalTitle;
        
        // Clear existing meta tags to prevent duplicates
        const clearExistingMeta = () => {
          // Remove existing SEO-related meta tags
          const metaSelectors = [
            'meta[name="description"]',
            'meta[name="keywords"]',
            'meta[name="robots"]',
            'meta[property^="og:"]',
            'meta[name^="twitter:"]'
          ];
          
          metaSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
          });
        };

        // Update meta tags
        const updateMeta = (name: string, content: string, property = false) => {
          if (!content) return; // Skip if content is empty
          
          const meta = document.createElement('meta');
          if (property) {
            meta.setAttribute('property', name);
          } else {
            meta.setAttribute('name', name);
          }
          meta.content = content;
          document.head.appendChild(meta);
        };

        // Clear existing meta tags first
        clearExistingMeta();

        // Standard meta tags
        updateMeta('description', finalDescription);
        updateMeta('keywords', finalKeywords);
        if (seoSettings?.robots_meta) {
          updateMeta('robots', seoSettings.robots_meta);
        }
        
        // Open Graph
        updateMeta('og:title', seoSettings?.og_title || finalTitle, true);
        updateMeta('og:description', seoSettings?.og_description || finalDescription, true);
        updateMeta('og:image', finalImage, true);
        updateMeta('og:url', seoSettings?.canonical_url || url, true);
        updateMeta('og:type', type, true);
        updateMeta('og:site_name', 'Nymphette Tours', true);
        updateMeta('og:locale', 'en_US', true);
        
        // Twitter
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', seoSettings?.og_title || finalTitle);
        updateMeta('twitter:description', seoSettings?.og_description || finalDescription);
        updateMeta('twitter:image', finalImage);
        
        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.rel = 'canonical';
          document.head.appendChild(canonical);
        }
        canonical.href = seoSettings?.canonical_url || url;

        // Structured Data
        if (finalStructuredData) {
          let script = document.querySelector('script[type="application/ld+json"]#page-schema') as HTMLScriptElement;
          if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'page-schema';
            document.head.appendChild(script);
          }
          script.textContent = JSON.stringify(finalStructuredData);
        }
      } catch (error) {
        console.warn('Failed to fetch SEO settings, using defaults:', error);
        
        // Fallback to default behavior
        const finalTitle = title || "Nymphette Tours - Premium Travel Packages & Group Tours Worldwide";
        const finalDescription = description || "Discover premium travel packages, curated group tours, and custom trips worldwide. Expert travel planning with 24/7 support.";
        const finalKeywords = keywords || "travel packages, group tours, custom trips, vacation packages, travel agency, international tours";
        const finalImage = image || "/src/assets/hero-travel.jpg";

        document.title = finalTitle;
        
        const updateMeta = (name: string, content: string, property = false) => {
          const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
          let meta = document.querySelector(selector) as HTMLMetaElement;
          
          if (!meta) {
            meta = document.createElement('meta');
            if (property) {
              meta.setAttribute('property', name);
            } else {
              meta.setAttribute('name', name);
            }
            document.head.appendChild(meta);
          }
          meta.content = content;
        };

        updateMeta('description', finalDescription);
        updateMeta('keywords', finalKeywords);
        updateMeta('og:title', finalTitle, true);
        updateMeta('og:description', finalDescription, true);
        updateMeta('og:image', finalImage, true);
        updateMeta('og:url', url, true);
        updateMeta('og:type', type, true);
        updateMeta('twitter:title', finalTitle);
        updateMeta('twitter:description', finalDescription);
        updateMeta('twitter:image', finalImage);
        
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.rel = 'canonical';
          document.head.appendChild(canonical);
        }
        canonical.href = url;

        if (structuredData) {
          let script = document.querySelector('script[type="application/ld+json"]#page-schema') as HTMLScriptElement;
          if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'page-schema';
            document.head.appendChild(script);
          }
          script.textContent = JSON.stringify(structuredData);
        }
      }
    };

    fetchAndUpdateSEO();
  }, [title, description, keywords, image, url, type, structuredData]);

  return null;
};

export default SEOHead;