import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, MapPin, Users, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContent } from "@/hooks/useContent";
import { OptimizedImage } from "@/components/ui/optimized-image";
import heroImage from "@/assets/hero-mountain-road.jpg";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { getContentValue } = useContent('hero');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/packages?search=${encodeURIComponent(searchQuery.trim())}`);
    }
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
            
            {/* Trust Badge */}
            <div className="mb-4 sm:mb-6 animate-fade-in">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors text-sm sm:text-base px-3 py-1">
                <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                Trusted by 10,000+ Travelers
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-sans tracking-tight mb-2 sm:mb-3 md:mb-4 animate-fade-in leading-tight">
              {getContentValue('title', 'Discover Amazing Travel Destinations')}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-background/90 animate-slide-up leading-relaxed px-1 sm:px-2 max-w-2xl mx-auto">
              {getContentValue('subtitle', 'Explore handpicked travel packages and create unforgettable memories with expert guides.')}
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

      {/* Modern Search and CTA Section */}
      <section className="bg-gradient-to-br from-background via-background to-secondary/20 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          
          {/* Search Section */}
          <div className="mb-12 animate-scale-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Where would you like to go?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Search through our curated travel packages
              </p>
            </div>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-card border border-border/50 rounded-2xl p-2 shadow-lg backdrop-blur-sm">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search destinations, countries, or experiences..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-12 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:ring-0 text-base"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      Search
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Quick Destinations Grid */}
          <div className="mb-12 animate-fade-in">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
              Popular Destinations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
              {quickDestinations.map((destination) => (
                <Button
                  key={destination.name}
                  variant="outline"
                  onClick={() => navigate(destination.path)}
                  className="relative h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 rounded-xl font-medium group overflow-hidden"
                >
                  <span className="relative z-10">{destination.name}</span>
                  {destination.popular && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Button>
              ))}
            </div>
          </div>

          {/* Modern CTA Section */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto animate-scale-in">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <Button 
                size="lg" 
                className="relative w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-semibold text-base transition-all duration-200 hover:scale-105 shadow-lg border-0"
                onClick={handleExplorePackages}
              >
                <div className="flex items-center justify-center gap-3">
                  <span>{getContentValue('primary_button', 'Explore Packages')}</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Button>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/80 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <Button 
                variant="outline" 
                size="lg"
                className="relative w-full h-14 border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-2xl font-semibold text-base transition-all duration-200 hover:scale-105"
                onClick={handlePlanCustomTrip}
              >
                <div className="flex items-center justify-center gap-3">
                  <span>{getContentValue('secondary_button', 'Custom Trip')}</span>
                  <Users className="h-5 w-5" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;