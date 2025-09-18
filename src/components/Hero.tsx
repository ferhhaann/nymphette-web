import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, MapPin, Users, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOptimizedContentValue } from "@/hooks/useOptimizedContent"
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useToast } from "@/hooks/use-toast";
import { useSearchData } from "@/hooks/useSearchData";
import heroImage from "@/assets/hero-mountain-road.jpg";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { searchCountry, searchRegion, loading } = useSearchData();
  
  const { data: heroTitle } = useOptimizedContentValue('homepage', 'hero_title', 'Discover Amazing Travel Destinations')
  const { data: journeyDescription } = useOptimizedContentValue('homepage', 'journey_description', 'Contact us today and let our expert travel consultants help you plan the perfect trip tailored to your preferences and budget.')
  
  console.log('Hero component - heroTitle:', heroTitle)
  console.log('Hero component - journeyDescription:', journeyDescription)

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    console.log('Searching for:', query);

    // Check for region matches using dynamic data
    const matchedRegion = searchRegion(query);
    if (matchedRegion) {
      console.log('Found region match:', matchedRegion);
      navigate(matchedRegion.path);
      setSearchQuery("");
      return;
    }

    // Check for country matches using dynamic data
    const matchedCountry = searchCountry(query);
    if (matchedCountry) {
      console.log('Found country match:', matchedCountry);
      // Navigate to the country detail page via region
      navigate(`/regions/${matchedCountry.region}/country/${matchedCountry.slug}`);
      setSearchQuery("");
      return;
    }

    console.log('No matches found for:', query);
    // If no matches found, show toast and fallback to packages page
    toast({
      title: "No packages available",
      description: `Sorry, we don't have packages for "${searchQuery}" at the moment. Showing all available packages instead.`,
      variant: "destructive"
    });
    
    // Fallback to packages page with search query
    navigate(`/packages?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  const handleExplorePackages = () => {
    navigate('/packages');
  };

  const handlePlanCustomTrip = () => {
    navigate('/contact');
  };

  const quickDestinations = [
    { name: "Asia", path: "/regions/asia", popular: true },
    { name: "Europe", path: "/regions/europe", popular: true },
    { name: "Africa", path: "/regions/africa", popular: false },
    { name: "Americas", path: "/regions/americas", popular: false },
  ];

  const stats = [
    { icon: MapPin, value: "50+", label: "Destinations" },
    { icon: Users, value: "10K+", label: "Happy Travelers" },
    { icon: Star, value: "4.8", label: "Average Rating" },
    { icon: Calendar, value: "5+", label: "Years Experience" },
  ];

  return (
    <div className="relative">
      {/* Hero Image Section */}
      <section className="relative h-[80vh] sm:h-[calc(100vh-3rem)] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-x-3 sm:inset-x-6 md:inset-x-8 bottom-3 sm:bottom-6 md:bottom-8 top-3 sm:top-6 md:top-8 rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="absolute inset-0">
            <OptimizedImage
              src={heroImage}
              alt="Travel destinations hero image"
              priority={true}
              className="w-full h-full"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
          <div className="absolute inset-0 bg-foreground/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-background max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            
            <div className="mb-4 sm:mb-6 animate-fade-in">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors text-sm sm:text-base px-3 py-1">
                <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                Trusted by 10,000+ Travelers
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-sans tracking-tight mb-2 sm:mb-3 md:mb-4 animate-fade-in leading-tight">
              {heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-background/90 animate-slide-up leading-relaxed px-1 sm:px-2 max-w-2xl mx-auto">
              Explore handpicked travel packages and create unforgettable memories with expert guides.
            </p>
          </div>
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>

        {/* Floating Elements - Hidden on mobile */}
        {/* <div className="absolute top-20 left-10 hidden lg:block animate-float">
          <div className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm" />
        </div>
        <div className="absolute bottom-32 right-16 hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm" />
        </div> */}
      </section>

      {/* Compact Search and CTA Section */}
      <section className="relative bg-gradient-to-br from-background via-secondary/5 to-primary/5 py-12 sm:py-16 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          
          {/* Compact Search Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
              <Search className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Find Your Next Adventure</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Where would you like to go?
            </h2>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <div className="relative bg-card border border-border/50 rounded-2xl p-2 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={loading ? "Loading destinations..." : "Search destinations or countries..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={loading}
                        className="pl-12 h-12 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:ring-0"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={loading || !searchQuery.trim()}
                      className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {loading ? "..." : "Search"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Quick Destinations */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto mb-8">
              {quickDestinations.map((destination, index) => (
                <Button
                  key={destination.name}
                  variant="outline"
                  onClick={() => navigate(destination.path)}
                  className="relative h-10 border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded-xl text-sm font-medium text-foreground group"
                >
                  <span className="relative z-10">{destination.name}</span>
                  {destination.popular && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button 
                size="lg" 
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                onClick={handleExplorePackages}
              >
                <span>Explore Packages</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1 h-12 border border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                onClick={handlePlanCustomTrip}
              >
                <span>Custom Trip</span>
                <Users className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>50+ Destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>10K+ Travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span>4.8 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;