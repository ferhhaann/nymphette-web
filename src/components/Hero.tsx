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
  const { getContentValue } = useContent('homepage');

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
            
            <div className="mb-4 sm:mb-6 animate-fade-in">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors text-sm sm:text-base px-3 py-1">
                <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                Trusted by 10,000+ Travelers
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-sans tracking-tight mb-2 sm:mb-3 md:mb-4 animate-fade-in leading-tight">
              {getContentValue('hero_title', 'Discover Amazing Travel Destinations')}
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

      {/* Modern Enhanced Search and CTA Section */}
      <section className="relative bg-gradient-to-br from-background via-secondary/10 to-primary/5 py-20 sm:py-24 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--foreground), 0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          
          {/* Enhanced Search Section */}
          <div className="mb-16 animate-scale-in">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm rounded-full border border-primary/20 shadow-lg">
                <Search className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Start Your Journey
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text">
                Where would you like to go?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Discover amazing destinations through our curated travel packages
              </p>
            </div>
            
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative group">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 group-hover:opacity-70 animate-pulse"></div>
                
                {/* Main search container */}
                <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-3 shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent rounded-2xl"></div>
                      <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-primary z-10" />
                      <Input
                        type="text"
                        placeholder="Search destinations, countries, or experiences..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="relative z-10 pl-14 h-14 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:ring-0 text-lg font-medium"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="h-14 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-0"
                    >
                      Search
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Enhanced Quick Destinations */}
          <div className="mb-16 animate-fade-in">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Popular Destinations
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {quickDestinations.map((destination, index) => (
                <Button
                  key={destination.name}
                  variant="outline"
                  onClick={() => navigate(destination.path)}
                  className="relative h-14 border-2 border-border/30 hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 rounded-2xl font-semibold text-foreground group overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{destination.name}</span>
                  {destination.popular && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Enhanced Modern CTA Section */}
          <div className="animate-scale-in">
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Primary CTA */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-3xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                <Button 
                  size="lg" 
                  className="relative w-full h-16 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground rounded-3xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl border-0 overflow-hidden"
                  onClick={handleExplorePackages}
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <span>Explore Packages</span>
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </Button>
              </div>
              
              {/* Secondary CTA */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-secondary rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="relative w-full h-16 border-2 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 rounded-3xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg overflow-hidden"
                  onClick={handlePlanCustomTrip}
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <span>Custom Trip</span>
                    <Users className="h-6 w-6" />
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="font-medium">50+ Destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="font-medium">10K+ Happy Travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                <span className="font-medium">Expert Guides</span>
              </div>
            </div>

            {/* Ready to Start Journey Section */}
            <div className="mt-16 bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4 text-foreground">Ready to Start Your Journey?</h3>
              <p className="text-lg mb-6 text-muted-foreground max-w-2xl mx-auto">
                {getContentValue('journey_description', 'Contact us today and let our expert travel consultants help you plan the perfect trip tailored to your preferences and budget.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/contact')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
                >
                  Contact Us
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/packages')}
                  className="border-border/50 hover:bg-primary/10 font-semibold px-8"
                >
                  View All Packages
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;