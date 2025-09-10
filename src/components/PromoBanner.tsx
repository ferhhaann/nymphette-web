import bannerImage from "@/assets/regions-world.jpg";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";

const PromoBanner = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-2xl overflow-hidden h-72 md:h-96">
          <img 
            src={bannerImage} 
            alt="Scenic landscape" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-foreground/40" />
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div className="max-w-2xl text-background animate-scale-in">
                <h3 className="text-3xl md:text-4xl font-bold mb-3 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>Find the perfect escape</h3>
                <p className="text-background/80 mb-6 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>Explore our curated destinations and special offers tailored for you.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                  <Button className="bg-background text-foreground hover:bg-background/90 hover-scale transition-all duration-300" onClick={() => navigate('/packages')}>
                    Explore packages
                  </Button>
                  <Button variant="outline" className="bg-transparent border-background text-background hover:bg-background hover:text-foreground transition-all duration-300 hover-scale" onClick={() => navigate('/blog')}>
                    Read more
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
