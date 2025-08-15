import { Shield, Award, Headphones, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WhyChooseUs = () => {
  // TODO: Replace with API call - const features = await fetchWhyChooseUsFeatures();
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

  return (
    <section className="py-20 bg-gradient-to-br from-primary-dark to-deep-blue text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-geo mb-4">
            Why Choose Nymphette Tours?
          </h2>
          <p className="text-xl text-background/80 max-w-3xl mx-auto">
            We don't just plan trips – we create life-changing experiences that connect you 
            with the world's most incredible destinations and cultures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-background/10 backdrop-blur-md border-background/20 hover:bg-background/20 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-accent/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-background" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-background/80 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="animate-scale-in" style={{ animationDelay: '600ms' }}>
              <div className="text-4xl font-bold text-background mb-2">50,000+</div>
              <div className="text-background">Happy Travelers</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '700ms' }}>
              <div className="text-4xl font-bold text-background mb-2">500+</div>
              <div className="text-background">Destinations</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '800ms' }}>
              <div className="text-4xl font-bold text-background mb-2">98%</div>
              <div className="text-background">Satisfaction Rate</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '900ms' }}>
              <div className="text-4xl font-bold text-background mb-2">25+</div>
              <div className="text-background">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;