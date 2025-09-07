import { Helmet } from "react-helmet-async";

interface ProductionSEOProps {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
  image?: string;
  structuredData?: object;
  noIndex?: boolean;
}

export const ProductionSEO = ({
  title,
  description,
  keywords,
  url,
  image = "/og-image.jpg",
  structuredData,
  noIndex = false
}: ProductionSEOProps) => {
  const fullTitle = title.includes("Nymphette Tours") ? title : `${title} | Nymphette Tours`;
  const fullUrl = url ? `https://nymphettetours.com${url}` : "https://nymphettetours.com";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Nymphette Tours" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Nymphette Tours" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};