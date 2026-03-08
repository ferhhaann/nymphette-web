import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OptimizedImage } from "@/components/ui/optimized-image";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";

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
  const itemsPerView = 4;

  useEffect(() => {
    fetchPopularDestinations();
    const channel = supabase.channel('packages-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, () => fetchPopularDestinations()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPopularDestinations = async () => {
    try {
      setLoading(true);
      const { data: countriesData, error } = await supabase.from('countries').select(`id, name, slug, region, hero_image_url, country_hero_images(image_url, alt_text)`).eq('is_popular', true).order('name');
      if (error) throw error;

      const destinationsWithCounts = await Promise.all(
        (countriesData || []).map(async (country: any) => {
          const { count } = await supabase.from('packages').select('*', { count: 'exact', head: true }).or(`country_id.eq.${country.id},country_slug.eq.${country.slug}`);
          let displayImage = country.hero_image_url;
          if (!displayImage && country.country_hero_images?.length > 0) displayImage = country.country_hero_images[0].image_url;
          return { ...country, package_count: count || 0, display_image: displayImage };
        })
      );

      setDestinations(destinationsWithCounts.sort((a, b) => b.package_count - a.package_count).slice(0, 12));
    } catch (error) {
      console.error('Error:', error);
      toast({ title: "Error", description: "Failed to load destinations", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => setCurrentIndex((prev) => prev + itemsPerView >= destinations.length ? 0 : prev + itemsPerView);
  const prevSlide = () => setCurrentIndex((prev) => prev === 0 ? Math.max(0, destinations.length - itemsPerView) : Math.max(0, prev - itemsPerView));
  const visibleDestinations = destinations.slice(currentIndex, currentIndex + itemsPerView);

  if (loading) {
    return (
      <section className="section-padding bg-background">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-foreground">Popular Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="futuristic-card rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] bg-secondary animate-pulse" />
                <div className="p-5"><div className="h-5 bg-secondary rounded mb-2 animate-pulse" /><div className="h-4 bg-secondary rounded w-20 animate-pulse" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute inset-0 mesh-background" />
      
      <div className="container relative z-10">
        <ScrollReveal className="text-center mb-12 sm:mb-16">
          <Badge className="bg-accent/10 text-accent border border-accent/30 mb-4 px-4 py-1">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Top Destinations
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            {getContentValue('title', 'Most Popular Destinations')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {getContentValue('subtitle', 'Explore our handpicked destinations loved by travelers worldwide')}
          </p>
        </ScrollReveal>

        {destinations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No destinations available</h3>
            <p className="text-muted-foreground">Check back soon.</p>
          </div>
        ) : (
          <div className="relative">
            {destinations.length > itemsPerView && (
              <>
                <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 z-10 glass border-border/50 hover:bg-secondary -ml-6 hidden lg:flex" onClick={prevSlide} disabled={currentIndex === 0}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 z-10 glass border-border/50 hover:bg-secondary -mr-6 hidden lg:flex" onClick={nextSlide} disabled={currentIndex + itemsPerView >= destinations.length}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleDestinations.map((destination) => (
                <StaggerItem key={destination.id}>
                  <div
                    className="futuristic-card rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => navigate(`/regions/${destination.region.toLowerCase()}/country/${destination.slug}`)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {destination.display_image ? (
                        <OptimizedImage src={destination.display_image} alt={`${destination.name}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <MapPin className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      
                      <div className="absolute top-3 right-3">
                        <Badge className="glass text-foreground text-xs border-0">
                          {destination.package_count} {destination.package_count === 1 ? 'Package' : 'Packages'}
                        </Badge>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {destination.name}
                        </h3>
                        <p className="text-foreground/60 text-sm capitalize">{destination.region}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {destinations.length > itemsPerView && (
              <div className="flex justify-center mt-10 space-x-2">
                {Array.from({ length: Math.ceil(destinations.length / itemsPerView) }).map((_, i) => (
                  <button key={i} className={`h-1.5 rounded-full transition-all duration-300 ${Math.floor(currentIndex / itemsPerView) === i ? 'bg-primary w-8' : 'bg-border w-1.5 hover:bg-muted-foreground'}`} onClick={() => setCurrentIndex(i * itemsPerView)} />
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
