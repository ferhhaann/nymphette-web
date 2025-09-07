import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { defaultSEO } from '@/config/seo.config';
import type { SEOSettings } from '@/types/seo';
import { generateOrganizationSchema } from '@/config/schema.config';

interface UseSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
  noIndex?: boolean;
}

export const useSEO = ({
  title: propTitle,
  description: propDescription,
  keywords: propKeywords,
  image: propImage,
  url: propUrl,
  type = 'website',
  structuredData: propStructuredData,
  noIndex
}: UseSEOProps = {}) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const updateSEO = async () => {
      try {
        setIsLoading(true);
        const currentPath = location.pathname;
        
        // Fetch SEO settings from database
        const { data: seoSettings, error: fetchError } = await supabase
          .from('seo_settings')
          .select('*')
          .eq('page_url', currentPath)
          .eq('is_active', true)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        // Determine final values with fallbacks
        const finalTitle = propTitle || seoSettings?.meta_title || defaultSEO.title;
        const finalDescription = propDescription || seoSettings?.meta_description || defaultSEO.description;
        const finalKeywords = propKeywords || seoSettings?.meta_keywords || defaultSEO.keywords;
        const finalImage = propImage || seoSettings?.og_image || defaultSEO.openGraph.images[0].url;
        const finalUrl = propUrl || seoSettings?.canonical_url || `${defaultSEO.canonical}${currentPath}`;
        const finalStructuredData = propStructuredData || seoSettings?.structured_data || generateOrganizationSchema();

        // Clear existing meta tags
        const clearExistingMeta = () => {
          const metaSelectors = [
            'meta[name="description"]',
            'meta[name="keywords"]',
            'meta[name="robots"]',
            'meta[property^="og:"]',
            'meta[name^="twitter:"]',
            'script[type="application/ld+json"]'
          ];
          
          metaSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
          });
        };

        // Update meta tags
        const updateMetaTags = () => {
          // Clear existing tags
          clearExistingMeta();

          // Set title
          document.title = finalTitle;

          // Helper function to create/update meta tags
          const updateMeta = (name: string, content: string, property = false) => {
            if (!content) return;
            const meta = document.createElement('meta');
            if (property) {
              meta.setAttribute('property', name);
            } else {
              meta.setAttribute('name', name);
            }
            meta.content = content;
            document.head.appendChild(meta);
          };

          // Standard meta tags
          updateMeta('description', finalDescription);
          updateMeta('keywords', finalKeywords);
          if (noIndex || seoSettings?.robots_meta) {
            updateMeta('robots', noIndex ? 'noindex,nofollow' : seoSettings?.robots_meta);
          }

          // Open Graph
          updateMeta('og:type', type, true);
          updateMeta('og:title', finalTitle, true);
          updateMeta('og:description', finalDescription, true);
          updateMeta('og:image', finalImage, true);
          updateMeta('og:url', finalUrl, true);
          updateMeta('og:site_name', defaultSEO.openGraph.siteName, true);
          updateMeta('og:locale', defaultSEO.openGraph.locale, true);

          // Twitter
          updateMeta('twitter:card', defaultSEO.twitter.cardType);
          updateMeta('twitter:site', defaultSEO.twitter.site);
          updateMeta('twitter:creator', defaultSEO.twitter.handle);
          updateMeta('twitter:title', finalTitle);
          updateMeta('twitter:description', finalDescription);
          updateMeta('twitter:image', finalImage);

          // Canonical URL
          let canonical = document.querySelector('link[rel="canonical"]');
          if (canonical) {
            canonical.remove();
          }
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          canonical.setAttribute('href', finalUrl);
          document.head.appendChild(canonical);

          // Structured Data
          if (finalStructuredData) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(finalStructuredData);
            document.head.appendChild(script);
          }
        };

        // Update meta tags
        updateMetaTags();

        // Social media preview refresh trick
        if (process.env.NODE_ENV === 'production' &&
            (navigator.userAgent.includes('facebookexternalhit') ||
             navigator.userAgent.includes('Twitterbot') ||
             navigator.userAgent.includes('LinkedInBot'))) {
          setTimeout(() => window.location.reload(), 100);
        }

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update SEO'));
        setIsLoading(false);
      }
    };

    updateSEO();
  }, [
    propTitle,
    propDescription,
    propKeywords,
    propImage,
    propUrl,
    type,
    propStructuredData,
    noIndex,
    location.pathname
  ]);

  return { isLoading, error };
};
