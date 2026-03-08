import { Shield, Award, Headphones, Heart, MapPin, Star, Globe, Plane } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { Suspense, lazy } from "react";

const GlobeScene = lazy(() => import("@/components/three/GlobeScene"));

const WhyChooseUs = () => {
  const { getContentValue } = useContent('why-choose-us');
  const { isMobile } = useMobileOptimization({ mobileLayoutMode: 'compact' });

  const features = [
    { icon: Shield, title: "100% Secure", description: "Travel with confidence — your safety is our highest priority.", color: "primary" },
    { icon: Headphones, title: "24/7 Support", description: "Round-the-clock assistance wherever you are in the world.", color: "accent" },
    { icon: Award, title: "Expert Team", description: "Professional specialists with deep destination knowledge.", color: "primary" },
    { icon: Heart, title: "Premium Care", description: "Curated luxury experiences tailored to your preferences.", color: "accent" },
  ];

  const stats = [
    { value: "50K+", label: "Travelers" },
    { value: "25+", label: "Years" },
    { value: "98%", label: "Satisfaction" },
    { value: "150+", label: "Countries" },
  ];

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 mesh-background" />
      
      {/* 3D Globe - Right side on desktop */}
      {!isMobile && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-30">
          <Suspense fallback={null}>
            <GlobeScene className="w-full h-full" />
          </Suspense>
        </div>
      )}

      <div className="container relative z-10">
        <ScrollReveal className={`text-center ${isMobile ? 'mb-12' : 'mb-16'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            {getContentValue('title', 'Why Choose Us?')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Excellence in every journey, trusted worldwide
          </p>
        </ScrollReveal>

        {/* Features */}
        <StaggerContainer className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-4 gap-6'} ${isMobile ? 'mb-12' : 'mb-20'}`}>
          {features.slice(0, isMobile ? 2 : 4).map((feature, index) => (
            <StaggerItem key={index}>
              <div className="futuristic-card rounded-2xl p-6 sm:p-8 text-center group">
                <div className={`mx-auto ${isMobile ? 'w-14 h-14 mb-4' : 'w-16 h-16 mb-6'} rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                  feature.color === 'primary' 
                    ? 'bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/20' 
                    : 'bg-accent/10 border border-accent/20 group-hover:bg-accent/20 group-hover:shadow-lg group-hover:shadow-accent/20'
                }`}>
                  <feature.icon className={`${isMobile ? 'h-7 w-7' : 'h-8 w-8'} ${feature.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                </div>
                <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-foreground mb-2`}>
                  {feature.title}
                </h3>
                {!isMobile && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Stats */}
        <ScrollReveal>
          <div className="glass rounded-2xl sm:rounded-3xl p-8 sm:p-12 glow-border">
            <div className={`grid ${isMobile ? 'grid-cols-2 gap-8' : 'grid-cols-4 gap-12'} text-center`}>
              {stats.slice(0, isMobile ? 2 : 4).map((stat, index) => (
                <div key={index}>
                  <div className={`${isMobile ? 'text-3xl' : 'text-4xl lg:text-5xl'} font-bold gradient-text mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default WhyChooseUs;
