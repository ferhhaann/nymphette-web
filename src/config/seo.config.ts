import type { SEOConfig } from '@/types/seo';

export const defaultSEO: SEOConfig = {
  title: 'Premium Travel Packages & Group Tours | Nymphette Tours',
  description: 'Explore premium travel packages across Asia, Europe, Africa & more. Expert-guided group tours, custom trips, authentic experiences. 50+ destinations worldwide.',
  keywords: 'travel packages, group tours, custom trips, vacation packages, travel agency, international tours',
  canonical: 'https://nymphettetours.lovable.app',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nymphettetours.lovable.app',
    siteName: 'Nymphette Tours',
    images: [
      {
        url: '/src/assets/hero-travel.jpg',
        width: 1200,
        height: 630,
        alt: 'Nymphette Tours - Premium Travel Experiences',
      },
    ],
  },
  twitter: {
    handle: '@nymphettetours',
    site: '@nymphettetours',
    cardType: 'summary_large_image',
  },
};

export const routeSEO = {
  '/': {
    title: 'Premium Travel Packages & Group Tours | Nymphette Tours',
    description: 'Explore premium travel packages across Asia, Europe, Africa & more. Expert-guided group tours, custom trips, authentic experiences. 50+ destinations worldwide.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: 'Nymphette Tours',
      description: 'Premium travel agency specializing in curated packages and group tours.',
      url: 'https://nymphettetours.com',
      areaServed: ['Asia', 'Europe', 'Africa', 'Americas', 'Pacific Islands', 'Middle East'],
      openingHours: 'Mo-Su 00:00-24:00',
      hasMap: 'https://nymphettetours.com/contact',
      telephone: '+1-800-TRAVEL',
      email: 'info@nymphettetours.com'
    }
  },
  '/packages': {
    title: 'Travel Packages - Curated Tours & Custom Trips | Nymphette Tours',
    description: 'Explore our handpicked travel packages across Asia, Europe, Africa & more. Customizable itineraries, expert guides, and unforgettable experiences.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Travel Packages',
      description: 'Browse our collection of premium travel packages and tours.',
      url: 'https://nymphettetours.com/packages'
    }
  },
  '/group-tours': {
    title: 'Group Tours - Join Like-Minded Travelers | Nymphette Tours',
    description: 'Join our expertly guided group tours. Small groups, authentic experiences, and hassle-free travel across the world\'s most exciting destinations.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Group Tours',
      description: 'Join our expertly guided group tours for authentic travel experiences.',
      url: 'https://nymphettetours.com/group-tours'
    }
  },
  '/about': {
    title: 'About Us - Our Story & Mission | Nymphette Tours',
    description: 'Learn about Nymphette Tours\' commitment to authentic travel experiences. Meet our expert team and discover our passion for crafting unforgettable journeys.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Nymphette Tours',
      description: 'Learn about our mission and commitment to authentic travel experiences.',
      url: 'https://nymphettetours.com/about'
    }
  },
  '/contact': {
    title: 'Contact Us - Get in Touch | Nymphette Tours',
    description: 'Contact Nymphette Tours for personalized travel planning. Available 24/7 to help you plan your perfect trip.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Nymphette Tours',
      description: 'Get in touch with our travel experts.',
      url: 'https://nymphettetours.com/contact'
    }
  }
};
