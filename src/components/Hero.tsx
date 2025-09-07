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
    <section className="relative min-h-[70vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-x-3 sm:inset-x-6 md:inset-x-8 bottom-3 sm:bottom-6 md:bottom-8 top-16 sm:top-20 md:top-24 rounded-2xl sm:rounded-3xl overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 text-center text-background max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-sans tracking-tight mb-4 sm:mb-6 animate-fade-in leading-tight">
            {getContentValue('title', 'Discover your next adventure')}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-background/90 animate-slide-up leading-relaxed px-2 max-w-4xl mx-auto">
            {getContentValue('subtitle', 'Premium travel packages, curated group tours, and custom trips to 50+ destinations worldwide. Expert planning with 24/7 support.')}
          </p>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8 animate-scale-in px-2 sm:px-0">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <Input
                    type="text"
                    placeholder="Where do you want to go?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 sm:h-14 bg-transparent border-none text-white placeholder:text-white/60 focus:ring-0 focus:ring-offset-0 text-base sm:text-lg"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-12 sm:h-14 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-white rounded-xl sm:rounded-r-xl sm:rounded-l-none font-semibold text-base sm:text-lg transition-all duration-200 hover:scale-105"
                >
                  <span className="hidden sm:inline">Search Packages</span>
                  <span className="sm:hidden">Search</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>

          {/* Quick Destinations */}
          <div className="mb-8 sm:mb-12 animate-fade-in">
            <p className="text-white/80 mb-3 sm:mb-4 text-sm sm:text-base">Popular Destinations:</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
              {quickDestinations.map((destination) => (
                <Button
                  key={destination.name}
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(destination.path)}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200 rounded-full px-3 sm:px-4 py-2 text-sm font-medium relative group"
                >
                  {destination.name}
                  {destination.popular && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-scale-in px-4 sm:px-0 mb-8 sm:mb-12">
            <Button 
              size="lg" 
              className="bg-foreground hover:bg-foreground/90 text-background px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto h-12 sm:h-14 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
              onClick={handleExplorePackages}
            >
              {getContentValue('primary_button', 'Start your journey')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-background/50 text-background hover:bg-background/10 px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto h-12 sm:h-14 rounded-xl transition-all duration-200 hover:scale-105"
              onClick={handlePlanCustomTrip}
            >
              {getContentValue('secondary_button', 'Plan custom trip')}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto animate-fade-in px-2">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white/80 group-hover:text-white transition-colors duration-200" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>

      {/* Floating Elements - Hidden on mobile */}
      <div className="absolute top-20 left-10 hidden lg:block animate-float">
        <div className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm" />
      </div>
      <div className="absolute bottom-32 right-16 hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm" />
      </div>
    </section>
  );
};

export default Hero;