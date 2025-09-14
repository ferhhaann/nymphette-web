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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold font-sans tracking-tight mb-3 sm:mb-4 md:mb-6 animate-fade-in leading-tight">
              {getContentValue('title', 'Premium Travel Packages & Group Tours Worldwide')}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 md:mb-8 text-background/90 animate-slide-up leading-relaxed px-1 sm:px-2 max-w-4xl mx-auto">
              {getContentValue('subtitle', 'Explore handpicked travel packages across Asia, Europe, Africa, Americas & Pacific Islands. Join expertly guided group tours or create custom itineraries. Over 50 destinations worldwide with authentic experiences, professional guides, and comprehensive support from planning to return. Trusted by 10,000+ travelers for unforgettable journeys.')}
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

      {/* Search and CTA Section Below Image */}
      <section className="bg-background border-t border-border py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          
          {/* Enhanced Search Bar */}
          <div className="mb-6 sm:mb-8 animate-scale-in">
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="bg-white shadow-2xl rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-border">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Where do you want to go?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 sm:pl-12 h-10 sm:h-12 md:h-14 bg-white border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="h-10 sm:h-12 md:h-14 px-4 sm:px-6 md:px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-200 hover:scale-105 shadow-lg w-full"
                  >
                    <span>Search Packages</span>
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Quick Destinations */}
          <div className="mb-6 sm:mb-8 md:mb-12 animate-fade-in text-center">
            <p className="text-muted-foreground mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Popular Destinations:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickDestinations.map((destination) => (
                <Button
                  key={destination.name}
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(destination.path)}
                  className="border-border hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium relative group"
                >
                  {destination.name}
                  {destination.popular && (
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 justify-center animate-scale-in">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 md:px-8 py-3 text-sm sm:text-base md:text-lg w-full h-10 sm:h-12 md:h-14 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
              onClick={handleExplorePackages}
            >
              {getContentValue('primary_button', 'Start your journey')}
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-border hover:bg-secondary hover:text-foreground px-4 sm:px-6 md:px-8 py-3 text-sm sm:text-base md:text-lg w-full h-10 sm:h-12 md:h-14 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105"
              onClick={handlePlanCustomTrip}
            >
              {getContentValue('secondary_button', 'Plan custom trip')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;