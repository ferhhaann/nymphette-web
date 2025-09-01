import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContent } from "@/hooks/useContent";
import heroImage from "@/assets/hero-travel.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const { getContentValue } = useContent('hero');

  const handleExplorePackages = () => {
    navigate('/packages');
  };

  const handlePlanCustomTrip = () => {
    navigate('/contact');
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-x-3 sm:inset-x-6 md:inset-x-8 bottom-3 sm:bottom-6 md:bottom-8 top-16 sm:top-20 md:top-24 bg-cover bg-center bg-no-repeat rounded-2xl sm:rounded-3xl overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-foreground/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-background max-w-4xl mx-auto px-3 sm:px-6 md:px-4 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold font-sans tracking-tight mb-4 sm:mb-6 animate-fade-in leading-tight">
          {getContentValue('title', 'Discover your next adventure')}
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-background/90 animate-slide-up leading-relaxed px-2">
          {getContentValue('subtitle', 'Explore breathtaking destinations with our curated travel experiences. Create memories that last a lifetime.')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-scale-in px-4 sm:px-0">
          <Button 
            size="lg" 
            className="bg-foreground hover:bg-foreground/90 text-background px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
            onClick={handleExplorePackages}
          >
            {getContentValue('primary_button', 'Start your journey')}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-background/40 text-background hover:bg-background hover:text-foreground px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto bg-background/10 backdrop-blur-sm"
            onClick={handlePlanCustomTrip}
          >
            {getContentValue('secondary_button', 'Book now')}
          </Button>
        </div>
      </div>

      {/* Floating Elements - Hidden on mobile, visible on larger screens */}
      <div className="hidden md:block absolute bottom-10 left-10 animate-float">
        <div className="bg-background/30 backdrop-blur-md rounded-full p-4">
          <div className="text-center text-background">
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-background/80">Destinations</div>
          </div>
        </div>
      </div>

      <div className="hidden md:block absolute bottom-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="bg-background/30 backdrop-blur-md rounded-full p-4">
          <div className="text-center text-background">
            <div className="text-2xl font-bold">50K+</div>
            <div className="text-sm text-background/80">Happy Travelers</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;