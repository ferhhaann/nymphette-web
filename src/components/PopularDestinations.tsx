import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface CountryWithPackages {
  id: string;
  name: string;
  slug: string;
  region: string;
  hero_image_url: string | null;
  package_count: number;
}

const PopularDestinations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getContentValue } = useContent('popular-destinations');
  const [destinations, setDestinations] = useState<CountryWithPackages[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const itemsPerView = 4; // Show 4 cards at once

  useEffect(() => {
    fetchPopularDestinations();
  }, []);

  const fetchPopularDestinations = async () => {
    try {
      setLoading(true);
      
      // Fetch countries with package counts
      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select('id, name, slug, region, hero_image_url')
        .order('name');

      if (countriesError) throw countriesError;

      // Get package counts for each country
      const destinationsWithCounts = await Promise.all(
        (countriesData || []).map(async (country) => {
          const { count, error: countError } = await supabase
            .from('packages')
            .select('*', { count: 'exact', head: true })
            .eq('country_id', country.id);

          if (countError) {
            console.error('Error counting packages for country:', country.name, countError);
            return { ...country, package_count: 0 };
          }

          return { ...country, package_count: count || 0 };
        })
      );

      // Filter countries that have packages and sort by package count
      const popularDestinations = destinationsWithCounts
        .filter(dest => dest.package_count > 0)
        .sort((a, b) => b.package_count - a.package_count)
        .slice(0, 12); // Show top 12 destinations

      setDestinations(popularDestinations);
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      toast({
        title: "Error",
        description: "Failed to load popular destinations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= destinations.length ? 0 : prev + itemsPerView
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, destinations.length - itemsPerView) : Math.max(0, prev - itemsPerView)
    );
  };

  const handleDestinationClick = (destination: CountryWithPackages) => {
    navigate(`/regions/${destination.region.toLowerCase()}/country/${destination.slug}`);
  };

  const visibleDestinations = destinations.slice(currentIndex, currentIndex + itemsPerView);

  if (loading) {
    return (
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-geo text-foreground mb-4">
              Popular Travel Destinations
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Loading amazing destinations...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden border border-border bg-card">
                <div className="aspect-[5/4] bg-muted animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Discover
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-geo text-foreground mb-4 animate-fade-in">
            {getContentValue('title', 'Popular Travel Destinations')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            {getContentValue('subtitle', 'Discover our most loved destinations with carefully curated travel packages')}
          </p>
        </div>

        {destinations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No destinations available</h3>
            <p className="text-muted-foreground">Check back soon for exciting travel opportunities.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons */}
            {destinations.length > itemsPerView && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur-sm border-border hover:bg-secondary shadow-lg -ml-6"
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur-sm border-border hover:bg-secondary shadow-lg -mr-6"
                  onClick={nextSlide}
                  disabled={currentIndex + itemsPerView >= destinations.length}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Destinations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {visibleDestinations.map((destination, index) => (
                <Card 
                  key={destination.id}
                  className="group overflow-hidden cursor-pointer border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  onClick={() => handleDestinationClick(destination)}
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    {destination.hero_image_url ? (
                      <OptimizedImage
                        src={destination.hero_image_url}
                        alt={`${destination.name} destination`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300" />
                    
                    {/* Package Count Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge 
                        variant="secondary" 
                        className="bg-background/90 text-foreground font-medium shadow-sm backdrop-blur-sm border border-border/50"
                      >
                        {destination.package_count} {destination.package_count === 1 ? 'Package' : 'Packages'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 mb-1">
                          {destination.name}
                        </h3>
                        <p className="text-muted-foreground text-sm capitalize font-medium">
                          {destination.region}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>Explore destination</span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                          <ChevronRight className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Dots */}
            {destinations.length > itemsPerView && (
              <div className="flex justify-center mt-12 space-x-2">
                {Array.from({ length: Math.ceil(destinations.length / itemsPerView) }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      Math.floor(currentIndex / itemsPerView) === index
                        ? 'bg-primary w-8'
                        : 'bg-border hover:bg-muted-foreground'
                    }`}
                    onClick={() => setCurrentIndex(index * itemsPerView)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularDestinations;