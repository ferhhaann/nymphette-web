import { Shield, Award, Headphones, Globe, Star, Heart, MapPin, Plane } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useContent } from "@/hooks/useContent";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";

const WhyChooseUs = () => {
  const { getContentValue } = useContent('why-choose-us');
  const { isMobile, optimizedSettings } = useMobileOptimization({ mobileLayoutMode: 'compact' });
  
  // Mobile: Show only 2 key features, Desktop: Show all 4
  const features = [
    {
      icon: Globe,
      title: isMobile ? "500+ Places" : "500+ Destinations",
      description: isMobile ? "Global network of trusted partners" : "Explore breathtaking locations across all continents with our extensive network of trusted partners."
    },
    {
      icon: Award,
      title: isMobile ? "25+ Years" : "25+ Years Experience", 
      description: isMobile ? "Decades of travel expertise" : "Over two decades of crafting unforgettable travel experiences with industry expertise."
    },
    {
      icon: Shield,
      title: isMobile ? "100% Safe" : "100% Safe & Secure",
      description: isMobile ? "Your safety is our priority" : "Travel with confidence knowing your safety and security are our highest priorities."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: isMobile ? "Always here to help" : "Round-the-clock assistance wherever you are in the world, ensuring peace of mind."
    }
  ];

  // Mobile: Show only 2 top features, Desktop: Show all 4
  const topFeatures = [
    { icon: Plane, text: isMobile ? "Pickup" : "Airport Pickup" },
    { icon: Star, text: isMobile ? "5-Star" : "5-Star Service" },
    { icon: MapPin, text: "Expert Guides" },
    { icon: Heart, text: isMobile ? "Premium" : "Premium Care" }
  ];

  return (
    <section className={`relative ${optimizedSettings.mobileLayout.sectionPadding || 'section-padding'} overflow-hidden bg-primary text-primary-foreground`}>
      {/* Subtle background pattern - Simplified on mobile */}
      {!isMobile && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary opacity-95"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-foreground/5 via-transparent to-primary-foreground/5"></div>
        </div>
      )}
      
      <div className={`relative ${optimizedSettings.containerPadding || 'container'}`}>
        {/* Top feature badges - Show only 2 on mobile */}
        <div className={`flex flex-wrap justify-center ${optimizedSettings.gap} ${isMobile ? 'mb-4' : 'mb-8 sm:mb-12'}`}>
          {topFeatures.slice(0, isMobile ? 2 : 4).map((feature, index) => (
            <div 
              key={feature.text}
              className={`flex items-center ${optimizedSettings.gap} ${isMobile ? 'px-2 py-1.5' : 'px-3 sm:px-4 md:px-6 py-2 sm:py-3'} rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground font-medium shadow-lg hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-105 animate-fade-in ${isMobile ? 'text-xs' : 'text-xs sm:text-sm md:text-base'}`}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              <feature.icon className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
              {feature.text}
            </div>
          ))}
        </div>

        <div className={`text-center ${isMobile ? 'mb-6' : 'mb-16'}`}>
          <h2 className={`${optimizedSettings.sectionTitle} font-geo ${isMobile ? 'mb-2' : 'mb-6'} text-primary-foreground animate-fade-in`} style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
            {getContentValue('title', isMobile ? 'Why Choose Us?' : 'Why Choose Nymphette Tours?')}
          </h2>
          {!isMobile && (
            <p className="text-subtitle text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
              {getContentValue('subtitle', 'We don\'t just plan trips – we create life-changing experiences that connect you with the world\'s most incredible destinations and cultures.')}
            </p>
          )}
        </div>

        {/* Features - Show only 2 on mobile in a simpler layout */}
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'} ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16'}`}>
          {features.slice(0, isMobile ? 2 : 4).map((feature, index) => (
            <Card 
              key={index}
              className={`group relative overflow-hidden bg-primary-foreground/5 backdrop-blur-xl border-primary-foreground/20 hover:bg-primary-foreground/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-scale-in travel-card ${isMobile ? 'rounded-lg' : ''}`}
              style={{ animationDelay: `${600 + index * 150}ms`, animationFillMode: 'both' }}
            >
              <CardContent className={`relative ${isMobile ? 'p-3' : 'card-padding'} text-center`}>
                <div className={`bg-accent rounded-2xl ${isMobile ? 'w-10 h-10' : 'w-20 h-20'} flex items-center justify-center mx-auto ${isMobile ? 'mb-2' : 'mb-6'} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <feature.icon className={`${isMobile ? 'h-5 w-5' : 'h-10 w-10'} text-accent-foreground`} />
                </div>
                <h3 className={`${isMobile ? 'text-sm' : 'text-2xl'} font-bold ${isMobile ? 'mb-1' : 'mb-4'} text-primary-foreground group-hover:text-primary-foreground transition-colors duration-300`}>{feature.title}</h3>
                <p className={`text-primary-foreground/80 leading-relaxed ${isMobile ? 'text-xs' : 'text-lg'} group-hover:text-primary-foreground/90 transition-colors duration-300`}>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats section - Simplified for mobile */}
        <div className="relative">
          <div className={`absolute inset-0 bg-primary-foreground/5 ${isMobile ? 'rounded-xl' : 'rounded-3xl'} backdrop-blur-sm`}></div>
          <div className={`relative ${isMobile ? 'p-4' : 'card-padding'}`}>
            <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'}`}>
              {[
                { value: isMobile ? "50K+" : "50,000+", label: isMobile ? "Travelers" : "Happy Travelers" },
                { value: "500+", label: isMobile ? "Places" : "Destinations" },
                ...(isMobile ? [] : [
                  { value: "98%", label: "Satisfaction Rate" },
                  { value: "25+", label: "Years Experience" }
                ])
              ].map((stat, index) => (
                <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${1200 + index * 150}ms`, animationFillMode: 'both' }}>
                  <div className={`${isMobile ? 'text-xl' : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'} font-bold text-primary-foreground ${isMobile ? 'mb-1' : 'mb-2'}`}>{stat.value}</div>
                  <div className={`text-primary-foreground/80 ${isMobile ? 'text-xs' : 'text-sm sm:text-base md:text-lg'} font-medium`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;