import { useState, useEffect, Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, MapPin, Users, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOptimizedContentValue } from "@/hooks/useOptimizedContent"
import { useToast } from "@/hooks/use-toast";
import { useSearchData } from "@/hooks/useSearchData";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";

const ParticleField = lazy(() => import("@/components/three/ParticleField"));

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { searchCountry, searchRegion, loading } = useSearchData();
  const { isMobile, optimizedSettings } = useMobileOptimization({ mobileLayoutMode: 'compact' });
  
  const { data: heroTitle } = useOptimizedContentValue('homepage', 'hero_title', 'Discover Amazing Travel Destinations')
  const { data: journeyDescription } = useOptimizedContentValue('homepage', 'journey_description', 'Contact us today and let our expert travel consultants help you plan the perfect trip tailored to your preferences and budget.')

  useEffect(() => { setIsVisible(true); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toLowerCase();
    
    const matchedRegion = searchRegion(query);
    if (matchedRegion) { navigate(matchedRegion.path); setSearchQuery(""); return; }
    
    const matchedCountry = searchCountry(query);
    if (matchedCountry) { navigate(`/regions/${matchedCountry.region}/country/${matchedCountry.slug}`); setSearchQuery(""); return; }
    
    toast({ title: "No packages available", description: `Sorry, we don't have packages for "${searchQuery}" at the moment.`, variant: "destructive" });
    navigate(`/packages?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  const stats = [
    { icon: MapPin, value: "50+", label: "Destinations" },
    { icon: Users, value: "10K+", label: "Travelers" },
    { icon: Star, value: "4.8", label: "Rating" },
    { icon: Calendar, value: "5+", label: "Years" },
  ];

  return (
    <div className="relative">
      {/* Hero Section with Particles */}
      <section className="relative min-h-[85vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary/50 via-background to-secondary/30">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover opacity-20">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/60" />
        </div>

        {/* 3D Particles */}
        <Suspense fallback={null}>
          <ParticleField className="z-[1] opacity-60" />
        </Suspense>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern z-[2]" />
        
        {/* Mesh gradient */}
        <div className="absolute inset-0 mesh-background z-[2]" />

        {/* Content */}
        <div className={`relative z-10 text-center max-w-5xl mx-auto ${isMobile ? 'px-4 pt-12' : 'px-6 sm:px-8'}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-6 sm:mb-8"
            >
              <Badge className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors px-4 py-1.5 text-sm backdrop-blur-sm">
                <Star className="h-3.5 w-3.5 mr-2 fill-primary text-primary" />
                Trusted by 10,000+ Travelers
              </Badge>
            </motion.div>

            {/* Headline */}
            <h1 className="text-hero font-bold tracking-tight mb-4 sm:mb-6 leading-[1.1]">
              <span className="text-foreground">Discover </span>
              <span className="gradient-text">Amazing</span>
              <br />
              <span className="text-foreground">Travel Destinations</span>
            </h1>

            <p className="text-subtitle text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              {isMobile ? 'Handpicked travel packages with expert guides.' : 'Explore handpicked travel packages and create unforgettable memories with expert guides worldwide.'}
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative glass rounded-2xl p-2">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={loading ? "Loading..." : "Search destinations or countries..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={loading}
                      className="pl-12 h-12 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:ring-0 text-base"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading || !searchQuery.trim()}
                    className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                  >
                    {isMobile ? "Go" : "Search"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>

            {/* Quick Destinations */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {["Asia", "Europe", "Africa", "Americas"].map((region) => (
                <Button
                  key={region}
                  variant="ghost"
                  onClick={() => navigate(`/regions/${region.toLowerCase()}`)}
                  className="text-sm text-foreground/60 hover:text-primary border border-border/50 hover:border-primary/30 rounded-full px-5 py-2 h-auto transition-all duration-300 hover:bg-primary/5"
                >
                  {region}
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center mb-10">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 px-8"
                onClick={() => navigate('/packages')}
              >
                Explore Packages
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-border/50 text-foreground/80 hover:text-foreground hover:bg-secondary/50 hover:border-primary/30 rounded-xl font-semibold transition-all duration-300 px-8"
                onClick={() => navigate('/contact')}
              >
                Custom Trip
                <Users className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-6 sm:gap-10"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <stat.icon className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">{stat.value}</span>
                <span>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 border border-foreground/20 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-primary rounded-full mt-2"
              />
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Hero;
