import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Globe, Users, Award, Shield, MapPin, Calendar, Star, Plane } from "lucide-react";

const SEOContent = () => {
  const navigate = useNavigate();

  const destinations = [
    { name: "Japan", region: "Asia", packages: 15, image: "/places/japan/tokyo.jpg" },
    { name: "Thailand", region: "Asia", packages: 12, image: "/places/thailand/bangkok.jpg" },
    { name: "Indonesia", region: "Asia", packages: 10, image: "/places/indonesia/bali.jpg" },
    { name: "UAE", region: "Middle East", packages: 8, image: "/places/uae/burj-khalifa.jpg" },
    { name: "Maldives", region: "Pacific", packages: 6, image: "/places/maldives/overwater-villas.jpg" },
    { name: "Kenya", region: "Africa", packages: 5, image: "/places/kenya/masai-mara.jpg" }
  ];

  const travelTypes = [
    { name: "Group Tours", description: "Join fellow travelers for guided adventures", icon: Users },
    { name: "Custom Packages", description: "Personalized itineraries tailored to you", icon: MapPin },
    { name: "Luxury Travel", description: "Premium experiences with 5-star accommodations", icon: Award },
    { name: "Adventure Tours", description: "Thrilling activities and outdoor exploration", icon: Globe }
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Travel Expertise Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
            Premium Travel Experiences Worldwide
          </h2>
          <div className="prose prose-lg max-w-4xl mx-auto text-muted-foreground">
            <p className="text-lg leading-relaxed mb-6">
              Nymphette Tours specializes in creating extraordinary travel experiences across Asia, Europe, Africa, Americas, Pacific Islands, and the Middle East. Our expertly curated travel packages combine authentic cultural immersion with premium accommodations and professional guidance.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              With over 50 destinations and partnerships with local experts worldwide, we offer comprehensive travel solutions including group tours, custom itineraries, luxury packages, and adventure expeditions. Our dedicated team provides 24/7 support from initial planning through your safe return home.
            </p>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            Popular Travel Destinations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {destinations.map((destination, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{destination.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{destination.region}</p>
                  <p className="text-xs text-primary font-medium">{destination.packages} packages</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Travel Types */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            Types of Travel Experiences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {travelTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <type.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h4 className="text-lg font-semibold text-foreground mb-2">{type.name}</h4>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            Comprehensive Travel Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <Plane className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h4 className="text-lg font-semibold mb-2">Flight Arrangements</h4>
              <p className="text-muted-foreground">Best airfare deals and convenient flight schedules worldwide</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h4 className="text-lg font-semibold mb-2">Travel Insurance</h4>
              <p className="text-muted-foreground">Comprehensive coverage for medical emergencies and trip protection</p>
            </div>
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h4 className="text-lg font-semibold mb-2">Flexible Booking</h4>
              <p className="text-muted-foreground">Easy rescheduling and payment plans to suit your needs</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Ready to Start Your Journey?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of travel packages or contact our expert team to create a custom itinerary perfectly tailored to your dreams and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/packages')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Explore All Packages
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/contact')}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Plan Custom Trip
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SEOContent;