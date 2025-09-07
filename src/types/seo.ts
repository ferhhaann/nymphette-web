export type PageType = 'homepage' | 'packages' | 'blog' | 'about' | 'contact' | 'group-tours' | 'custom';

export interface SEOSettings {
  id?: string;
  page_url: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  structured_data?: any;
  robots_meta?: string;
  page_type: PageType;
  is_active: boolean;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  openGraph: {
    type: string;
    locale: string;
    url: string;
    siteName: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter: {
    handle: string;
    site: string;
    cardType: string;
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}
