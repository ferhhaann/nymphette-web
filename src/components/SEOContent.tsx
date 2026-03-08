import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Globe, Users, Award, Shield, MapPin, Calendar, Plane, ArrowRight } from "lucide-react";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";

const SEOContent = () => {
  const navigate = useNavigate();
  const { isMobile } = useMobileOptimization({ mobileLayoutMode: 'compact' });

  const travelTypes = [
    { name: "Group Tours", description: "Guided adventures with fellow travelers", icon: Users },
    { name: "Custom Packages", description: "Personalized itineraries for you", icon: MapPin },
    { name: "Luxury Travel", description: "Premium 5-star experiences", icon: Award },
    { name: "Adventure Tours", description: "Thrilling outdoor exploration", icon: Globe }
  ];

  const services = [
    { icon: Plane, title: "Flight Arrangements", description: "Best airfare deals worldwide" },
    { icon: Shield, title: "Travel Insurance", description: "Complete trip protection" },
    { icon: Calendar, title: "Flexible Booking", description: "Easy rescheduling options" }
  ];

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute inset-0 mesh-background" />
      
      <div className="container relative z-10">
        {/* Intro */}
        <ScrollReveal className="mb-16 sm:mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Premium Travel <span className="gradient-text">Worldwide</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Nymphette Tours specializes in extraordinary travel experiences across Asia, Europe, Africa, Americas, Pacific Islands, and the Middle East.
            </p>
            {!isMobile && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                With 50+ destinations and partnerships with local experts, we offer group tours, custom itineraries, luxury packages, and adventure expeditions with 24/7 support.
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Travel Types */}
        <ScrollReveal className="mb-16 sm:mb-20">
          <div className="text-center mb-10">
            <Badge className="bg-primary/10 text-primary border border-primary/30 mb-4 px-4 py-1">Experiences</Badge>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">Types of Travel</h3>
          </div>
          <StaggerContainer className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-4 gap-6'}`}>
            {travelTypes.map((type, index) => (
              <StaggerItem key={index}>
                <div className="futuristic-card rounded-2xl p-5 sm:p-6 text-center group">
                  <div className={`mx-auto ${isMobile ? 'w-12 h-12 mb-3' : 'w-14 h-14 mb-4'} bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300`}>
                    <type.icon className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} text-primary`} />
                  </div>
                  <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-foreground mb-1`}>{type.name}</h4>
                  {!isMobile && <p className="text-sm text-muted-foreground">{type.description}</p>}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </ScrollReveal>

        {/* Services */}
        <ScrollReveal className="mb-16 sm:mb-20">
          <div className="text-center mb-10">
            <Badge className="bg-accent/10 text-accent border border-accent/30 mb-4 px-4 py-1">Services</Badge>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">Comprehensive Travel Services</h3>
          </div>
          <StaggerContainer className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'}`}>
            {services.map((service, index) => (
              <StaggerItem key={index}>
                <div className={`futuristic-card rounded-2xl ${isMobile ? 'flex items-center gap-4 p-4' : 'p-6 text-center'}`}>
                  <div className={`${isMobile ? 'flex-shrink-0 w-12 h-12' : 'mx-auto w-14 h-14 mb-4'} bg-accent/10 rounded-xl border border-accent/20 flex items-center justify-center`}>
                    <service.icon className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} text-accent`} />
                  </div>
                  <div>
                    <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-foreground mb-1`}>{service.title}</h4>
                    <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>{service.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <div className="glass rounded-2xl sm:rounded-3xl p-8 sm:p-12 glow-border text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Ready to Start Your <span className="gradient-text">Journey</span>?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {isMobile ? 'Browse packages or plan a custom trip' : 'Browse our extensive collection or contact our expert team for a custom itinerary.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={() => navigate('/packages')} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold px-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25">
                Explore Packages <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')} className="border-border/50 text-foreground hover:bg-secondary/50 hover:border-primary/30 rounded-xl font-semibold px-8 transition-all duration-300">
                Plan Custom Trip
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SEOContent;
