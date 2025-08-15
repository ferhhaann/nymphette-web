import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionPackages from "@/components/RegionPackages";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Users } from "lucide-react";
import regionsImage from "@/assets/regions-world.jpg";
import { packagesData } from "@/data/packagesData";

const Packages = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regions = [
    {
      name: "Asia",
      countries: ["Thailand", "Japan", "Singapore", "Malaysia", "Indonesia", "Vietnam"],
      packageCount: (packagesData["Asia"] || []).length,
      startingPrice: "₹25,000",
      image: regionsImage,
      highlights: ["Cultural Tours", "Beach Resorts", "Adventure"]
    },
    {
      name: "Europe", 
      countries: ["France", "Italy", "Switzerland", "Germany", "Spain", "Greece"],
      packageCount: (packagesData["Europe"] || []).length,
      startingPrice: "₹85,000",
      image: regionsImage,
      highlights: ["Historic Sites", "Art & Culture", "Scenic Beauty"]
    },
    {
      name: "Africa",
      countries: ["Kenya", "Tanzania", "South Africa", "Morocco", "Egypt", "Botswana"],
      packageCount: (packagesData["Africa"] || []).length,
      startingPrice: "₹95,000", 
      image: regionsImage,
      highlights: ["Safari Adventures", "Wildlife", "Desert Tours"]
    },
    {
      name: "Americas",
      countries: ["USA", "Canada", "Brazil", "Argentina", "Peru", "Mexico"],
      packageCount: (packagesData["Americas"] || []).length,
      startingPrice: "₹75,000",
      image: regionsImage,
      highlights: ["City Tours", "Natural Wonders", "Cultural Heritage"]
    },
    {
      name: "Pacific Islands",
      countries: ["Maldives", "Fiji", "Tahiti", "Hawaii", "Mauritius", "Seychelles"],
      packageCount: (packagesData["Pacific Islands"] || []).length,
      startingPrice: "₹65,000",
      image: regionsImage,
      highlights: ["Beach Resorts", "Water Sports", "Luxury Stays"]
    },
    {
      name: "Middle East",
      countries: ["UAE", "Turkey", "Jordan", "Israel", "Qatar", "Oman"],
      packageCount: (packagesData["Middle East"] || []).length,
      startingPrice: "₹45,000",
      image: regionsImage,
      highlights: ["Luxury Tours", "Desert Safari", "Historic Sites"]
    }
  ];

  const [filteredRegions, setFilteredRegions] = useState(regions);

  // Get search parameters from URL (from hero search)
  const searchDestination = searchParams.get('destination');
  const searchDate = searchParams.get('date'); 
  const searchTravelers = searchParams.get('travelers');

  useEffect(() => {
    // Filter regions based on search destination if provided
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
  }, [searchDestination]);

  const handleRegionClick = (regionName: string) => {
    const slug = regionName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/regions/${slug}`);
  };

  const handleBackToRegions = () => {
    setSelectedRegion(null);
  };

  const featuredPackages = [
    {
      title: "Bali Paradise Escape",
      destination: "Bali, Indonesia",
      duration: "6D/5N",
      price: "₹45,000",
      rating: 4.8,
      image: regionsImage,
      region: "Asia"
    },
    {
      title: "European Grand Tour",
      destination: "Paris, Rome, Swiss Alps",
      duration: "12D/11N", 
      price: "₹1,25,000",
      rating: 4.9,
      image: regionsImage,
      region: "Europe"
    },
    {
      title: "Maldives Honeymoon",
      destination: "Maldives",
      duration: "7D/6N",
      price: "₹85,000",
      rating: 4.9,
      image: regionsImage,
      region: "Pacific Islands"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Conditional rendering based on selected region */}
      {selectedRegion ? (
        <div className="pt-20 mt-6 mb-12 px-4 sm:px-6 lg:px-8">
          <RegionPackages region={selectedRegion} onBack={handleBackToRegions} />
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="pt-20 pb-16 bg-hero-gradient text-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                Explore Our Travel Packages
              </h1>
              <p className="text-xl text-background/80 max-w-3xl mx-auto animate-slide-up">
                Discover amazing destinations across the globe with our carefully curated travel packages
              </p>
              {/* Show search filters if any */}
              {(searchDestination || searchDate || searchTravelers) && (
                <div className="mt-6 bg-white/20 backdrop-blur-md rounded-xl p-4 max-w-2xl mx-auto">
                  <p className="text-soft-blue mb-2">Search Results for:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {searchDestination && (
                      <Badge className="bg-accent text-white">Destination: {searchDestination}</Badge>
                    )}
                    {searchDate && (
                      <Badge className="bg-accent text-white">Date: {searchDate}</Badge>
                    )}
                    {searchTravelers && (
                      <Badge className="bg-accent text-white">Travelers: {searchTravelers}</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Regions Grid */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-primary mb-4">Choose Your Destination</h2>
                <p className="text-xl text-muted-foreground">
                  {searchDestination ? 
                    `Found ${filteredRegions.length} region${filteredRegions.length !== 1 ? 's' : ''} matching "${searchDestination}"` :
                    "Explore packages organized by regions around the world"
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRegions.map((region, index) => (
              <Card 
                key={region.name}
                className="group overflow-hidden hover:shadow-travel transition-all duration-500 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleRegionClick(region.name)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={region.image}
                    alt={region.name}
                    loading="lazy"
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary-dark/40 group-hover:bg-primary-dark/30 transition-colors"></div>
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

      {/* Featured Packages - Only show if no search is active */}
      {!searchDestination && (
        <section className="py-20 bg-pale-blue/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-primary mb-4">Featured Packages</h2>
              <p className="text-xl text-muted-foreground">Hand-picked travel experiences you shouldn't miss</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPackages.map((pkg, index) => (
                <Card 
                  key={pkg.title}
                  className="group overflow-hidden hover:shadow-travel transition-all duration-500 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      loading="lazy"
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-white">{pkg.region}</Badge>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{pkg.rating}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-2">{pkg.title}</h3>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{pkg.destination}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {pkg.duration}
                      </div>
                      <div className="text-2xl font-bold text-accent">{pkg.price}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      </>
      )}

      <Footer />
    </div>
  );
};

export default Packages;