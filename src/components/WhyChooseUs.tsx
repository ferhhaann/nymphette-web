import { Shield, Award, Headphones, Globe, Star, Heart, MapPin, Plane } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useContent } from "@/hooks/useContent";

const WhyChooseUs = () => {
  const { getContentValue } = useContent('why-choose-us');
  
  const features = [
    {
      icon: Globe,
      title: "500+ Destinations",
      description: "Explore breathtaking locations across all continents with our extensive network of trusted partners.",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Award,
      title: "25+ Years Experience",
      description: "Over two decades of crafting unforgettable travel experiences with industry expertise.",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "100% Safe & Secure",
      description: "Travel with confidence knowing your safety and security are our highest priorities.",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock assistance wherever you are in the world, ensuring peace of mind.",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const topFeatures = [
    { icon: Plane, text: "Airport Pickup", gradient: "from-sky-400 to-blue-500" },
    { icon: MapPin, text: "Expert Guides", gradient: "from-green-400 to-emerald-500" },
    { icon: Heart, text: "Premium Care", gradient: "from-red-400 to-pink-500" },
    { icon: Star, text: "5-Star Service", gradient: "from-yellow-400 to-orange-500" }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-deep-blue">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 animate-pulse"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top feature badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {topFeatures.map((feature, index) => (
            <div 
              key={feature.text}
              className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${feature.gradient} text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              <feature.icon className="h-4 w-4" />
              {feature.text}
            </div>
          ))}
        </div>

        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold font-geo mb-6 text-white animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
            {getContentValue('title', 'Why Choose Nymphette Tours?')}
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
            {getContentValue('subtitle', 'We don\'t just plan trips – we create life-changing experiences that connect you with the world\'s most incredible destinations and cultures.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-scale-in"
              style={{ animationDelay: `${600 + index * 150}ms`, animationFillMode: 'both' }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
              <CardContent className="relative p-8 text-center">
                <div className={`bg-gradient-to-br ${feature.gradient} rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed text-lg group-hover:text-white/90 transition-colors duration-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats section with enhanced design */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 rounded-3xl backdrop-blur-sm"></div>
          <div className="relative p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center animate-scale-in" style={{ animationDelay: '1200ms', animationFillMode: 'both' }}>
                <div className="text-5xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">50,000+</div>
                <div className="text-white/80 text-lg font-medium">Happy Travelers</div>
              </div>
              <div className="text-center animate-scale-in" style={{ animationDelay: '1350ms', animationFillMode: 'both' }}>
                <div className="text-5xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">500+</div>
                <div className="text-white/80 text-lg font-medium">Destinations</div>
              </div>
              <div className="text-center animate-scale-in" style={{ animationDelay: '1500ms', animationFillMode: 'both' }}>
                <div className="text-5xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">98%</div>
                <div className="text-white/80 text-lg font-medium">Satisfaction Rate</div>
              </div>
              <div className="text-center animate-scale-in" style={{ animationDelay: '1650ms', animationFillMode: 'both' }}>
                <div className="text-5xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">25+</div>
                <div className="text-white/80 text-lg font-medium">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;