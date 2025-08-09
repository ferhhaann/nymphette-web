import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Filter } from "lucide-react";
import { TravelPackage, packagesData } from "@/data/packagesData";
import PackageCard from "./PackageCard";
import PackageItineraryComponent from "./PackageItinerary";

interface RegionPackagesProps {
  region: string;
  onBack: () => void;
}

const RegionPackages = ({ region, onBack }: RegionPackagesProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [showItinerary, setShowItinerary] = useState(false);

  const packages = packagesData[region] || [];
  
  // Get unique countries and categories for filters
  const countries = ["all", ...Array.from(new Set(packages.map(pkg => pkg.country)))];
  const categories = ["all", ...Array.from(new Set(packages.map(pkg => pkg.category)))];

  // Filter packages based on selected filters
  const filteredPackages = packages.filter(pkg => {
    const countryMatch = selectedCountry === "all" || pkg.country === selectedCountry;
    const categoryMatch = selectedCategory === "all" || pkg.category === selectedCategory;
    return countryMatch && categoryMatch;
  });

  // Group packages by country for better organization
  const packagesByCountry = filteredPackages.reduce((acc, pkg) => {
    if (!acc[pkg.country]) {
      acc[pkg.country] = [];
    }
    acc[pkg.country].push(pkg);
    return acc;
  }, {} as Record<string, TravelPackage[]>);

  // Utilities for pricing and country info
  const parsePrice = (priceStr: string) => {
    const num = Number(priceStr.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? Infinity : num;
  };

  type CountryInfo = {
    name: string;
    highlights: string[];
    image: string | undefined;
    minPriceLabel: string;
    count: number;
  };

  const countryInfos: CountryInfo[] = Object.entries(packagesByCountry)
    .map(([country, pkgs]) => {
      const highlights = Array.from(new Set(pkgs.flatMap((p) => p.highlights))).slice(0, 3);
      const minPkg = pkgs.reduce((min, p) => (parsePrice(p.price) < parsePrice(min.price) ? p : min), pkgs[0]);
      return {
        name: country,
        highlights,
        image: minPkg?.image,
        minPriceLabel: minPkg?.price ?? "",
        count: pkgs.length,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleViewDetails = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setShowItinerary(true);
    }
  };

  const handleCloseItinerary = () => {
    setShowItinerary(false);
    setSelectedPackage(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-accent text-accent hover:bg-accent hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Regions
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-primary">{region} Travel Packages</h2>
            <p className="text-muted-foreground">Discover amazing destinations in {region}</p>
          </div>
        </div>
        <Badge className="bg-accent text-white text-lg px-4 py-2">
          {filteredPackages.length} Packages Found
        </Badge>
      </div>

      {/* Countries in Region */}
      <section aria-labelledby="countries-heading" className="space-y-4">
        <h3 id="countries-heading" className="text-xl font-semibold text-primary">Countries in {region}</h3>
        <TooltipProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {countryInfos.map((c) => (
              <Card
                key={c.name}
                className="overflow-hidden hover:shadow-lg transition-shadow hover-scale cursor-pointer"
                onClick={() => setSelectedCountry(c.name)}
                aria-label={`View packages in ${c.name}`}
              >
                <div className="relative h-40 w-full">
                  <img
                    src={c.image}
                    alt={`${c.name} travel - ${region}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-background/10" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-card-foreground">{c.name}</p>
                      <Badge variant="secondary" className="backdrop-blur">{c.count} {c.count === 1 ? 'pkg' : 'pkgs'}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">From {c.minPriceLabel}</p>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {c.highlights.map((h) => (
                      <Tooltip key={h}>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="max-w-[140px] truncate">{h}</Badge>
                        </TooltipTrigger>
                        <TooltipContent>{h}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TooltipProvider>
      </section>

      {/* Filters */}
      <div className="bg-pale-blue/30 rounded-2xl p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-primary">Filter Packages</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Country Filter */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-3 border border-input rounded-lg bg-white focus:ring-2 focus:ring-accent focus:border-accent"
            >
              {countries.map(country => (
                <option key={country} value={country}>
                  {country === "all" ? "All Countries" : country}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-input rounded-lg bg-white focus:ring-2 focus:ring-accent focus:border-accent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Packages organized by country */}
      {selectedCountry === "all" ? (
        // Show packages grouped by country
        <div className="space-y-12">
          {Object.entries(packagesByCountry).map(([country, countryPackages]) => (
            <div key={country} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-primary">{country}</h3>
                <Badge variant="outline" className="border-accent text-accent">
                  {countryPackages.length} package{countryPackages.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {countryPackages.map((pkg, index) => (
                  <div key={pkg.id} style={{ animationDelay: `${index * 100}ms` }}>
                    <PackageCard package={pkg} onViewDetails={handleViewDetails} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Show packages for selected country only
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-primary">{selectedCountry} Packages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg, index) => (
              <div key={pkg.id} style={{ animationDelay: `${index * 100}ms` }}>
                <PackageCard package={pkg} onViewDetails={handleViewDetails} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No packages found */}
      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No packages found for the selected filters.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedCountry("all");
              setSelectedCategory("all");
            }}
            className="mt-4 border-accent text-accent hover:bg-accent hover:text-white"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Itinerary Modal */}
      {showItinerary && selectedPackage && (
        <PackageItineraryComponent
          itinerary={selectedPackage.itinerary}
          packageTitle={selectedPackage.title}
          onClose={handleCloseItinerary}
        />
      )}
    </div>
  );
};

export default RegionPackages;