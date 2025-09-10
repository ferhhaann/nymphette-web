import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeaturedPackages = () => {
  const navigate = useNavigate();
  
  const getContentValue = (key: string, defaultValue: string) => defaultValue;

  // Simple fallback packages
  const packages = [
    {
      id: "japan-cherry-blossom",
      title: "Japan Cherry Blossom Tour",
      country: "Japan",
      region: "Asia",
      duration: "10 days",
      price: "₹85,000",
      originalPrice: "₹95,000",
      rating: 4.8,
      reviews: 156,
      image: "/places/japan/tokyo.jpg",
      highlights: ["Cherry Blossom Viewing", "Tokyo & Kyoto", "Traditional Ryokan Stay"],
      category: "Cultural",
      featured: true
    },
    {
      id: "bali-paradise",
      title: "Bali Paradise Escape",
      country: "Indonesia",
      region: "Asia", 
      duration: "7 days",
      price: "₹45,000",
      rating: 4.7,
      reviews: 89,
      image: "/places/indonesia/bali.jpg",
      highlights: ["Beach Resorts", "Cultural Temples", "Volcanic Landscapes"],
      category: "Beach",
      featured: true
    },
    {
      id: "maldives-honeymoon",
      title: "Maldives Honeymoon Package",
      country: "Maldives",
      region: "Asia",
      duration: "5 days",
      price: "₹125,000",
      rating: 4.9,
      reviews: 234,
      image: "/places/maldives/overwater-villas.jpg",
      highlights: ["Overwater Villas", "Private Beach", "Spa Treatments"],
      category: "Luxury",
      featured: true
    }
  ];

  if (packages.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">Featured Travel Packages</h2>
          <p className="text-center text-muted-foreground">No featured packages available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground font-geo">
            {getContentValue('title', 'Featured Travel Packages')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {getContentValue('subtitle', 'Discover our handpicked selection of premium travel experiences, crafted to deliver unforgettable memories across the world\'s most captivating destinations.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <Card 
              key={pkg.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-primary text-primary-foreground shadow-lg">
                    Featured
                  </Badge>
                </div>
                {pkg.originalPrice && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive" className="bg-red-500 text-white shadow-lg">
                      Save ₹{parseInt(pkg.originalPrice.replace('₹', '').replace(',', '')) - parseInt(pkg.price.replace('₹', '').replace(',', ''))}
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{pkg.rating}</span>
                    <span className="text-muted-foreground">({pkg.reviews} reviews)</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {pkg.category}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {pkg.title}
                </h3>
                
                <div className="flex items-center text-muted-foreground mb-4 space-x-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{pkg.country}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{pkg.duration}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {pkg.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {pkg.originalPrice}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-primary">
                      {pkg.price}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    per person
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105"
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
            variant="outline" 
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 px-8 py-3"
            onClick={() => navigate('/packages')}
          >
            View All Packages
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;