import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Calendar, MapPin, Users, Clock, Star, Filter, Search, Heart, Share2, Eye, MessageCircle, Play, Sparkles, Award, Leaf, TrendingUp, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroVideo from "@/assets/packages-hero-bg.jpg"; // Placeholder - replace with actual video

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
  gallery_images?: any;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: any;
  badges?: string[];
  rating: number;
  reviews_count: number;
  status: string;
  featured?: boolean;
  early_bird_discount?: number;
  last_minute_discount?: number;
  is_eco_friendly?: boolean;
  contact_info?: any;
  category?: {
    name: string;
    color: string;
    icon: string;
  };
}

interface TourReview {
  id: string;
  reviewer_name: string;
  reviewer_image?: string;
  rating: number;
  review_text: string;
  review_date: string;
  is_verified: boolean;
  social_media_link?: string;
}

const GroupTours = () => {
  usePerformanceOptimization();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedGroupType, setSelectedGroupType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTour, setSelectedTour] = useState<GroupTour | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const { toast } = useToast();

  // Fetch group tours
  const { data: tours = [], isLoading } = useQuery({
    queryKey: ['group-tours', searchTerm, priceRange, selectedDifficulty, selectedGroupType, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('group_tours')
        .select(`
          *,
          category:group_tour_categories!category_id(name, color, icon)
        `)
        .eq('status', 'Active');

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,destination.ilike.%${searchTerm}%`);
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
        .gte('price', priceRange[0])
        .lte('price', priceRange[1])
        .order('featured', { ascending: false })
        .order('rating', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['tour-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_tour_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Fetch reviews for selected tour
  const { data: reviews = [] } = useQuery({
    queryKey: ['tour-reviews', selectedTour?.id],
    queryFn: async () => {
      if (!selectedTour?.id) return [];
      const { data, error } = await supabase
        .from('tour_reviews')
        .select('*')
        .eq('tour_id', selectedTour.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedTour?.id
  });

  // Helper function to get image URL
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '/placeholder.svg';
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) return imagePath;
    return `https://duouhbzwivonyssvtiqo.supabase.co/storage/v1/object/public/group-tour-images/${imagePath}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAvailabilityStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return { status: 'Available', color: 'bg-green-500', urgency: false };
    if (percentage > 20) return { status: 'Limited Spots', color: 'bg-orange-500', urgency: true };
    return { status: 'Few Left!', color: 'bg-red-500', urgency: true };
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'top rated': return 'default';
      case 'early bird': return 'secondary';
      case 'eco friendly': return 'outline';
      default: return 'outline';
    }
  };

  const handleJoinTour = async (tourId: string) => {
    toast({
      title: "Booking Request Sent!",
      description: "We'll contact you soon with booking details.",
    });
  };

  const TourCard = ({ tour, index }: { tour: GroupTour; index: number }) => {
    const availability = getAvailabilityStatus(tour.available_spots, tour.max_participants);
    const discount = tour.early_bird_discount > 0 ? tour.early_bird_discount : tour.last_minute_discount;
    
    return (
      <Card 
        className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in border-0 bg-gradient-to-br from-white to-gray-50"
        style={{ animationDelay: `${index * 150}ms` }}
      >
        <div className="relative">
          <div className="relative overflow-hidden h-64">
            <img
              src={getImageUrl(tour.image_url)}
              alt={tour.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {tour.featured && tour.badges?.includes('Featured') && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {tour.badges?.filter(badge => badge !== 'Featured').map((badge, idx) => (
                <Badge key={idx} variant={getBadgeVariant(badge)} className="backdrop-blur-sm">
                  {badge === 'Eco Friendly' && <Leaf className="h-3 w-3 mr-1" />}
                  {badge === 'Top Rated' && <Award className="h-3 w-3 mr-1" />}
                  {badge === 'Early Bird' && <TrendingUp className="h-3 w-3 mr-1" />}
                  {badge}
                </Badge>
              ))}
            </div>

            {/* Category */}
            <div className="absolute top-4 right-4">
              <Badge 
                className="backdrop-blur-sm text-white"
                style={{ backgroundColor: tour.category?.color || '#8B5CF6' }}
              >
                {tour.category?.name}
              </Badge>
            </div>

            {/* Rating */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{tour.rating}</span>
                <span className="text-xs text-muted-foreground">({tour.reviews_count})</span>
              </div>
            </div>

            {/* Availability */}
            <div className="absolute bottom-4 right-4">
              <div className={`${availability.color} text-white px-3 py-1 rounded-full text-sm font-medium ${availability.urgency ? 'animate-pulse' : ''}`}>
                {availability.status}: {tour.available_spots} spots
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-primary line-clamp-2 group-hover:text-accent transition-colors">
                {tour.title}
              </h3>
              <div className="flex space-x-2 ml-4">
                <Button size="sm" variant="ghost" className="hover:text-red-500">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
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
                
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-2 text-accent" />
                  <span>{tour.group_type}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {tour.difficulty_level}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {tour.highlights?.slice(0, 3).map((highlight, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs border-accent/30 text-accent">
                    {highlight}
                  </Badge>
                ))}
                {(tour.highlights?.length || 0) > 3 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Badge variant="outline" className="text-xs border-accent/30 text-accent cursor-pointer hover:bg-accent hover:text-white">
                        +{(tour.highlights?.length || 0) - 3} more
                      </Badge>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tour Highlights</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-wrap gap-2">
                        {tour.highlights?.map((highlight, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  {discount > 0 && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{tour.original_price?.toLocaleString()}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-accent">
                    ₹{tour.price.toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <Badge className="bg-green-500 text-white text-xs">
                      {discount}% OFF
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">per person</span>
              </div>
              
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedTour(tour)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </DialogTrigger>
                  <TourDetailModal tour={tour} reviews={reviews} />
                </Dialog>
                
                <Button 
                  className="bg-gradient-to-r from-accent to-bright-blue hover:from-bright-blue hover:to-accent text-white font-medium"
                  onClick={() => handleJoinTour(tour.id)}
                >
                  Join Group
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

  const TourDetailModal = ({ tour, reviews }: { tour: GroupTour; reviews: TourReview[] }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">{tour.title}</DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Tour Details</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Destination:</strong> {tour.destination}</p>
                <p><strong>Duration:</strong> {tour.duration}</p>
                <p><strong>Group Type:</strong> {tour.group_type}</p>
                <p><strong>Difficulty:</strong> {tour.difficulty_level}</p>
                <p><strong>Max Participants:</strong> {tour.max_participants}</p>
                <p><strong>Available Spots:</strong> {tour.available_spots}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">What's Included</h4>
              <ul className="space-y-1 text-sm">
                {tour.inclusions?.map((inclusion, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {inclusion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{tour.description}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="itinerary">
          <Accordion type="single" collapsible className="w-full">
            {tour.itinerary?.map((day: any, idx: number) => (
              <AccordionItem key={idx} value={`day-${idx}`}>
                <AccordionTrigger className="text-left">
                  <div>
                    <h4 className="font-semibold">Day {idx + 1}</h4>
                    <p className="text-sm text-muted-foreground">{day.title}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">{day.description}</p>
                  {day.activities && (
                    <div className="mt-2">
                      <h5 className="font-medium text-sm mb-1">Activities:</h5>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {day.activities.map((activity: string, actIdx: number) => (
                          <li key={actIdx}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
        
        <TabsContent value="gallery">
          <Carousel className="w-full">
            <CarouselContent>
              {[tour.image_url, ...(Array.isArray(tour.gallery_images) ? tour.gallery_images : [])].filter(Boolean).map((image, idx) => (
                <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                  <img
                    src={getImageUrl(image)}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </TabsContent>
        
        <TabsContent value="reviews">
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-bright-blue rounded-full flex items-center justify-center text-white font-medium">
                      {review.reviewer_name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-medium">{review.reviewer_name}</h5>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        {review.is_verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(review.review_date)}
                  </span>
                </div>
                <p className="text-sm">{review.review_text}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );

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
      <SEOHead 
        title="Group Tours - Join Fellow Travelers on Amazing Adventures | Nymphette Tours"
        description="Discover amazing group tours and join fellow travelers on unforgettable journeys. Small groups, expert guides, authentic experiences, and new friendships worldwide."
        keywords="group tours, join travelers, small group travel, guided tours, travel groups, adventure tours, cultural tours, travel companions, group adventures"
        url="/group-tours"
        structuredData={groupToursStructuredData}
      />
      <header>
        <Navigation />
      </header>

      <main>
        {/* Hero Section with Video Background */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ backgroundImage: `url(${heroVideo})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-scale-in leading-tight">
              Join Amazing Group Tours
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in leading-relaxed" style={{ animationDelay: '0.3s' }}>
              Connect with fellow travelers on unforgettable journeys around the world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-accent to-bright-blue hover:from-bright-blue hover:to-accent text-white px-8 py-4 text-lg font-semibold"
              >
                Explore Tours
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Stories
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 opacity-80 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-sm opacity-80">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-sm opacity-80">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">15+</div>
                <div className="text-sm opacity-80">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* ... keep existing code for rest of components ... */}
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default GroupTours;