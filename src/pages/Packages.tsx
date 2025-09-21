import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import RegionPackages from "@/components/RegionPackages";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Users } from "lucide-react";
import ImageSlideshow from "@/components/ImageSlideshow";
import premiumPackagesHero from "@/assets/premium-packages-hero.jpg";
// Region slideshow images - 3 images per region
import asia1 from "@/assets/regions/asia-1.jpg";
import asia2 from "@/assets/regions/asia-2.jpg";
import asia3 from "@/assets/regions/asia-3.jpg";
import europe1 from "@/assets/regions/europe-1.jpg";
import europe2 from "@/assets/regions/europe-2.jpg";
import europe3 from "@/assets/regions/europe-3.jpg";
import africa1 from "@/assets/regions/africa-1.jpg";
import africa2 from "@/assets/regions/africa-2.jpg";
import africa3 from "@/assets/regions/africa-3.jpg";
import americas1 from "@/assets/regions/americas-1.jpg";
import americas2 from "@/assets/regions/americas-2.jpg";
import americas3 from "@/assets/regions/americas-3.jpg";
import pacific1 from "@/assets/regions/pacific-1.jpg";
import pacific2 from "@/assets/regions/pacific-2.jpg";
import pacific3 from "@/assets/regions/pacific-3.jpg";
import middleEast1 from "@/assets/regions/middle-east-1.jpg";
import middleEast2 from "@/assets/regions/middle-east-2.jpg";
import middleEast3 from "@/assets/regions/middle-east-3.jpg";
import { usePackages } from "@/hooks/usePackages";
import { useStaticSEO } from "@/hooks/useStaticSEO";

const Packages = () => {
  useStaticSEO(); // Apply SEO settings from database
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Preload critical images for faster initial load
  useEffect(() => {
    const preloadImages = [asia1, europe1, africa1];
    preloadImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
    
    return () => {
      // Cleanup preload links
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
      preloadLinks.forEach(link => link.remove());
    };
  }, []);

  // We'll compute package counts dynamically using the data hook so counts reflect Supabase/local data.
  const { packages: allPackages, loading: packagesLoading } = usePackages();

  // packages are loaded via usePackages(); counts are computed below

  const norm = (s?: string) => (s || "").toString().trim().toLowerCase();

  const regions = [
    {
      name: "Asia",
      countries: ["Thailand", "Japan", "Singapore", "Malaysia", "Indonesia", "Vietnam"],
      packageCount: allPackages ? allPackages.filter(p => norm(p.region) === norm("Asia")).length : 0,
      startingPrice: "₹25,000",
      images: [asia1, asia2, asia3],
      highlights: ["Cultural Tours", "Beach Resorts", "Adventure"]
    },
    {
      name: "Europe", 
      countries: ["France", "Italy", "Switzerland", "Germany", "Spain", "Greece"],
      packageCount: allPackages ? allPackages.filter(p => norm(p.region) === norm("Europe")).length : 0,
      startingPrice: "₹85,000",
      images: [europe1, europe2, europe3],
      highlights: ["Historic Sites", "Art & Culture", "Scenic Beauty"]
    },
    {
      name: "Africa",
      countries: ["Kenya", "Tanzania", "South Africa", "Morocco", "Egypt", "Botswana"],
      packageCount: allPackages ? allPackages.filter(p => norm(p.region) === norm("Africa")).length : 0,
      startingPrice: "₹95,000", 
      images: [africa1, africa2, africa3],
      highlights: ["Safari Adventures", "Wildlife", "Desert Tours"]
    },
    {
      name: "Americas",
      countries: ["USA", "Canada", "Brazil", "Argentina", "Peru", "Mexico"],
      packageCount: allPackages ? allPackages.filter(p => norm(p.region) === norm("Americas")).length : 0,
      startingPrice: "₹75,000",
      images: [americas1, americas2, americas3],
      highlights: ["City Tours", "Natural Wonders", "Cultural Heritage"]
    },
    {
      name: "Pacific Islands",
      countries: ["Maldives", "Fiji", "Tahiti", "Hawaii", "Mauritius", "Seychelles"],
      packageCount: allPackages ? allPackages.filter(p => norm(p.region) === norm("Pacific Islands")).length : 0,
      startingPrice: "₹65,000",
      images: [pacific1, pacific2, pacific3],
      highlights: ["Beach Resorts", "Water Sports", "Luxury Stays"]
    },
    {
      name: "Middle East",
      countries: ["UAE", "Turkey", "Jordan", "Israel", "Qatar", "Oman"],
      packageCount: allPackages ? allPackages.filter(p => norm(p.region) === norm("Middle East")).length : 0,
      startingPrice: "₹45,000",
      images: [middleEast1, middleEast2, middleEast3],
      highlights: ["Luxury Tours", "Desert Safari", "Historic Sites"]
    }
  ];

  const [filteredRegions, setFilteredRegions] = useState(regions);

  // Get search parameters from URL (from hero search)
  const searchDestination = searchParams.get('destination');
  const searchDate = searchParams.get('date'); 
  const searchTravelers = searchParams.get('travelers');

  useEffect(() => {
    // Recompute filtered regions whenever searchDestination or package data changes
    if (searchDestination) {
      const filtered = regions.filter(region => 
        region.countries.some(country => 
          country.toLowerCase().includes(searchDestination.toLowerCase())
        ) || region.name.toLowerCase().includes(searchDestination.toLowerCase())
      );
      setFilteredRegions(filtered);
    } else {
      setFilteredRegions(regions);
    }
  }, [searchDestination, allPackages]);

  const handleRegionClick = (regionName: string) => {
    const slug = regionName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/packages/region/${slug}`);
  };

  const handleBackToRegions = () => {
    setSelectedRegion(null);
  };

  const packagesStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Travel Packages - Explore Destinations Worldwide",
    "description": "Browse our curated travel packages across Asia, Europe, Africa, Americas, Pacific Islands, and Middle East. Find your perfect vacation with expert travel planning.",
    "url": "/packages",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Travel Package Regions",
      "numberOfItems": filteredRegions.length,
      "itemListElement": filteredRegions.map((region, index) => ({
        "@type": "TravelAction",
        "name": region.name,
        "description": `Travel packages to ${region.name} starting from ${region.startingPrice}`,
        "position": index + 1
      }))
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <header>
        <Navigation />
      </header>
      
      {/* Conditional rendering based on selected region */}
      {selectedRegion ? (
        <div className="pt-4 mt-6 mb-12 px-4 sm:px-6 lg:px-8">
          <RegionPackages region={selectedRegion} onBack={handleBackToRegions} />
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <main>
            <section className="relative h-64 sm:h-[70vh] md:h-[80vh] lg:h-[calc(100vh-3rem)] flex items-center justify-center overflow-hidden mt-4 sm:mt-0">
              <div className="absolute inset-x-3 sm:inset-x-6 md:inset-x-8 bottom-3 sm:bottom-6 md:bottom-8 top-3 sm:top-6 md:top-8 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className="absolute inset-0">
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat scale-105"
                    style={{ backgroundImage: `url(${premiumPackagesHero})` }}
                  />
                </div>
                <div className="absolute inset-0 bg-foreground/50"></div>
              </div>
              
              <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6">
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-6 animate-scale-in leading-tight">
                  Explore Our Premium Travel Packages
                </h1>
                <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-8 opacity-90 animate-fade-in leading-relaxed" style={{ animationDelay: '0.3s' }}>
                  Discover amazing destinations across the globe with our carefully curated travel packages
                </p>
                
                {/* Show search filters if any */}
                {(searchDestination || searchDate || searchTravelers) && (
                  <div className="mb-6 sm:mb-8 bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
                    <p className="text-white/80 mb-2 text-sm sm:text-base">Search Results for:</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                      {searchDestination && (
                        <Badge className="bg-accent text-white text-xs sm:text-sm">Destination: {searchDestination}</Badge>
                      )}
                      {searchDate && (
                        <Badge className="bg-accent text-white text-xs sm:text-sm">Date: {searchDate}</Badge>
                      )}
                      {searchTravelers && (
                        <Badge className="bg-accent text-white text-xs sm:text-sm">Travelers: {searchTravelers}</Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16 opacity-80 animate-fade-in" style={{ animationDelay: '0.9s' }}>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{filteredRegions.length}</div>
                    <div className="text-xs sm:text-sm opacity-80">Regions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{allPackages?.length || 0}+</div>
                    <div className="text-xs sm:text-sm opacity-80">Packages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">50+</div>
                    <div className="text-xs sm:text-sm opacity-80">Countries</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </section>

          {/* Regions Grid */}
          <section className="py-12 sm:py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Choose Your Destination</h2>
                <p className="text-lg sm:text-xl text-muted-foreground">
                  {searchDestination ? 
                    `Found ${filteredRegions.length} region${filteredRegions.length !== 1 ? 's' : ''} matching "${searchDestination}"` :
                    "Explore packages organized by regions around the world"
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredRegions.map((region, index) => (
              <Card 
                key={region.name}
                className="group overflow-hidden hover:shadow-travel transition-all duration-500 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleRegionClick(region.name)}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <ImageSlideshow
                    images={region.images}
                    alt={`${region.name} travel destinations and highlights`}
                    width="400"
                    height="192"
                    className="w-full h-40 sm:h-48 group-hover:scale-110 transition-transform duration-500"
                    hoverToPlay={false}
                  />
                  <div className="absolute inset-0 bg-primary-dark/40 group-hover:bg-primary-dark/30 transition-colors pointer-events-none"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-accent text-white">
                      {region.packageCount} Packages
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-background mb-2">{region.name}</h3>
                    <div className="text-background/80 text-sm">Starting from {region.startingPrice}</div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {region.highlights.map((highlight, idx) => (
                      <Badge key={idx} variant="outline" className="border-soft-blue text-deep-blue">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Popular Destinations:</h4>
                    <div className="flex flex-wrap gap-1">
                      {region.countries.slice(0, 4).map((country, idx) => (
                        <span key={idx} className="text-sm text-muted-foreground">
                          {country}{idx < 3 ? "," : idx === 3 && region.countries.length > 4 ? "..." : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
          </section>
          </main>
          </>
          )}

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Packages;