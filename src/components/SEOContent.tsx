import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Globe, Users, Award, Shield, MapPin, Calendar, Star, Plane } from "lucide-react";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";

const SEOContent = () => {
  const navigate = useNavigate();
  const { isMobile, optimizedSettings } = useMobileOptimization({ mobileLayoutMode: 'compact' });

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


        {/* Travel Types - Redesigned for Mobile */}
        <div className={`${isMobile ? 'mb-12' : 'mb-20'}`}>
          <div className="text-center mb-12">
            <h3 className={`${optimizedSettings.sectionTitle} font-bold text-foreground ${isMobile ? 'mb-3' : 'mb-4'} animate-fade-in`}>
              Types of Travel Experiences
            </h3>
            {!isMobile && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                Choose your perfect adventure
              </p>
            )}
          </div>
          
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-4 gap-6'}`}>
            {travelTypes.map((type, index) => (
              <div
                key={index}
                className={`group text-center animate-scale-in`}
                style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: 'both' }}
              >
                {/* Icon Circle */}
                <div className={`mx-auto ${isMobile ? 'w-14 h-14 mb-3' : 'w-16 h-16 mb-4'} bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <type.icon className={`${isMobile ? 'h-7 w-7' : 'h-8 w-8'} text-primary-foreground`} />
                </div>
                
                {/* Title */}
                <h4 className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-foreground ${isMobile ? 'mb-1' : 'mb-2'}`}>
                  {type.name}
                </h4>
                
                {/* Description - Only on desktop or simplified on mobile */}
                <p className={`text-muted-foreground ${isMobile ? 'text-xs leading-tight' : 'text-sm leading-relaxed'}`}>
                  {isMobile ? type.name.includes('Group') ? 'Join guided tours' : 
                             type.name.includes('Custom') ? 'Personalized trips' :
                             type.name.includes('Luxury') ? 'Premium experiences' : 'Adventure activities'
                   : type.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Services Section - Redesigned for Mobile */}
        <div className={`${isMobile ? 'mb-12' : 'mb-20'}`}>
          <div className="text-center mb-12">
            <h3 className={`${optimizedSettings.sectionTitle} font-bold text-foreground ${isMobile ? 'mb-3' : 'mb-4'} animate-fade-in`}>
              Comprehensive Travel Services
            </h3>
            {!isMobile && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                Everything you need for the perfect journey
              </p>
            )}
          </div>
          
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-3 gap-8'}`}>
            {[
              { icon: Plane, title: "Flight Arrangements", description: isMobile ? "Best airfare deals worldwide" : "Best airfare deals and convenient flight schedules worldwide" },
              { icon: Shield, title: "Travel Insurance", description: isMobile ? "Complete trip protection" : "Comprehensive coverage for medical emergencies and trip protection" },
              { icon: Calendar, title: "Flexible Booking", description: isMobile ? "Easy rescheduling options" : "Easy rescheduling and payment plans to suit your needs" }
            ].map((service, index) => (
              <div
                key={index}
                className={`group ${isMobile ? 'flex items-start gap-4 p-4 bg-background/50 rounded-xl border border-border/50' : 'text-center'} animate-fade-in`}
                style={{ animationDelay: `${600 + index * 150}ms`, animationFillMode: 'both' }}
              >
                {/* Icon */}
                <div className={`${isMobile ? 'flex-shrink-0 w-12 h-12' : 'mx-auto w-16 h-16 mb-4'} bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300`}>
                  <service.icon className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-primary`} />
                </div>
                
                <div className={`${isMobile ? 'flex-1' : ''}`}>
                  {/* Title */}
                  <h4 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-foreground ${isMobile ? 'mb-1' : 'mb-2'}`}>
                    {service.title}
                  </h4>
                  
                  {/* Description */}
                  <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed`}>
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action - Mobile Optimized */}
        <div className="text-center">
          <h3 className={`${optimizedSettings.sectionTitle} font-bold text-foreground ${isMobile ? 'mb-3' : 'mb-4'} animate-fade-in`}>
            Ready to Start Your Journey?
          </h3>
          <p className={`text-muted-foreground ${isMobile ? 'mb-6 text-sm' : 'mb-8 text-lg'} max-w-2xl mx-auto animate-fade-in`} style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            {isMobile ? 'Browse packages or plan a custom trip' : 'Browse our extensive collection of travel packages or contact our expert team to create a custom itinerary perfectly tailored to your dreams and budget.'}
          </p>
          <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-col sm:flex-row gap-4'} justify-center animate-fade-in`} style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
            <Button 
              size={isMobile ? "default" : "lg"}
              onClick={() => navigate('/packages')}
              className={`bg-primary hover:bg-primary/90 text-primary-foreground ${isMobile ? 'rounded-lg' : ''} font-semibold transition-all duration-300 hover:scale-105`}
            >
              {isMobile ? 'View Packages' : 'Explore All Packages'}
            </Button>
            <Button 
              size={isMobile ? "default" : "lg"}
              variant="outline" 
              onClick={() => navigate('/contact')}
              className={`border-primary text-primary hover:bg-primary hover:text-primary-foreground ${isMobile ? 'rounded-lg' : ''} font-semibold transition-all duration-300 hover:scale-105`}
            >
              {isMobile ? 'Custom Trip' : 'Plan Custom Trip'}
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SEOContent;