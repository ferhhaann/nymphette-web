import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Star, Clock, Users, MapPin } from "lucide-react";
import { useOptimizedFeaturedPackages } from "@/hooks/useOptimizedPackages";
import { useOptimizedContent } from "@/hooks/useOptimizedContent";
import { useNavigate } from "react-router-dom";

const FeaturedPackages = () => {
  const { data: packages, loading } = useOptimizedFeaturedPackages();
  const { getContentValue } = useOptimizedContent('featured-packages');
  const navigate = useNavigate();
  
  // Already filtered to featured packages from hook


  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-sans text-foreground mb-4">
            {getContentValue('title', 'Featured Travel Packages')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {getContentValue('subtitle', 'Handpicked destinations and experiences crafted for unforgettable journeys')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages?.map((pkg, index) => (
            <Card 
              key={pkg.id}
              className="group overflow-hidden bg-card hover:shadow-card-soft transition-all duration-300 border border-border"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <OptimizedImage
                  src={pkg.image}
                  alt={`${pkg.title} - ${pkg.country} travel package`}
                  priority={index < 3}
                  preloadSources={packages?.slice(index + 1, index + 3).map(p => p.image) || []}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-foreground text-background">
                    {pkg.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-2">{pkg.title}</h3>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{pkg.country}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {pkg.reviews} reviews
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {pkg.highlights.map((highlight, idx) => (
                    <Badge key={idx} variant="outline" className="border-soft-blue text-deep-blue">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">Starting from</span>
                  <div className="text-2xl font-bold text-accent">
                    {typeof pkg.price === 'string' ? 
                        pkg.price.replace(/[\$,]/g, '') : 
                        pkg.price}
                  </div>
                </div>
                <Button 
                  className="bg-foreground hover:bg-foreground/90 text-background"
                  onClick={() => navigate(`/package/${pkg.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-foreground text-foreground hover:bg-foreground hover:text-background"
            onClick={() => navigate('/packages')}
          >
            Explore All Packages
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;