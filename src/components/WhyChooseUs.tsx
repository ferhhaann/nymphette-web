import { Shield, Award, Headphones, Globe, Star, Heart, MapPin, Plane } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useContent } from "@/hooks/useContent";

const WhyChooseUs = () => {
  const { getContentValue } = useContent('why-choose-us');
  
  const features = [
    {
      icon: Globe,
      title: "500+ Destinations",
      description: "Explore breathtaking locations across all continents with our extensive network of trusted partners."
    },
    {
      icon: Award,
      title: "25+ Years Experience", 
      description: "Over two decades of crafting unforgettable travel experiences with industry expertise."
    },
    {
      icon: Shield,
      title: "100% Safe & Secure",
      description: "Travel with confidence knowing your safety and security are our highest priorities."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock assistance wherever you are in the world, ensuring peace of mind."
    }
  ];

  const topFeatures = [
    { icon: Plane, text: "Airport Pickup" },
    { icon: MapPin, text: "Expert Guides" },
    { icon: Heart, text: "Premium Care" },
    { icon: Star, text: "5-Star Service" }
  ];

  return (
    <section className="relative section-padding overflow-hidden bg-primary text-primary-foreground">
      {/* Subtle background pattern using design tokens */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary opacity-95"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-foreground/5 via-transparent to-primary-foreground/5"></div>
      </div>
      
      <div className="relative container">
        {/* Top feature badges using semantic tokens */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12">
          {topFeatures.map((feature, index) => (
            <div 
              key={feature.text}
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground font-medium shadow-lg hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-105 animate-fade-in text-xs sm:text-sm md:text-base"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              <feature.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              {feature.text}
            </div>
          ))}
        </div>

        <div className="text-center mb-16">
          <h2 className="text-hero font-geo mb-6 text-primary-foreground animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
            {getContentValue('title', 'Why Choose Nymphette Tours?')}
          </h2>
          <p className="text-subtitle text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
            {getContentValue('subtitle', 'We don\'t just plan trips – we create life-changing experiences that connect you with the world\'s most incredible destinations and cultures.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden bg-primary-foreground/5 backdrop-blur-xl border-primary-foreground/20 hover:bg-primary-foreground/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-scale-in travel-card"
              style={{ animationDelay: `${600 + index * 150}ms`, animationFillMode: 'both' }}
            >
              <CardContent className="relative card-padding text-center">
                <div className="bg-accent rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <feature.icon className="h-10 w-10 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary-foreground group-hover:text-primary-foreground transition-colors duration-300">{feature.title}</h3>
                <p className="text-primary-foreground/80 leading-relaxed text-lg group-hover:text-primary-foreground/90 transition-colors duration-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats section using semantic tokens */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary-foreground/5 rounded-3xl backdrop-blur-sm"></div>
          <div className="relative card-padding">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center animate-scale-in" style={{ animationDelay: '1200ms', animationFillMode: 'both' }}>
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-2">50,000+</div>
                <div className="text-primary-foreground/80 text-sm sm:text-base md:text-lg font-medium">Happy Travelers</div>
              </div>
              <div className="text-center animate-scale-in" style={{ animationDelay: '1350ms', animationFillMode: 'both' }}>
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-2">500+</div>
                <div className="text-primary-foreground/80 text-sm sm:text-base md:text-lg font-medium">Destinations</div>
              </div>
              <div className="text-center animate-scale-in" style={{ animationDelay: '1500ms', animationFillMode: 'both' }}>
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-2">98%</div>
                <div className="text-primary-foreground/80 text-sm sm:text-base md:text-lg font-medium">Satisfaction Rate</div>
              </div>
              <div className="text-center animate-scale-in" style={{ animationDelay: '1650ms', animationFillMode: 'both' }}>
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-2">25+</div>
                <div className="text-primary-foreground/80 text-sm sm:text-base md:text-lg font-medium">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;