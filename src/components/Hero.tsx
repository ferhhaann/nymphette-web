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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-foreground/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold font-playfair tracking-tight mb-6 animate-fade-in">
          Modern Travel Packages
          <span className="block bg-hero-gradient bg-clip-text text-transparent">
            Unforgettable Adventures
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground animate-slide-up">
          Explore breathtaking destinations with our curated travel experiences.
          Create memories that last a lifetime.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-scale-in">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-bright-blue text-white px-8 py-3 text-lg"
            onClick={handleExplorePackages}
          >
            Explore Packages
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background px-8 py-3 text-lg"
            onClick={handlePlanCustomTrip}
          >
            Plan Custom Trip
          </Button>
        </div>

        {/* Quick Search */}
        <div className="bg-card/70 backdrop-blur-md rounded-2xl p-6 max-w-4xl mx-auto animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 bg-card/40 border border-border rounded-lg p-3">
              <MapPin className="h-5 w-5 text-accent" />
              <input
                type="text"
                placeholder="Where to?"
                value={searchData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none flex-1"
              />
            </div>
            
            <div className="flex items-center space-x-3 bg-card/40 border border-border rounded-lg p-3">
              <Calendar className="h-5 w-5 text-accent" />
              <input
                type="date"
                placeholder="When?"
                value={searchData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none flex-1"
              />
            </div>
            
            <div className="flex items-center space-x-3 bg-card/40 border border-border rounded-lg p-3">
              <Users className="h-5 w-5 text-accent" />
              <select
                value={searchData.travelers}
                onChange={(e) => handleInputChange('travelers', e.target.value)}
                className="bg-transparent text-foreground outline-none flex-1"
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
              className="bg-accent hover:bg-bright-blue text-white p-3"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-10 animate-float">
        <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
          <div className="text-center text-white">
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-accent">Destinations</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
          <div className="text-center text-white">
            <div className="text-2xl font-bold">50K+</div>
            <div className="text-sm text-accent">Happy Travelers</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;