import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Star, Clock, Users, MapPin, ArrowRight } from "lucide-react";
import { useOptimizedFeaturedPackages } from "@/hooks/useOptimizedPackages";
import { useOptimizedContent } from "@/hooks/useOptimizedContent";
import { useNavigate } from "react-router-dom";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";

const FeaturedPackages = () => {
  const { data: packages, loading } = useOptimizedFeaturedPackages();
  const { getContentValue } = useOptimizedContent('featured-packages');
  const navigate = useNavigate();
  const { isMobile } = useMobileOptimization({ mobileLayoutMode: 'compact' });

  if (loading) {
    return (
      <section className="section-padding bg-background">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-foreground">Featured Packages</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 mesh-background" />
      
      <div className="container relative z-10">
        <ScrollReveal className="text-center mb-12 sm:mb-16">
          <Badge className="bg-primary/10 text-primary border border-primary/30 mb-4 px-4 py-1">
            Curated Experiences
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            {getContentValue('title', 'Featured Travel Packages')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {getContentValue('subtitle', 'Handpicked destinations and experiences crafted for unforgettable journeys')}
          </p>
        </ScrollReveal>

        <StaggerContainer className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8`}>
          {packages?.map((pkg) => (
            <StaggerItem key={pkg.id}>
              <div className="futuristic-card rounded-2xl overflow-hidden group cursor-pointer" onClick={() => navigate(`/package/${pkg.id}`)}>
                {/* Image */}
                <div className="relative h-52 sm:h-64 overflow-hidden">
                  <OptimizedImage
                    src={pkg.image}
                    alt={`${pkg.title} - ${pkg.country}`}
                    priority
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/90 text-primary-foreground text-xs backdrop-blur-sm">
                      {pkg.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 glass rounded-full px-3 py-1">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                      <span className="text-xs font-medium text-foreground">{pkg.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {pkg.title}
                  </h3>
                  
                  <div className="flex items-center text-muted-foreground mb-3 text-sm">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    <span>{pkg.country}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {pkg.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      {isMobile ? 'Flexible' : pkg.groupSize || 'Flexible'}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                      <Badge key={idx} variant="outline" className="border-border/50 text-muted-foreground text-xs bg-secondary/30">
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div>
                      <span className="text-xs text-muted-foreground">From</span>
                      <div className="text-xl font-bold gradient-text">{pkg.price}</div>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30 rounded-lg transition-all duration-300"
                    >
                      View Details
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal className="text-center mt-12" delay={0.3}>
          <Button 
            size="lg"
            variant="outline" 
            className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl font-semibold transition-all duration-300 px-8"
            onClick={() => navigate('/packages')}
          >
            Explore All Packages
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FeaturedPackages;
