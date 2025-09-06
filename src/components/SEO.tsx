import { FC, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { defaultSEO, routeSEO } from '@/config/seo.config';
import { supabase } from '@/integrations/supabase/client';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  structuredData?: any;
}

export const SEO: FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogImage,
  noindex,
  structuredData
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const routeSeoData = routeSEO[currentPath as keyof typeof routeSEO];

  useEffect(() => {
    const fetchSEOSettings = async () => {
      try {
        const { data: seoSettings } = await supabase
          .from('seo_settings')
          .select('*')
          .eq('page_url', currentPath)
          .eq('is_active', true)
          .single();

        if (seoSettings) {
          // Update meta tags dynamically if needed
          const metaTags = document.head.getElementsByTagName('meta');
          for (let i = 0; i < metaTags.length; i++) {
            const tag = metaTags[i];
            if (tag.getAttribute('property') === 'og:title') {
              tag.setAttribute('content', seoSettings.og_title || seoSettings.meta_title);
            }
            if (tag.getAttribute('property') === 'og:description') {
              tag.setAttribute('content', seoSettings.og_description || seoSettings.meta_description);
            }
            if (tag.getAttribute('property') === 'og:image') {
              tag.setAttribute('content', seoSettings.og_image || defaultSEO.openGraph.images[0].url);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching SEO settings:', error);
      }
    };

    fetchSEOSettings();
  }, [currentPath]);

  const finalTitle = title || routeSeoData?.title || defaultSEO.title;
  const finalDescription = description || routeSeoData?.description || defaultSEO.description;
  const finalCanonical = canonical || `${defaultSEO.canonical}${currentPath}`;
  const finalOgImage = ogImage || defaultSEO.openGraph.images[0].url;
  const finalStructuredData = structuredData || routeSeoData?.schema;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={defaultSEO.openGraph.type} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:site_name" content={defaultSEO.openGraph.siteName} />
      <meta property="og:locale" content={defaultSEO.openGraph.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content={defaultSEO.twitter.cardType} />
      <meta name="twitter:site" content={defaultSEO.twitter.site} />
      <meta name="twitter:creator" content={defaultSEO.twitter.handle} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* Structured Data */}
      {finalStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
        </script>
      )}
    </Helmet>
  );
};
