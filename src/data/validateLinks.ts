// Development-only validator to ensure region packages link to countryDetails via canonical slugs
// This runs in the browser and only logs warnings; it has no user-facing effect.

import asiaData from "@/data/regions/asia.json";
import europeData from "@/data/regions/europe.json";
import africaData from "@/data/regions/africa.json";
import americasData from "@/data/regions/americas.json";
import middleEastData from "@/data/regions/middleEast.json";
import pacificIslandsData from "@/data/regions/pacificIslands.json";

import asiaCountryDetails from "@/data/countryDetails/asia.json";
import europeCountryDetails from "@/data/countryDetails/europe.json";
import africaCountryDetails from "@/data/countryDetails/africa.json";
import americasCountryDetails from "@/data/countryDetails/americas.json";
import middleEastCountryDetails from "@/data/countryDetails/middle-east.json";
import pacificIslandsCountryDetails from "@/data/countryDetails/pacific-islands.json";

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

function validateRegion(
  regionKey: string,
  data: Array<{ country?: string; countrySlug?: string; id?: string; title?: string }>,
  details: Record<string, any>
) {
  const detailKeys = Object.keys(details || {});
  if (detailKeys.length === 0) return; // Skip regions without country details yet
  const missing = new Set<string>();
  for (const p of data || []) {
    const slug = (p.countrySlug && p.countrySlug.trim()) || slugify(p.country || "");
    if (!detailKeys.includes(slug)) missing.add(slug);
  }
  if (missing.size) {
    console.warn(
      `[validate-links] ${regionKey}: Missing countryDetails for slugs ->`,
      Array.from(missing)
    );
  }
}

export function validateAllLinks() {
  try {
    validateRegion("asia", asiaData as any, asiaCountryDetails as any);
    validateRegion("europe", europeData as any, europeCountryDetails as any);
    validateRegion("africa", africaData as any, africaCountryDetails as any);
    validateRegion("americas", americasData as any, americasCountryDetails as any);
    validateRegion("middle-east", middleEastData as any, middleEastCountryDetails as any);
    validateRegion("pacific-islands", pacificIslandsData as any, pacificIslandsCountryDetails as any);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[validate-links] Error while validating:", e);
  }
}
