import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Star, Clock, Users, MapPin } from "lucide-react";
import { useOptimizedFeaturedPackages } from "@/hooks/useOptimizedPackages";
import { useOptimizedContent } from "@/hooks/useOptimizedContent";
import { useNavigate } from "react-router-dom";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";

const FeaturedPackages = () => {
  const { data: packages, loading } = useOptimizedFeaturedPackages();
  const { getContentValue } = useOptimizedContent('featured-packages');
  const navigate = useNavigate();
  const { isMobile, optimizedSettings } = useMobileOptimization({ mobileLayoutMode: 'compact' });
  
  // Already filtered to featured packages from hook


  if (loading) {
    return (
      <section className={`${optimizedSettings.mobileLayout.sectionPadding || 'py-20'} bg-background`}>
        <div className={`max-w-7xl mx-auto ${optimizedSettings.containerPadding}`}>
          <h2 className={`${optimizedSettings.sectionTitle} font-bold text-center mb-4 text-foreground`}>
            {isMobile ? 'Featured Packages' : 'Featured Travel Packages'}
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${optimizedSettings.mobileLayout.sectionPadding || 'pt-6 sm:pt-8 md:pt-10'} bg-background`}>
      <div className={`max-w-7xl mx-auto ${optimizedSettings.containerPadding}`}>
        <div className={`text-center ${isMobile ? 'mb-4' : 'mb-6 sm:mb-8'}`}>
          <h2 className={`${optimizedSettings.sectionTitle} font-bold font-sans text-foreground ${isMobile ? 'mb-2' : 'mb-4'}`}>
            {getContentValue('title', isMobile ? 'Featured Packages' : 'Featured Travel Packages')}
          </h2>
          <p className={`${optimizedSettings.bodyText} text-muted-foreground max-w-2xl mx-auto`}>
            {getContentValue('subtitle', isMobile ? 'Handpicked destinations for unforgettable journeys' : 'Handpicked destinations and experiences crafted for unforgettable journeys')}
          </p>
        </div>

        <div className={`grid ${optimizedSettings.gridCols} ${optimizedSettings.gap}`}>
          {packages?.map((pkg, index) => (
            <Card 
              key={pkg.id}
              className="group overflow-hidden bg-card hover:shadow-card-soft transition-all duration-300 border border-border"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className={`relative overflow-hidden ${isMobile ? 'rounded-lg' : 'rounded-lg'} ${optimizedSettings.cardHeight || 'h-48 sm:h-56 md:h-64'}`}>
                <OptimizedImage
                  src={pkg.image}
                  alt={`${pkg.title} - ${pkg.country} travel package`}
                  priority={index < 3}
                  preloadSources={packages?.slice(index + 1, index + 3).map(p => p.image) || []}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute ${isMobile ? 'top-2 left-2' : 'top-4 left-4'}`}>
                  <Badge variant="secondary" className={`bg-foreground text-background ${isMobile ? 'text-xs px-2 py-0.5' : ''}`}>
                    {pkg.category}
                  </Badge>
                </div>
                <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} bg-background/90 backdrop-blur-sm rounded-full ${isMobile ? 'px-2 py-0.5' : 'px-3 py-1'}`}>
                  <div className="flex items-center space-x-1">
                    <Star className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{pkg.rating}</span>
                  </div>
                </div>
              </div>

              <CardContent className={`${optimizedSettings.cardPadding} pb-0`}>
                <h3 className={`${optimizedSettings.mobileLayout.titleSizes || 'text-2xl'} font-bold text-primary ${isMobile ? 'mb-1' : 'mb-2'}`}>{pkg.title}</h3>
                
                <div className={`flex items-center text-muted-foreground ${isMobile ? 'mb-2' : 'mb-4'}`}>
                  <MapPin className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
                  <span className={optimizedSettings.mobileLayout.textSizes}>{pkg.country}</span>
                </div>

                <div className={`flex items-center justify-between ${optimizedSettings.mobileLayout.textSizes || 'text-sm'} text-muted-foreground ${isMobile ? 'mb-1' : 'mb-2'}`}>
                  <div className="flex items-center">
                    <Clock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                    {isMobile ? 'Flexible' : pkg.groupSize || 'Flexible group size'}
                  </div>
                </div>

                {!isMobile && (
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Star className="h-4 w-4 mr-1" />
                    {pkg.rating} ({pkg.reviews} reviews)
                  </div>
                )}

                {/* Show only first 2 highlights on mobile, 4 on desktop */}
                <div className={`flex flex-wrap gap-1 ${isMobile ? 'mb-2' : 'mb-4'}`}>
                  {pkg.highlights.slice(0, isMobile ? 2 : 4).map((highlight, idx) => (
                    <Badge key={idx} variant="outline" className={`border-soft-blue text-deep-blue ${isMobile ? 'text-xs px-2 py-0.5' : ''}`}>
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className={`${optimizedSettings.cardPadding} pt-0 flex items-center justify-between`}>
                <div>
                  <span className={`${optimizedSettings.mobileLayout.textSizes || 'text-sm'} text-muted-foreground`}>
                    {isMobile ? 'From' : 'Starting from'}
                  </span>
                  <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-accent`}>
                    {pkg.price}
                  </div>
                </div>
                <Button 
                  size={isMobile ? "sm" : "default"}
                  className={`bg-foreground hover:bg-foreground/90 text-background ${optimizedSettings.minTouchTarget}`}
                  onClick={() => navigate(`/package/${pkg.id}`)}
                >
                  {isMobile ? 'View' : 'View Details'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className={`text-center ${isMobile ? 'mt-6' : 'mt-12'}`}>
          <Button 
            size={isMobile ? "default" : "lg"}
            variant="outline" 
            className={`border-foreground text-foreground hover:bg-foreground hover:text-background ${optimizedSettings.minTouchTarget}`}
            onClick={() => navigate('/packages')}
          >
            {isMobile ? 'All Packages' : 'Explore All Packages'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;