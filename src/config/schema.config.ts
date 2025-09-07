import { defaultSEO } from './seo.config';

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Nymphette Tours',
  url: defaultSEO.canonical,
  logo: defaultSEO.openGraph.images[0].url,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-XXX-XXX-XXXX',
    contactType: 'customer service',
    areaServed: 'Worldwide'
  },
  sameAs: [
    'https://facebook.com/nymphettetours',
    'https://twitter.com/nymphettetours',
    'https://instagram.com/nymphettetours'
  ]
});

export const generatePackageSchema = (tourPackage: any) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  name: tourPackage.title,
  description: tourPackage.description,
  touristType: tourPackage.targetAudience,
  image: tourPackage.images[0],
  offers: {
    '@type': 'Offer',
    price: tourPackage.price,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    validFrom: tourPackage.startDate,
    validThrough: tourPackage.endDate
  },
  itinerary: tourPackage.itinerary.map((day: any) => ({
    '@type': 'TouristDestination',
    name: day.title,
    description: day.description,
    includesAttraction: day.attractions?.map((attraction: any) => ({
      '@type': 'TouristAttraction',
      name: attraction.name,
      description: attraction.description
    }))
  }))
});

export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${defaultSEO.canonical}${item.url}`
  }))
});

export const generateArticleSchema = (article: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  image: article.image,
  author: {
    '@type': 'Person',
    name: article.author
  },
  publisher: {
    '@type': 'Organization',
    name: 'Nymphette Tours',
    logo: {
      '@type': 'ImageObject',
      url: defaultSEO.openGraph.images[0].url
    }
  },
  datePublished: article.publishDate,
  dateModified: article.modifiedDate,
  description: article.description
});
