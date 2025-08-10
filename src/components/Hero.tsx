import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: "",
    date: "",
    travelers: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Create search parameters
    const searchParams = new URLSearchParams();
    if (searchData.destination) searchParams.set('destination', searchData.destination);
    if (searchData.date) searchParams.set('date', searchData.date);
    if (searchData.travelers) searchParams.set('travelers', searchData.travelers);
    
    // Navigate to packages page with search parameters
    navigate(`/packages?${searchParams.toString()}`);
  };

  const handleExplorePackages = () => {
    navigate('/packages');
  };

  const handlePlanCustomTrip = () => {
    navigate('/contact');
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image Section */}
      <section className="relative flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="inset-x-3 sm:inset-x-6 md:inset-x-8 min-h-[70vh] sm:min-h-[80vh] bg-cover bg-center bg-no-repeat rounded-2xl sm:rounded-3xl overflow-hidden mx-3 sm:mx-6 md:mx-8 mt-16 sm:mt-20 md:mt-24"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-foreground/50"></div>
          
          {/* Content overlaid on image */}
          <div className="relative z-10 text-center text-background max-w-4xl mx-auto px-3 sm:px-6 md:px-4 py-8 sm:py-12 flex flex-col justify-center min-h-[70vh] sm:min-h-[80vh]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold font-sans tracking-tight mb-4 sm:mb-6 animate-fade-in leading-tight">
              Discover your next adventure
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-background/90 animate-slide-up leading-relaxed px-2">
              Explore breathtaking destinations with our curated travel experiences. Create memories that last a lifetime.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-scale-in px-4 sm:px-0">
              <Button 
                size="lg" 
                className="bg-foreground hover:bg-foreground/90 text-background px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
                onClick={handleExplorePackages}
              >
                Start your journey
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-background/40 text-background hover:bg-background hover:text-foreground px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto bg-background/10 backdrop-blur-sm"
                onClick={handlePlanCustomTrip}
              >
                Book now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section - Below Image */}
      <section className="px-3 sm:px-6 md:px-8 -mt-8 relative z-20">
        <div className="bg-background border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-4xl mx-auto animate-slide-up shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 bg-muted/50 border border-border rounded-lg p-3 sm:col-span-1">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Where to?"
                value={searchData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none flex-1 text-sm sm:text-base"
              />
            </div>
            
            <div className="flex items-center space-x-3 bg-muted/50 border border-border rounded-lg p-3 sm:col-span-1">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-foreground flex-shrink-0" />
              <input
                type="date"
                placeholder="When?"
                value={searchData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none flex-1 text-sm sm:text-base"
              />
            </div>
            
            <div className="flex items-center space-x-3 bg-muted/50 border border-border rounded-lg p-3 sm:col-span-1">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-foreground flex-shrink-0" />
              <select
                value={searchData.travelers}
                onChange={(e) => handleInputChange('travelers', e.target.value)}
                className="bg-transparent text-foreground outline-none flex-1 text-sm sm:text-base"
              >
                <option value="" className="text-foreground">Travelers</option>
                <option value="1" className="text-foreground">1 Person</option>
                <option value="2" className="text-foreground">2 People</option>
                <option value="3-5" className="text-foreground">3-5 People</option>
                <option value="6-10" className="text-foreground">6-10 People</option>
                <option value="10+" className="text-foreground">10+ People</option>
              </select>
            </div>
            
            <Button 
              className="bg-foreground hover:bg-foreground/90 text-background p-3 sm:col-span-1 w-full"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="text-sm sm:text-base">Search</span>
            </Button>
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default Hero;