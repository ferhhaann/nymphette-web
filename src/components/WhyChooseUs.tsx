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
      icon: Shield,
      title: isMobile ? "100% Safe" : "100% Safe & Secure",
      description: isMobile ? "Your safety is our priority" : "Travel with confidence knowing your safety and security are our highest priorities."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: isMobile ? "Always here to help" : "Round-the-clock assistance wherever you are in the world, ensuring peace of mind."
    },
    {
      icon: Award,
      title: isMobile ? "Expert Team" : "Expert Travel Team", 
      description: isMobile ? "Professional travel specialists" : "Professional travel specialists with deep destination knowledge and personalized service."
    },
    {
      icon: Heart,
      title: isMobile ? "Premium Care" : "Premium Experience",
      description: isMobile ? "Luxury service guaranteed" : "Curated luxury experiences tailored to your preferences with attention to every detail."
    }
  ];

  // Mobile: Show only 2 top features, Desktop: Show all 4
  const topFeatures = [
    { icon: Plane, text: isMobile ? "Pickup" : "Airport Pickup" },
    { icon: Star, text: isMobile ? "5-Star" : "5-Star Service" },
    { icon: MapPin, text: "Expert Guides" },
    { icon: Globe, text: isMobile ? "500+ Places" : "500+ Destinations" }
  ];

  return (
    <section className={`relative ${optimizedSettings.mobileLayout.sectionPadding || 'py-20 md:py-28'} overflow-hidden`} style={{ backgroundColor: '#f5f5f5' }}>
      
      <div className={`relative ${optimizedSettings.containerPadding || 'container mx-auto px-4'}`}>
        
        {/* Clean Header */}
        <div className={`text-center ${isMobile ? 'mb-12' : 'mb-20'}`}>
          <h2 className={`${optimizedSettings.sectionTitle} font-bold text-black ${isMobile ? 'mb-4' : 'mb-6'} animate-fade-in`}>
            {getContentValue('title', isMobile ? 'Why Choose Us?' : 'Why Choose Nymphette Tours?')}
          </h2>
          
          {!isMobile && (
            <p className="text-xl text-black/60 max-w-2xl mx-auto font-light animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              Excellence in every journey
            </p>
          )}
        </div>

        {/* Simplified Features - Clean Cards */}
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-6' : 'grid-cols-4 gap-8'} ${isMobile ? 'mb-16' : 'mb-24'}`}>
          {features.slice(0, isMobile ? 2 : 4).map((feature, index) => (
            <div 
              key={index}
              className={`group text-center animate-scale-in`}
              style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: 'both' }}
            >
              {/* Icon Circle */}
              <div className={`mx-auto ${isMobile ? 'w-16 h-16 mb-4' : 'w-20 h-20 mb-6'} bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} text-white`} />
              </div>
              
              {/* Title */}
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-black ${isMobile ? 'mb-2' : 'mb-3'}`}>
                {feature.title}
              </h3>
              
              {/* Description - Only on desktop */}
              {!isMobile && (
                <p className="text-black/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Minimal Stats Row */}
        <div className="relative">
          <div className={`bg-white/60 backdrop-blur-sm ${isMobile ? 'rounded-2xl py-8' : 'rounded-3xl py-12'} border border-black/5`}>
            <div className={`grid ${isMobile ? 'grid-cols-2 gap-8' : 'grid-cols-4 gap-12'} text-center`}>
              {[
                { value: "50K+", label: "Travelers" },
                { value: "25+", label: "Years" },
                ...(isMobile ? [] : [
                  { value: "98%", label: "Satisfaction" },
                  { value: "150+", label: "Countries" }
                ])
              ].map((stat, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${700 + index * 100}ms`, animationFillMode: 'both' }}>
                  <div className={`${isMobile ? 'text-3xl' : 'text-4xl lg:text-5xl'} font-bold text-black mb-2`}>
                    {stat.value}
                  </div>
                  <div className={`text-black/60 ${isMobile ? 'text-sm' : 'text-base'} font-medium uppercase tracking-wider`}>
                    {stat.label}
                  </div>
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