import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Users } from "lucide-react";

const SearchSection = () => {
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

  return (
    <section className="py-8 -mt-8 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-background/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-4xl mx-auto shadow-lg border border-border/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 bg-background/60 border border-border/20 rounded-lg p-3 sm:col-span-1">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Where to?"
                value={searchData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none flex-1 text-sm sm:text-base"
              />
            </div>
            
            <div className="flex items-center space-x-3 bg-background/60 border border-border/20 rounded-lg p-3 sm:col-span-1">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-foreground flex-shrink-0" />
              <input
                type="date"
                placeholder="When?"
                value={searchData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none flex-1 text-sm sm:text-base"
              />
            </div>
            
            <div className="flex items-center space-x-3 bg-background/60 border border-border/20 rounded-lg p-3 sm:col-span-1">
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
      </div>
    </section>
  );
};

export default SearchSection;