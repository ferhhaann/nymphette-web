// Countries data organized by region
export interface Country {
  id: string
  name: string
  slug: string
  region: string
  capital?: string
  currency?: string
  climate?: string
  best_season?: string
  languages?: string[]
  description?: string
  is_popular?: boolean
}

// Asia Countries
export const asiaCountries: Country[] = [
  {
    id: 'japan',
    name: 'Japan',
    slug: 'japan',
    region: 'Asia',
    capital: 'Tokyo',
    currency: 'Japanese Yen (¥)',
    climate: 'Temperate',
    best_season: 'March to May, September to November',
    languages: ['Japanese'],
    description: 'Experience ancient traditions meets modern innovation',
    is_popular: true
  },
  {
    id: 'thailand',
    name: 'Thailand',
    slug: 'thailand',
    region: 'Asia',
    capital: 'Bangkok',
    currency: 'Thai Baht (฿)',
    climate: 'Tropical',
    best_season: 'November to February',
    languages: ['Thai'],
    description: 'Discover stunning beaches, ancient temples, and vibrant culture',
    is_popular: true
  },
  {
    id: 'indonesia',
    name: 'Indonesia',
    slug: 'indonesia',
    region: 'Asia',
    capital: 'Jakarta',
    currency: 'Indonesian Rupiah (Rp)',
    climate: 'Tropical',
    best_season: 'April to October',
    languages: ['Indonesian'],
    description: 'Explore diverse islands and rich cultural heritage',
    is_popular: true
  },
  {
    id: 'china',
    name: 'China',
    slug: 'china',
    region: 'Asia',
    capital: 'Beijing',
    currency: 'Chinese Yuan (¥)',
    climate: 'Varied',
    best_season: 'April to May, September to October',
    languages: ['Mandarin'],
    description: 'Discover ancient civilization and modern wonders',
    is_popular: false
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    slug: 'malaysia',
    region: 'Asia',
    capital: 'Kuala Lumpur',
    currency: 'Malaysian Ringgit (RM)',
    climate: 'Tropical',
    best_season: 'March to October',
    languages: ['Malay'],
    description: 'Experience multicultural heritage and natural beauty',
    is_popular: false
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    slug: 'vietnam',
    region: 'Asia',
    capital: 'Hanoi',
    currency: 'Vietnamese Dong (₫)',
    climate: 'Tropical',
    best_season: 'February to April',
    languages: ['Vietnamese'],
    description: 'Discover stunning landscapes and rich history',
    is_popular: false
  },
  {
    id: 'singapore',
    name: 'Singapore',
    slug: 'singapore',
    region: 'Asia',
    capital: 'Singapore',
    currency: 'Singapore Dollar (S$)',
    climate: 'Tropical',
    best_season: 'February to April',
    languages: ['English', 'Malay', 'Mandarin', 'Tamil'],
    description: 'Modern city-state with diverse culture',
    is_popular: false
  },
  {
    id: 'south-korea',
    name: 'South Korea',
    slug: 'south-korea',
    region: 'Asia',
    capital: 'Seoul',
    currency: 'South Korean Won (₩)',
    climate: 'Temperate',
    best_season: 'March to May, September to November',
    languages: ['Korean'],
    description: 'Blend of ancient traditions and cutting-edge technology',
    is_popular: false
  },
  {
    id: 'philippines',
    name: 'Philippines',
    slug: 'philippines',
    region: 'Asia',
    capital: 'Manila',
    currency: 'Philippine Peso (₱)',
    climate: 'Tropical',
    best_season: 'November to April',
    languages: ['Filipino', 'English'],
    description: 'Tropical paradise with over 7,000 islands',
    is_popular: false
  },
  {
    id: 'sri-lanka',
    name: 'Sri Lanka',
    slug: 'sri-lanka',
    region: 'Asia',
    capital: 'Colombo',
    currency: 'Sri Lankan Rupee (Rs)',
    climate: 'Tropical',
    best_season: 'December to March',
    languages: ['Sinhala', 'Tamil'],
    description: 'Pearl of the Indian Ocean',
    is_popular: false
  },
  {
    id: 'nepal',
    name: 'Nepal',
    slug: 'nepal',
    region: 'Asia',
    capital: 'Kathmandu',
    currency: 'Nepalese Rupee (Rs)',
    climate: 'Varied',
    best_season: 'October to December',
    languages: ['Nepali'],
    description: 'Home of the Himalayas and rich spirituality',
    is_popular: false
  },
  {
    id: 'cambodia',
    name: 'Cambodia',
    slug: 'cambodia',
    region: 'Asia',
    capital: 'Phnom Penh',
    currency: 'Cambodian Riel (៛)',
    climate: 'Tropical',
    best_season: 'November to March',
    languages: ['Khmer'],
    description: 'Ancient temples and rich heritage',
    is_popular: false
  },
  {
    id: 'laos',
    name: 'Laos',
    slug: 'laos',
    region: 'Asia',
    capital: 'Vientiane',
    currency: 'Lao Kip (₭)',
    climate: 'Tropical',
    best_season: 'November to February',
    languages: ['Lao'],
    description: 'Landlocked gem of Southeast Asia',
    is_popular: false
  },
  {
    id: 'myanmar',
    name: 'Myanmar',
    slug: 'myanmar',
    region: 'Asia',
    capital: 'Naypyidaw',
    currency: 'Myanmar Kyat (K)',
    climate: 'Tropical',
    best_season: 'November to February',
    languages: ['Burmese'],
    description: 'Land of golden pagodas',
    is_popular: false
  },
  {
    id: 'taiwan',
    name: 'Taiwan',
    slug: 'taiwan',
    region: 'Asia',
    capital: 'Taipei',
    currency: 'New Taiwan Dollar (NT$)',
    climate: 'Subtropical',
    best_season: 'March to May, September to November',
    languages: ['Mandarin'],
    description: 'Beautiful island with vibrant culture',
    is_popular: false
  },
  {
    id: 'kazakhstan',
    name: 'Kazakhstan',
    slug: 'kazakhstan',
    region: 'Asia',
    capital: 'Astana',
    currency: 'Kazakhstani Tenge (₸)',
    climate: 'Continental',
    best_season: 'May to September',
    languages: ['Kazakh', 'Russian'],
    description: 'Vast steppes and modern cities',
    is_popular: false
  }
]

// Middle East Countries
export const middleEastCountries: Country[] = [
  {
    id: 'uae',
    name: 'United Arab Emirates',
    slug: 'uae',
    region: 'Middle East',
    capital: 'Abu Dhabi',
    currency: 'UAE Dirham (AED)',
    climate: 'Desert',
    best_season: 'November to March',
    languages: ['Arabic'],
    description: 'Luxury, innovation, and Arabian heritage',
    is_popular: true
  }
]

// Pacific Islands Countries
export const pacificIslandsCountries: Country[] = [
  {
    id: 'maldives',
    name: 'Maldives',
    slug: 'maldives',
    region: 'Pacific Islands',
    capital: 'Malé',
    currency: 'Maldivian Rufiyaa (MVR)',
    climate: 'Tropical',
    best_season: 'November to April',
    languages: ['Dhivehi'],
    description: 'Tropical paradise with crystal-clear waters',
    is_popular: true
  }
]

// Africa Countries
export const africaCountries: Country[] = [
  {
    id: 'kenya',
    name: 'Kenya',
    slug: 'kenya',
    region: 'Africa',
    capital: 'Nairobi',
    currency: 'Kenyan Shilling (KSh)',
    climate: 'Tropical to Arid',
    best_season: 'June to October',
    languages: ['Swahili', 'English'],
    description: 'Wildlife safaris and diverse landscapes',
    is_popular: false
  }
]

// Americas Countries
export const americasCountries: Country[] = [
  {
    id: 'usa',
    name: 'United States',
    slug: 'usa',
    region: 'Americas',
    capital: 'Washington, D.C.',
    currency: 'US Dollar ($)',
    climate: 'Varied',
    best_season: 'April to October',
    languages: ['English'],
    description: 'Land of opportunity and diverse attractions',
    is_popular: true
  }
]

// Europe Countries
export const europeCountries: Country[] = []

// Combined countries by region
export const countriesByRegion: Record<string, Country[]> = {
  'Asia': asiaCountries,
  'Middle East': middleEastCountries,
  'Pacific Islands': pacificIslandsCountries,
  'Africa': africaCountries,
  'Americas': americasCountries,
  'Europe': europeCountries
}

// All countries combined
export const allCountries: Country[] = [
  ...asiaCountries,
  ...middleEastCountries,
  ...pacificIslandsCountries,
  ...africaCountries,
  ...americasCountries,
  ...europeCountries
]

// Helper functions
export const getCountriesByRegion = (region: string): Country[] => {
  return countriesByRegion[region] || []
}

export const getCountryBySlug = (slug: string): Country | undefined => {
  return allCountries.find(country => country.slug === slug)
}

export const getPopularCountries = (): Country[] => {
  return allCountries.filter(country => country.is_popular)
}
