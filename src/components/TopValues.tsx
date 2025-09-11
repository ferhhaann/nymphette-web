import { Plane, CalendarCheck, BadgePercent, Map, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    icon: Plane,
    title: "Airport pickup",
    desc: "Seamless transfers on arrival",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: CalendarCheck,
    title: "Easy booking",
    desc: "Flexible dates and payments",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    icon: BadgePercent,
    title: "Exclusive deals",
    desc: "Best value packages",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    icon: Map,
    title: "Expert guides",
    desc: "Curated local experiences",
    gradient: "from-orange-500 to-red-400",
  },
];

const TopValues = () => {
  return (
    <section aria-label="Top values for you" className="relative py-20 bg-gradient-to-br from-background via-secondary/30 to-primary/5 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with enhanced styling */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Premium Experience</span>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-geo mb-6 bg-gradient-to-r from-primary via-bright-blue to-primary bg-clip-text text-transparent">
            Why Choose Nymphette Tours
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience unparalleled service and unforgettable journeys with our premium travel solutions
          </p>
        </div>

        {/* Enhanced grid with cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map(({ icon: Icon, title, desc, gradient }, index) => (
            <Card 
              key={title} 
              className="group relative bg-background/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in hover:-translate-y-2 overflow-hidden"
              style={{ 
                animationDelay: `${index * 0.15}s`, 
                animationFillMode: 'both' 
              }}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <CardContent className="relative p-8 text-center">
                {/* Enhanced icon */}
                <div className={`relative mx-auto mb-6 h-16 w-16 rounded-xl bg-gradient-to-br ${gradient} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="h-full w-full rounded-xl bg-background flex items-center justify-center">
                    <Icon className="h-8 w-8 text-foreground group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {desc}
                </p>
                
                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-3 border border-primary/20">
            <span className="text-primary font-medium">✨ Join 50,000+ Happy Travelers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopValues;
