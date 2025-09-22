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
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
// Removed hero image import - now using video

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { searchCountry, searchRegion, loading } = useSearchData();
  const { isMobile, optimizedSettings } = useMobileOptimization({ mobileLayoutMode: 'compact' });
  
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
      <section className={`relative ${isMobile ? 'h-64' : 'h-[80vh] sm:h-[calc(100vh-3rem)]'} w-full flex items-center justify-center overflow-hidden`}>
        {/* Background Video */}
        <div className={`absolute ${isMobile ? 'inset-2 rounded-xl' : 'inset-x-3 sm:inset-x-6 md:inset-x-8 bottom-3 sm:bottom-6 md:bottom-8 top-3 sm:top-6 md:top-8 rounded-2xl sm:rounded-3xl'} overflow-hidden`}>
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              poster="/hero-video-poster.jpg"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="absolute inset-0 bg-foreground/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className={`relative z-10 text-center text-background max-w-5xl mx-auto ${optimizedSettings.containerPadding} ${isMobile ? 'py-4 flex flex-col justify-center h-full' : 'py-6 sm:py-8 md:py-12'}`}>
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            
            {/* Trust Badge - Smaller on mobile */}
            <div className={`${isMobile ? 'mb-3' : 'mb-4 sm:mb-6'} animate-fade-in`}>
              <Badge variant="secondary" className={`bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors ${isMobile ? 'text-xs px-2 py-1' : 'text-sm sm:text-base px-3 py-1'}`}>
                <Star className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2 fill-yellow-400 text-yellow-400`} />
                {isMobile ? '10K+ Travelers' : 'Trusted by 10,000+ Travelers'}
              </Badge>
            </div>

            {/* Main Headline - Mobile optimized */}
            <h1 className={`${optimizedSettings.heroTitle} font-bold font-sans tracking-tight ${isMobile ? 'mb-2' : 'mb-2 sm:mb-3 md:mb-4'} animate-fade-in leading-tight`}>
              {heroTitle}
            </h1>

            {/* Subtitle - Shorter on mobile */}
            <p className={`${optimizedSettings.bodyText} ${isMobile ? 'mb-3' : 'mb-4 sm:mb-6'} text-background/90 animate-slide-up leading-relaxed px-1 sm:px-2 max-w-2xl mx-auto`}>
              {isMobile ? 'Handpicked travel packages with expert guides.' : 'Explore handpicked travel packages and create unforgettable memories with expert guides.'}
            </p>
          </div>
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        {!isMobile && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        )}
      </section>

      {/* Compact Search and CTA Section */}
      <section className={`relative bg-gradient-to-br from-background via-secondary/5 to-primary/5 ${optimizedSettings.mobileLayout.sectionPadding || 'py-12 sm:py-16'} overflow-hidden`}>
        {/* Subtle background decoration - Reduced on mobile */}
        {!isMobile && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
          </div>
        )}

        <div className={`relative z-10 max-w-4xl mx-auto ${optimizedSettings.containerPadding}`}>
          
          {/* Compact Search Section */}
          <div className={`text-center ${isMobile ? 'mb-8' : 'mb-12'}`}>
            <div className={`inline-flex items-center gap-2 ${isMobile ? 'mb-4 px-3 py-1.5' : 'mb-6 px-4 py-2'} bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20`}>
              <Search className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-primary`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-foreground`}>
                {isMobile ? 'Find Adventure' : 'Find Your Next Adventure'}
              </span>
            </div>
            
            <h2 className={`${optimizedSettings.sectionTitle} font-bold text-foreground ${isMobile ? 'mb-4' : 'mb-6'}`}>
              {isMobile ? 'Where to go?' : 'Where would you like to go?'}
            </h2>
            
            <form onSubmit={handleSearch} className={`max-w-2xl mx-auto ${isMobile ? 'mb-6' : 'mb-8'}`}>
              <div className="relative group">
                <div className={`relative bg-card border border-border/50 ${isMobile ? 'rounded-xl p-1.5' : 'rounded-2xl p-2'} shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <div className={`flex ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                    <div className="flex-1 relative">
                      <Search className={`absolute ${isMobile ? 'left-3' : 'left-4'} top-1/2 transform -translate-y-1/2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-muted-foreground`} />
                      <Input
                        type="text"
                        placeholder={loading ? "Loading..." : (isMobile ? "Search destinations..." : "Search destinations or countries...")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={loading}
                        className={`${isMobile ? 'pl-10 h-10' : 'pl-12 h-12'} bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:ring-0 ${isMobile ? 'text-sm' : ''}`}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={loading || !searchQuery.trim()}
                      className={`${optimizedSettings.buttonSize} bg-primary hover:bg-primary/90 text-primary-foreground ${isMobile ? 'rounded-lg' : 'rounded-xl'} font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
                    >
                      {loading ? "..." : (isMobile ? "Go" : "Search")}
                      <ArrowRight className={`ml-2 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Quick Destinations */}
            <div className={`${isMobile ? 'mb-4' : 'mb-8'}`}>
              {/* Asia & Europe row */}
              <div className={`flex ${isMobile ? 'gap-2 mb-2' : 'gap-4 mb-4'} justify-center max-w-lg mx-auto`}>
                <Button
                  variant="outline"
                  onClick={() => navigate("/regions/asia")}
                  className={`flex-1 max-w-32 ${optimizedSettings.minTouchTarget} ${isMobile ? 'h-8 text-xs' : 'h-10 text-sm'} bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 hover:from-primary/20 hover:to-primary/10 hover:border-primary/50 transition-all duration-300 ${isMobile ? 'rounded-lg' : 'rounded-xl'} font-medium text-foreground group relative shadow-sm hover:shadow-md`}
                >
                  <span className="relative z-10">Asia</span>
                  <div className={`absolute top-1 right-1 ${isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'} bg-primary rounded-full`} />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/regions/europe")}
                  className={`flex-1 max-w-32 ${optimizedSettings.minTouchTarget} ${isMobile ? 'h-8 text-xs' : 'h-10 text-sm'} bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 hover:from-primary/20 hover:to-primary/10 hover:border-primary/50 transition-all duration-300 ${isMobile ? 'rounded-lg' : 'rounded-xl'} font-medium text-foreground group relative shadow-sm hover:shadow-md`}
                >
                  <span className="relative z-10">Europe</span>
                  <div className={`absolute top-1 right-1 ${isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'} bg-primary rounded-full`} />
                </Button>
              </div>
              
              {/* Africa & Americas row */}
              <div className={`flex ${isMobile ? 'gap-2' : 'gap-4'} justify-center max-w-lg mx-auto`}>
                <Button
                  variant="outline"
                  onClick={() => navigate("/regions/africa")}
                  className={`flex-1 max-w-32 ${optimizedSettings.minTouchTarget} ${isMobile ? 'h-8 text-xs' : 'h-10 text-sm'} bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 hover:from-primary/20 hover:to-primary/10 hover:border-primary/50 transition-all duration-300 ${isMobile ? 'rounded-lg' : 'rounded-xl'} font-medium text-foreground group shadow-sm hover:shadow-md`}
                >
                  <span className="relative z-10">Africa</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/regions/americas")}
                  className={`flex-1 max-w-32 ${optimizedSettings.minTouchTarget} ${isMobile ? 'h-8 text-xs' : 'h-10 text-sm'} bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 hover:from-primary/20 hover:to-primary/10 hover:border-primary/50 transition-all duration-300 ${isMobile ? 'rounded-lg' : 'rounded-xl'} font-medium text-foreground group shadow-sm hover:shadow-md`}
                >
                  <span className="relative z-10">Americas</span>
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isMobile ? 'gap-2 mb-4' : 'flex-col sm:flex-row gap-4'} justify-center max-w-md mx-auto`}>
              <Button 
                size={isMobile ? "default" : "lg"}
                className={`flex-1 ${optimizedSettings.buttonSize} bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground ${isMobile ? 'rounded-lg' : 'rounded-xl'} font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
                onClick={handleExplorePackages}
              >
                <span>{isMobile ? 'Packages' : 'Explore Packages'}</span>
                <ArrowRight className={`ml-2 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              </Button>
              
              <Button 
                variant="outline" 
                size={isMobile ? "default" : "lg"}
                className={`flex-1 ${optimizedSettings.buttonSize} bg-gradient-to-r from-background to-secondary/10 border border-primary/30 hover:from-primary/10 hover:to-primary/5 hover:border-primary/50 ${isMobile ? 'rounded-lg' : 'rounded-xl'} font-semibold transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md`}
                onClick={handlePlanCustomTrip}
              >
                <span>{isMobile ? 'Custom' : 'Custom Trip'}</span>
                <Users className={`ml-2 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              </Button>
            </div>
            
            {/* Stats - Simplified for mobile */}
            <div className={`flex flex-wrap justify-center items-center ${isMobile ? 'gap-4 mt-6 text-xs' : 'gap-6 mt-8 text-sm'} text-muted-foreground`}>
              <div className="flex items-center gap-2">
                <MapPin className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-primary`} />
                <span>{isMobile ? '50+ Places' : '50+ Destinations'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-primary`} />
                <span>10K+ Travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-primary fill-primary`} />
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