import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MapPin, Sparkles, ArrowRight } from "lucide-react";
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
  display_image: string | null;
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
      
      // Fetch countries marked as popular with package counts and their hero images
      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select(`
          id, name, slug, region, hero_image_url,
          country_hero_images(image_url, alt_text)
        `)
        .eq('is_popular', true)
        .order('name');

      if (countriesError) throw countriesError;

      // Get package counts for each country and determine best image
      const destinationsWithCounts = await Promise.all(
        (countriesData || []).map(async (country: any) => {
          const { count, error: countError } = await supabase
            .from('packages')
            .select('*', { count: 'exact', head: true })
            .eq('country_id', country.id);

          if (countError) {
            console.error('Error counting packages for country:', country.name, countError);
            return { ...country, package_count: 0, display_image: country.hero_image_url };
          }

          // Use hero_image_url first, then check country_hero_images if available
          let displayImage = country.hero_image_url;
          if (!displayImage && country.country_hero_images && country.country_hero_images.length > 0) {
            displayImage = country.country_hero_images[0].image_url;
          }

          return { 
            ...country, 
            package_count: count || 0,
            display_image: displayImage
          };
        })
      );

      // Sort by package count and show all popular destinations
      const popularDestinations = destinationsWithCounts
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
    <section className="section-padding bg-gradient-to-b from-background to-secondary/20">
      <div className="container">
        {/* Modern Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Top Destinations
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in">
            {getContentValue('title', 'Most Popular Destinations')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            {getContentValue('subtitle', 'Explore our handpicked destinations loved by travelers worldwide')}
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
            {/* Navigation Buttons - Hidden on mobile */}
            {destinations.length > itemsPerView && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur-sm border-border hover:bg-secondary shadow-lg -ml-6 hidden lg:flex"
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur-sm border-border hover:bg-secondary shadow-lg -mr-6 hidden lg:flex"
                  onClick={nextSlide}
                  disabled={currentIndex + itemsPerView >= destinations.length}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Modern Destinations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleDestinations.map((destination, index) => (
                <div
                  key={destination.id}
                  className="group relative cursor-pointer animate-fade-in"
                  onClick={() => handleDestinationClick(destination)}
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                >
                  {/* Card with modern design */}
                  <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                    
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {destination.display_image ? (
                        <OptimizedImage
                          src={destination.display_image}
                          alt={`${destination.name} destination`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <MapPin className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                      
                      {/* Modern overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 group-hover:from-black/70 transition-all duration-300" />
                      
                      {/* Package count with modern badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-background/95 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1 rounded-full border border-border/50 shadow-lg">
                          {destination.package_count} {destination.package_count === 1 ? 'Package' : 'Packages'}
                        </div>
                      </div>

                      {/* Bottom content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-foreground transition-colors duration-200">
                          {destination.name}
                        </h3>
                        <p className="text-white/80 text-sm font-medium capitalize">
                          {destination.region}
                        </p>
                      </div>
                    </div>

                    {/* Hover effect indicator */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <ArrowRight className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
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