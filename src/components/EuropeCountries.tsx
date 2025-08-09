import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import regionsImage from "@/assets/regions-world.jpg";
import europeCountries from "@/data/europeCountries.json";
import { ArrowLeft, Filter, MapPin } from "lucide-react";

interface EuropeCountriesProps {
  onBack: () => void;
  onCountrySelect?: (countryName: string) => void;
}

interface CountryEntry {
  name: string;
  slug: string;
  flagEmoji: string;
  teaser: string;
  themes: string[];
  duration: "Short" | "Medium" | "Long";
  budget: "Budget" | "Mid" | "Lux";
  minPrice: number;
  packageCount: number;
}

const EuropeCountries = ({ onBack, onCountrySelect }: EuropeCountriesProps) => {
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<string>("all");
  const [duration, setDuration] = useState<string>("all");
  const [budget, setBudget] = useState<string>("all");

  useEffect(() => {
    document.title = "Europe Tour Packages | Nymphette Tours";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Explore Europe tour packages by country – search and filter by theme, duration, and budget."
      );
    }
  }, []);

  const data = europeCountries as CountryEntry[];

  const filtered = useMemo(() => {
    return data.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesTheme = theme === "all" || c.themes.includes(theme);
      const matchesDuration = duration === "all" || c.duration === (duration as any);
      const matchesBudget = budget === "all" || c.budget === (budget as any);
      return matchesSearch && matchesTheme && matchesDuration && matchesBudget;
    });
  }, [data, search, theme, duration, budget]);

  return (
    <main>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/packages">Packages</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Europe</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="h-[300px] md:h-[420px] w-full overflow-hidden rounded-none">
          <img
            src={regionsImage}
            alt="Europe tour packages destination banner"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-primary-dark/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="border-accent text-accent hover:bg-accent hover:text-white"
                  aria-label="Back to regions"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Regions
                </Button>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Europe Tour Packages</h1>
              <p className="text-soft-blue text-lg max-w-2xl">
                Browse countries, filter by theme, duration and budget – find your perfect European getaway.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-pale-blue/30 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3 text-primary">
            <Filter className="h-5 w-5 text-accent" />
            <h2 className="font-semibold">Filter Countries</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                aria-label="Search country"
              />
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger aria-label="Theme">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                <SelectItem value="Honeymoon">Honeymoon</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
                <SelectItem value="Adventure">Adventure</SelectItem>
              </SelectContent>
            </Select>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger aria-label="Duration">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Duration</SelectItem>
                <SelectItem value="Short">Short (3–5D)</SelectItem>
                <SelectItem value="Medium">Medium (6–9D)</SelectItem>
                <SelectItem value="Long">Long (10D+)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger aria-label="Budget">
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Budget</SelectItem>
                <SelectItem value="Budget">Budget</SelectItem>
                <SelectItem value="Mid">Mid</SelectItem>
                <SelectItem value="Lux">Luxury</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Country Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">European Countries</h2>
            <Badge variant="outline" className="border-accent text-accent">
              {filtered.length} country{filtered.length !== 1 ? "ies" : ""}
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c, idx) => (
              <Card
                key={c.slug}
                className="group overflow-hidden hover:shadow-travel transition-all duration-500"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={regionsImage}
                    alt={`${c.name} hero image`}
                    className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary-dark/30 group-hover:bg-primary-dark/20 transition-colors" />
                  <div className="absolute top-3 left-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm">
                      <span>{c.flagEmoji}</span>
                      <span className="font-medium text-primary">{c.name}</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <Badge className="bg-accent text-white">{c.packageCount} Packages</Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-muted-foreground mb-4 line-clamp-2">{c.teaser}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {c.themes.slice(0, 3).map((t) => (
                      <Badge key={t} variant="outline" className="border-soft-blue text-deep-blue">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {c.duration} • {c.budget}
                    </div>
                    <div className="text-accent font-bold">Starts at ₹{c.minPrice.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      onClick={() => onCountrySelect?.(c.name)}
                      aria-label={`View packages for ${c.name}`}
                    >
                      View Packages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default EuropeCountries;
