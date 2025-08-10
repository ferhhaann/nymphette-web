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
    const counts = new Map<string, number>();
    for (const p of data) {
      const c = p.country?.trim();
      if (!c) continue;
      counts.set(c, (counts.get(c) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count, slug: slugify(name) }))
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
