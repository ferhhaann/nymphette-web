import type { UnifiedRegionData } from "./types";
import packages from "./asia.json";
import details from "../countryDetails/asia.json";

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

const build = (): UnifiedRegionData => {
  const countries: UnifiedRegionData["countries"] = {} as any;
  const pkgs = (packages as any[]);
  for (const p of pkgs) {
    const slug = (p.countrySlug && String(p.countrySlug).trim()) || slugify(String(p.country || ""));
    if (!countries[slug]) countries[slug] = { packages: [] } as any;
    countries[slug].packages.push(p as any);
  }
  const det = (details as Record<string, any>);
  if (det && typeof det === 'object') {
    for (const [slug, d] of Object.entries(det)) {
      if (!countries[slug]) countries[slug] = { packages: [] } as any;
      (countries[slug] as any).details = d;
    }
  }
  return { countries };
};

const asiaMerged: UnifiedRegionData = build();
export default asiaMerged;
