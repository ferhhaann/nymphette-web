export interface UnifiedCountryData {
  details?: Record<string, any> | undefined;
  packages: import("@/data/packagesData").TravelPackage[];
}

export interface UnifiedRegionData {
  countries: Record<string, UnifiedCountryData>;
}

export type RegionKey =
  | "asia"
  | "europe"
  | "africa"
  | "americas"
  | "middle-east"
  | "pacific-islands";
