import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, MapPin } from "lucide-react";
import { useFeaturedPackages } from "@/hooks/useFeaturedPackages";
import { useContentValue } from "@/hooks/useContent";
// Individual country images - 4 images per country
import japanImage from "@/assets/countries/japan.jpg";
import japan2Image from "@/assets/countries/japan-2.jpg";
import japan3Image from "@/assets/countries/japan-3.jpg";
import japan4Image from "@/assets/countries/japan-4.jpg";
import thailandImage from "@/assets/countries/thailand.jpg";
import thailand2Image from "@/assets/countries/thailand-2.jpg";
import thailand3Image from "@/assets/countries/thailand-3.jpg";
import thailand4Image from "@/assets/countries/thailand-4.jpg";
import indonesiaImage from "@/assets/countries/indonesia.jpg";
import indonesia2Image from "@/assets/countries/indonesia-2.jpg";
import indonesia3Image from "@/assets/countries/indonesia-3.jpg";
import indonesia4Image from "@/assets/countries/indonesia-4.jpg";
import franceImage from "@/assets/countries/france.jpg";
import france2Image from "@/assets/countries/france-2.jpg";
import france3Image from "@/assets/countries/france-3.jpg";
import france4Image from "@/assets/countries/france-4.jpg";
import italyImage from "@/assets/countries/italy.jpg";
import italy2Image from "@/assets/countries/italy-2.jpg";
import italy3Image from "@/assets/countries/italy-3.jpg";
import italy4Image from "@/assets/countries/italy-4.jpg";
import maldivesImage from "@/assets/countries/maldives.jpg";
import maldives2Image from "@/assets/countries/maldives-2.jpg";
import maldives3Image from "@/assets/countries/maldives-3.jpg";
import maldives4Image from "@/assets/countries/maldives-4.jpg";

const FeaturedPackages = () => {
  const { packages, loading } = useFeaturedPackages();
  const { value: sectionTitle } = useContentValue("featured-packages", "title", "Featured Travel Packages");
  const { value: sectionSubtitle } = useContentValue("featured-packages", "subtitle", "Handpicked destinations and experiences crafted for unforgettable journeys");
  
  // Already filtered to featured packages from hook

  // Map countries to their respective images - 4 images per destination
  const getCountryImages = (destination: string) => {
    const destinationLower = destination.toLowerCase();
    if (destinationLower.includes('japan')) return [japanImage, japan2Image, japan3Image, japan4Image];
    if (destinationLower.includes('thailand')) return [thailandImage, thailand2Image, thailand3Image, thailand4Image];
    if (destinationLower.includes('bali') || destinationLower.includes('indonesia')) return [indonesiaImage, indonesia2Image, indonesia3Image, indonesia4Image];
    if (destinationLower.includes('france') || destinationLower.includes('paris')) return [franceImage, france2Image, france3Image, france4Image];
    if (destinationLower.includes('europe') && !destinationLower.includes('france')) return [italyImage, italy2Image, italy3Image, italy4Image];
    if (destinationLower.includes('maldives')) return [maldivesImage, maldives2Image, maldives3Image, maldives4Image];
    if (destinationLower.includes('italy') || destinationLower.includes('rome')) return [italyImage, italy2Image, italy3Image, italy4Image];
    return [thailandImage, thailand2Image, thailand3Image, thailand4Image]; // Default fallback
  };

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
            {sectionTitle}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {sectionSubtitle}
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
                <img
                  src={pkg.image}
                  alt={`${pkg.title} - ${pkg.country} travel package`}
                  loading="lazy"
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