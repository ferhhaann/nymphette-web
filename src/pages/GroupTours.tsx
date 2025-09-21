import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { GroupTourBookingModal } from "@/components/GroupTourBookingModal";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Star, Play, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useStaticSEO } from "@/hooks/useStaticSEO";
import heroVideo from "@/assets/packages-hero-bg.jpg";

interface GroupTour {
  id: string;
  title: string;
  description?: string;
  destination: string;
  start_date: string;
  end_date: string;
  duration: string;
  price: number;
  original_price?: number;
  currency: string;
  max_participants: number;
  available_spots: number;
  difficulty_level?: string;
  group_type?: string;
  image_url?: string;
  rating: number;
  reviews_count: number;
  status: string;
  featured?: boolean;
  category?: {
    name: string;
    color: string;
    icon: string;
  };
}

const GroupTours = () => {
  const navigate = useNavigate();
  useStaticSEO(); // Apply SEO settings from database
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedGroupType, setSelectedGroupType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  // Fetch group tours
  const { data: tours = [], isLoading } = useQuery({
    queryKey: ['group-tours', searchTerm, selectedDifficulty, selectedGroupType, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('group_tours')
        .select('*, category:group_tour_categories!category_id(name, color, icon)')
        .eq('status', 'Active');

      if (searchTerm) {
        query = query.or('title.ilike.%' + searchTerm + '%,destination.ilike.%' + searchTerm + '%');
      }

      if (selectedDifficulty !== 'all') {
        query = query.eq('difficulty_level', selectedDifficulty);
      }

      if (selectedGroupType !== 'all') {
        query = query.eq('group_type', selectedGroupType);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      query = query
        .order('featured', { ascending: false })
        .order('rating', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '/placeholder.svg';
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) return imagePath;
    return 'https://duouhbzwivonyssvtiqo.supabase.co/storage/v1/object/public/group-tour-images/' + imagePath;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const [selectedTour, setSelectedTour] = useState<GroupTour | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleJoinTour = (tour: GroupTour) => {
    setSelectedTour(tour);
    setIsBookingModalOpen(true);
  };

  const groupToursStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Group Tours - Join Fellow Travelers Worldwide",
    "description": "Discover amazing group tours and join fellow travelers on unforgettable journeys. Small groups, expert guides, and authentic experiences worldwide.",
    "url": "/group-tours",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Group Tour Packages",
      "numberOfItems": tours.length,
      "itemListElement": tours.slice(0, 5).map((tour, index) => ({
        "@type": "TourBooking",
        "name": tour.title,
        "description": tour.description,
        "provider": {
          "@type": "TravelAgency",
          "name": "Nymphette Tours"
        },
        "touristType": tour.group_type,
        "offers": {
          "@type": "Offer",
          "price": tour.price,
          "priceCurrency": tour.currency,
          "availability": tour.available_spots > 0 ? "InStock" : "OutOfStock"
        },
        "position": index + 1
      }))
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header>
        <Navigation />
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-64 sm:h-[70vh] md:h-[calc(100vh-3rem)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-x-3 sm:inset-x-6 md:inset-x-8 bottom-3 sm:bottom-6 md:bottom-8 top-3 sm:top-6 md:top-8 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat scale-105"
                style={{ backgroundImage: 'url(' + heroVideo + ')' }}
              />
            </div>
            <div className="absolute inset-0 bg-foreground/50"></div>
          </div>
          
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 animate-scale-in leading-tight">
              Join Amazing Group Tours
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 md:mb-6 opacity-90 animate-fade-in leading-relaxed px-2" style={{ animationDelay: '0.3s' }}>
              Connect with fellow travelers on unforgettable journeys
            </p>
            <div className="flex flex-row gap-2 sm:gap-4 justify-center animate-slide-up mb-4 sm:mb-6 md:mb-8" style={{ animationDelay: '0.6s' }}>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-accent to-bright-blue hover:from-bright-blue hover:to-accent text-white px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-semibold"
              >
                Explore Tours
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-semibold bg-white/10 backdrop-blur-sm"
              >
                <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Watch Stories
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 opacity-80 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="text-center">
                <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mb-1">500+</div>
                <div className="text-xs opacity-80">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mb-1">50+</div>
                <div className="text-xs opacity-80">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mb-1">15+</div>
                <div className="text-xs opacity-80">Years Experience</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-2 sm:h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Tours Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-primary mb-4">
                Upcoming Group Adventures
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join fellow travelers on these carefully curated group experiences
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <CardContent className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {tours.map((tour, index) => (
                  <Card 
                    key={tour.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in border-0 bg-gradient-to-br from-white to-gray-50"
                    style={{ animationDelay: (index * 150) + 'ms' }}
                  >
                    <div className="relative">
                      <div className="relative overflow-hidden h-64 rounded-lg">
                        <img
                          src={getImageUrl(tour.image_url)}
                          alt={tour.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {tour.featured && (
                          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 rounded-full border-0">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}

                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{tour.rating}</span>
                            <span className="text-xs text-muted-foreground">({tour.reviews_count})</span>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                          {tour.title}
                        </h3>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2 text-accent" />
                            <span className="font-medium">{tour.destination}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2 text-accent" />
                              <span>{formatDate(tour.start_date)}</span>
                            </div>
                            
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2 text-accent" />
                              <span>{tour.duration}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-accent">
                              ₹{tour.price.toLocaleString()}
                            </span>
                            <div className="text-sm text-muted-foreground">per person</div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline"
                              onClick={() => navigate(`/group-tours/${tour.id}`)}
                            >
                              View Details
                            </Button>
                            <Button 
                              className="bg-gradient-to-r from-accent to-bright-blue hover:from-bright-blue hover:to-accent text-white font-medium"
                              onClick={() => handleJoinTour(tour)}
                            >
                              Join Group
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>

      {selectedTour && (
        <GroupTourBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          tour={selectedTour}
        />
      )}
    </div>
  );
};

export default GroupTours;