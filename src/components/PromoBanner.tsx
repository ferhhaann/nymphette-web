import bannerImage from "@/assets/regions-world.jpg";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useOptimizedContentValue } from "@/hooks/useOptimizedContent"

const PromoBanner = () => {
  const navigate = useNavigate();
  const { data: promoDescription } = useOptimizedContentValue('homepage', 'promo_description', 'Discover curated destinations and exclusive offers designed just for you')
  return (
    <section className="section-padding bg-gradient-to-br from-background via-secondary/10 to-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl h-80 md:h-96 group">
          {/* Background with modern parallax effect */}
          <div className="absolute inset-0 overflow-hidden">
            <OptimizedImage 
              src={bannerImage} 
              alt="Scenic landscape" 
              className="w-full h-full group-hover:scale-105 transition-transform duration-700"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
          
          {/* Modern gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Content with modern layout */}
          <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
            <div className="max-w-3xl">
               <div className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
                 <Sparkles className="h-4 w-4 text-primary-foreground" />
                 <span className="text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                   Special Offer
                 </span>
               </div>
               
               <h3 className="text-3xl md:text-5xl font-bold mb-6 text-background animate-fade-in leading-tight" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                 Premium Travel Experiences Worldwide
               </h3>
               <p className="text-lg md:text-xl text-background/90 mb-8 animate-fade-in leading-relaxed" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                 {promoDescription}
               </p>
              
              {/* Modern CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg border-0"
                  onClick={() => navigate('/packages')}
                 >
                   <span>Explore Packages</span>
                   <ArrowRight className="ml-2 h-5 w-5" />
                 </Button>
                 <Button 
                   variant="outline" 
                   size="lg"
                   className="bg-background/10 border-2 border-background/30 text-background hover:bg-background hover:text-foreground px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                   onClick={() => navigate('/blog')}
                 >
                   Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
