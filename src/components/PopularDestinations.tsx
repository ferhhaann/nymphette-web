import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      <section className="section-padding bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-hero font-geo mb-4 text-foreground">
              Popular Travel Destinations
            </h2>
            <p className="text-subtitle text-muted-foreground max-w-3xl mx-auto">
              Loading amazing destinations...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-20"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-hero font-geo mb-4 text-foreground animate-fade-in">
            {getContentValue('title', 'Popular Travel Destinations')}
          </h2>
          <p className="text-subtitle text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            {getContentValue('subtitle', 'Discover our most loved destinations with carefully curated travel packages')}
          </p>
        </div>

        {destinations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No destinations available at the moment.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons */}
            {destinations.length > itemsPerView && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={nextSlide}
                  disabled={currentIndex + itemsPerView >= destinations.length}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Destinations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              {visibleDestinations.map((destination, index) => (
                <Card 
                  key={destination.id}
                  className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 travel-card"
                  onClick={() => handleDestinationClick(destination)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {destination.hero_image_url ? (
                      <img
                        src={destination.hero_image_url}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-primary" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300" />
                    
                    {/* Package Count Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        {destination.package_count} {destination.package_count === 1 ? 'Package' : 'Packages'}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-200">
                      {destination.name}
                    </h3>
                    <p className="text-muted-foreground text-sm capitalize">
                      {destination.region}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Dots */}
            {destinations.length > itemsPerView && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: Math.ceil(destinations.length / itemsPerView) }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      Math.floor(currentIndex / itemsPerView) === index
                        ? 'bg-primary'
                        : 'bg-border hover:bg-primary/50'
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