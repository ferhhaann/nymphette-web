import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, MapPin } from "lucide-react";
import destinationsImage from "@/assets/destinations-collage.jpg";
import packagesContent from "@/data/packagesContent.json";

const FeaturedPackages = () => {
  const packages = packagesContent.packages.featuredPackages.map((pkg, index) => ({
    id: index + 1,
    title: pkg.title,
    destination: pkg.destination,
    duration: pkg.duration,
    price: pkg.price,
    rating: pkg.rating,
    reviews: 124, // Default value since not in JSON
    image: destinationsImage,
    highlights: ["Premium Experience", "Best Value", "Highly Rated"], // Default highlights
    category: pkg.region
  }));

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-playfair text-foreground mb-4">
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
              className="group overflow-hidden bg-card-gradient hover:shadow-travel transition-all duration-500 border-0 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  loading="lazy"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-accent text-white">
                    {pkg.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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
                <Button className="bg-accent hover:bg-bright-blue text-white">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
            Explore All Packages
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;