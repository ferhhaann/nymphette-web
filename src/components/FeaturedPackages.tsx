import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, MapPin } from "lucide-react";
import ImageSlideshow from "@/components/ImageSlideshow";
import packagesContent from "@/data/packagesContent.json";
// Individual country images
import japanImage from "@/assets/countries/japan.jpg";
import thailandImage from "@/assets/countries/thailand.jpg";
import indonesiaImage from "@/assets/countries/indonesia.jpg";
import franceImage from "@/assets/countries/france.jpg";
import italyImage from "@/assets/countries/italy.jpg";
import maldivesImage from "@/assets/countries/maldives.jpg";

const FeaturedPackages = () => {
  // Map countries to their respective images
  const getCountryImages = (destination: string) => {
    const destinationLower = destination.toLowerCase();
    if (destinationLower.includes('japan')) return [japanImage];
    if (destinationLower.includes('thailand') || destinationLower.includes('bali')) return [thailandImage, indonesiaImage];
    if (destinationLower.includes('france') || destinationLower.includes('paris') || destinationLower.includes('europe')) return [franceImage, italyImage];
    if (destinationLower.includes('maldives')) return [maldivesImage];
    if (destinationLower.includes('italy') || destinationLower.includes('rome')) return [italyImage];
    return [thailandImage]; // Default fallback
  };

  const packages = packagesContent.packages.featuredPackages.map((pkg, index) => ({
    id: index + 1,
    title: pkg.title,
    destination: pkg.destination,
    duration: pkg.duration,
    price: pkg.price,
    rating: pkg.rating,
    reviews: 124, // Default value since not in JSON
    images: getCountryImages(pkg.destination),
    highlights: ["Premium Experience", "Best Value", "Highly Rated"], // Default highlights
    category: pkg.region
  }));

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-sans text-foreground mb-4">
            Featured Travel Packages
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked destinations and experiences crafted for unforgettable journeys
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <Card 
              key={pkg.id}
              className="group overflow-hidden bg-card hover:shadow-card-soft transition-all duration-300 border border-border"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <ImageSlideshow
                  images={pkg.images}
                  alt={`${pkg.title} - ${pkg.destination} travel package`}
                  width="400"
                  height="256"
                  className="w-full h-64 group-hover:scale-110 transition-transform duration-500"
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
                  <span>{pkg.destination}</span>
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
                  <div className="text-2xl font-bold text-accent">{pkg.price}</div>
                </div>
                <Button className="bg-foreground hover:bg-foreground/90 text-background">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background">
            Explore All Packages
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;