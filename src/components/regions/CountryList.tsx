import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPinned } from "lucide-react";
import type { TravelPackage } from "@/data/packagesData";

import asiaDetails from "@/data/countryDetails/asia.json";
import europeDetails from "@/data/countryDetails/europe.json";
import africaDetails from "@/data/countryDetails/africa.json";
import americasDetails from "@/data/countryDetails/americas.json";
import middleEastDetails from "@/data/countryDetails/middle-east.json";
import pacificIslandsDetails from "@/data/countryDetails/pacific-islands.json";

const DETAILS_BY_REGION: Record<string, Record<string, any>> = {
  asia: asiaDetails as Record<string, any>,
  europe: europeDetails as Record<string, any>,
  africa: africaDetails as Record<string, any>,
  americas: americasDetails as Record<string, any>,
  "middle-east": middleEastDetails as Record<string, any>,
  "pacific-islands": pacificIslandsDetails as Record<string, any>,
};
interface CountryListProps {
  regionKey: string;
  data: TravelPackage[];
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const CountryList: React.FC<CountryListProps> = ({ regionKey, data }) => {
  const countries = useMemo(() => {
    const details = DETAILS_BY_REGION[regionKey] || {};
    // Build counts from current packages list (for badge), but presence is from details
    const counts = new Map<string, number>();
    for (const p of data) {
      const slug = (p.countrySlug && p.countrySlug.trim()) || slugify(p.country?.trim() || "");
      if (!slug) continue;
      counts.set(slug, (counts.get(slug) || 0) + 1);
    }
    return Object.entries(details)
      .map(([slug, d]: [string, any]) => ({
        slug,
        name: (d && (d as any).name) || slug.replace(/-/g, " ").replace(/\b\w/g, (s) => s.toUpperCase()),
        count: counts.get(slug) || 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [regionKey, data]);

  if (!countries.length) return null;

  return (
    <section aria-labelledby="country-list-title" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <header className="mb-4 flex items-center justify-between">
        <h2 id="country-list-title" className="text-2xl font-semibold">Browse countries</h2>
        <Badge variant="secondary" className="gap-1">
          <MapPinned className="size-4" /> {countries.length} countries
        </Badge>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {countries.map((c) => (
          <Link key={c.slug} to={`/regions/${regionKey}/country/${c.slug}`} aria-label={`View ${c.name} tours`}>
            <Card className="p-3 h-full hover:shadow-card transition-shadow animate-fade-in hover-scale">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{c.name}</span>
                <Badge variant="outline" className="text-xs">{c.count}</Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CountryList;
