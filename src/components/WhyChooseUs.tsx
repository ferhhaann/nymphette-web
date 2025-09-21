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
    <section className={`relative ${optimizedSettings.mobileLayout.sectionPadding || 'py-16 md:py-24'} overflow-hidden`} style={{ backgroundColor: '#f5f5f5' }}>
      {/* Modern geometric background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-black/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-black/5 to-transparent"></div>
        {!isMobile && (
          <>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-black/3 rounded-full blur-3xl"></div>
          </>
        )}
      </div>
      
      <div className={`relative ${optimizedSettings.containerPadding || 'container mx-auto px-4'}`}>
        {/* Header Section */}
        <div className={`text-center ${isMobile ? 'mb-8' : 'mb-16'}`}>
          <div className={`inline-flex items-center gap-2 ${isMobile ? 'mb-4 px-3 py-1.5' : 'mb-6 px-4 py-2'} bg-black/10 rounded-full border border-black/20`}>
            <Star className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-black`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-black/80`}>
              {isMobile ? 'Premium Service' : 'Why Choose Us'}
            </span>
          </div>
          
          <h2 className={`${optimizedSettings.sectionTitle} font-bold text-black ${isMobile ? 'mb-3' : 'mb-6'} animate-fade-in`}>
            {getContentValue('title', isMobile ? 'Why Choose Us?' : 'Why Choose Nymphette Tours?')}
          </h2>
          
          {!isMobile && (
            <p className="text-lg text-black/70 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              {getContentValue('subtitle', "We don't just plan trips – we create life-changing experiences that connect you with the world's most incredible destinations.")}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'} ${isMobile ? 'mb-8' : 'mb-16'}`}>
          {features.slice(0, isMobile ? 2 : 4).map((feature, index) => (
            <Card 
              key={index}
              className={`group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-black/10 hover:bg-white hover:border-black/20 transition-all duration-500 hover:scale-105 hover:shadow-xl animate-scale-in ${isMobile ? 'rounded-xl' : 'rounded-2xl'}`}
              style={{ animationDelay: `${400 + index * 150}ms`, animationFillMode: 'both' }}
            >
              <CardContent className={`relative ${isMobile ? 'p-4' : 'p-6'} text-center`}>
                <div className={`bg-black rounded-xl ${isMobile ? 'w-12 h-12' : 'w-16 h-16'} flex items-center justify-center mx-auto ${isMobile ? 'mb-3' : 'mb-4'} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <feature.icon className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
                </div>
                <h3 className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold ${isMobile ? 'mb-1' : 'mb-3'} text-black group-hover:text-black transition-colors duration-300`}>
                  {feature.title}
                </h3>
                <p className={`text-black/70 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'} group-hover:text-black/80 transition-colors duration-300`}>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Stats Section */}
        <div className="relative">
          <div className={`absolute inset-0 bg-black/5 ${isMobile ? 'rounded-xl' : 'rounded-3xl'} backdrop-blur-sm border border-black/10`}></div>
          <div className={`relative ${isMobile ? 'p-6' : 'p-8 md:p-12'}`}>
            {/* Achievement badges */}
            <div className={`flex flex-wrap justify-center ${optimizedSettings.gap} ${isMobile ? 'mb-6' : 'mb-8'}`}>
              {topFeatures.slice(0, isMobile ? 2 : 4).map((feature, index) => (
                <div 
                  key={feature.text}
                  className={`flex items-center ${optimizedSettings.gap} ${isMobile ? 'px-3 py-2' : 'px-4 py-2'} rounded-full bg-black/10 backdrop-blur-sm border border-black/20 text-black font-medium shadow-sm hover:bg-black/15 transition-all duration-300 hover:scale-105 animate-fade-in ${isMobile ? 'text-xs' : 'text-sm'}`}
                  style={{ animationDelay: `${800 + index * 100}ms`, animationFillMode: 'both' }}
                >
                  <feature.icon className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  {feature.text}
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className={`grid ${isMobile ? 'grid-cols-2 gap-6' : 'grid-cols-2 lg:grid-cols-4 gap-8'}`}>
              {[
                { value: isMobile ? "50K+" : "50,000+", label: isMobile ? "Travelers" : "Happy Travelers" },
                { value: "25+", label: isMobile ? "Years" : "Years Experience" },
                ...(isMobile ? [] : [
                  { value: "98%", label: "Satisfaction Rate" },
                  { value: "150+", label: "Countries Covered" }
                ])
              ].map((stat, index) => (
                <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${1000 + index * 150}ms`, animationFillMode: 'both' }}>
                  <div className={`${isMobile ? 'text-2xl' : 'text-4xl lg:text-5xl'} font-bold text-black ${isMobile ? 'mb-1' : 'mb-2'} bg-gradient-to-br from-black to-black/80 bg-clip-text`}>
                    {stat.value}
                  </div>
                  <div className={`text-black/70 ${isMobile ? 'text-xs' : 'text-sm lg:text-base'} font-medium uppercase tracking-wider`}>
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