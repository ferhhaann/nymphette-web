import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPinned } from "lucide-react";
import type { TravelPackage } from "@/data/packagesData";

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
    const map = new Map<string, { name: string; count: number }>();
    for (const p of data) {
      const name = p.country?.trim();
      if (!name) continue;
      const slug = (p.countrySlug && p.countrySlug.trim()) || slugify(name);
      const curr = map.get(slug) || { name, count: 0 };
      // Prefer the most readable name if there are variants
      curr.name = curr.name.length >= name.length ? curr.name : name;
      curr.count += 1;
      map.set(slug, curr);
    }
    return Array.from(map.entries())
      .map(([slug, v]) => ({ slug, name: v.name, count: v.count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

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
