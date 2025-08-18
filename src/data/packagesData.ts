import packagesDataJson from './packagesData.json';
import regionsImage from "@/assets/regions-world.jpg";

// TypeScript interfaces for packages
export interface PackageItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}

export interface PackageOverview {
  sectionTitle: string;
  description: string;
  highlightsLabel: string;
  highlightsBadgeVariant: string;
  highlightsBadgeStyle: string;
}

export interface TravelPackage {
  id: string;
  title: string;
  country: string;
  // Canonical slug linking region packages to countryDetails (optional for legacy data)
  countrySlug?: string;
  region: string;
  duration: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: PackageItinerary[];
  category: string;
  bestTime: string;
  groupSize: string;
  overview?: PackageOverview;
}

// Load packages data from JSON and replace image paths with actual imports
export const packagesData: Record<string, TravelPackage[]> = Object.fromEntries(
  Object.entries(packagesDataJson).map(([region, packages]) => [
    region,
    packages.map(pkg => ({
      ...pkg,
      image: regionsImage // Replace JSON path with actual image import
    }))
  ])
);