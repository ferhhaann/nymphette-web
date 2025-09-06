import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section with Video Background */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroVideo})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-white via-blue-200 to-accent bg-clip-text text-transparent">
              Group Adventures
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-slide-up text-gray-200">
            Connect with like-minded travelers and create unforgettable memories together
          </p>
          <div className="flex justify-center space-x-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Button size="lg" className="bg-gradient-to-r from-accent to-bright-blue hover:from-bright-blue hover:to-accent text-white px-8 py-3 text-lg font-medium">
              <Play className="h-5 w-5 mr-2" />
              Watch Preview
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
              Browse Tours
            </Button>
          </div>
        </div>
      </section>

      {/* Smart Filters Section */}
      <section className="py-8 bg-gradient-to-br from-accent/5 to-bright-blue/5 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Smart Filters</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-6 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search destinations, tours..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Budget</label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={200000}
                    min={0}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Group Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Group Type</label>
                <Select value={selectedGroupType} onValueChange={setSelectedGroupType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                    <SelectItem value="Solo Travelers">Solo Travelers</SelectItem>
                    <SelectItem value="Families">Families</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Adventure Seekers">Adventure Seekers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Difficulty */}
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Challenging">Challenging</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
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
                <TourCard key={tour.id} tour={tour} index={index} />
              ))}
            </div>
          )}

          {tours.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                No tours match your current filters
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setPriceRange([0, 200000]);
                setSelectedDifficulty("all");
                setSelectedGroupType("all");
                setSelectedCategory("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white px-8">
              Load More Adventures
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary mb-4">
              Travelers Love Our Group Tours
            </h3>
            <p className="text-lg text-muted-foreground">
              Real stories from our adventure community
            </p>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {reviews.slice(0, 6).map((review, idx) => (
                <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent to-bright-blue rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {review.reviewer_name?.charAt(0)}
                        </div>
                        <div>
                          <h5 className="font-semibold">{review.reviewer_name}</h5>
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
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-4">
                        {review.review_text}
                      </p>
                      {review.social_media_link && (
                        <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          View on Social
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* AI Concierge Chatbot */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${chatbotOpen ? 'w-96 h-96' : 'w-16 h-16'}`}>
        {!chatbotOpen ? (
          <Button
            onClick={() => setChatbotOpen(true)}
            className="w-full h-full rounded-full bg-gradient-to-r from-accent to-bright-blue hover:from-bright-blue hover:to-accent text-white shadow-2xl"
          >
            <Bot className="h-8 w-8" />
          </Button>
        ) : (
          <Card className="w-full h-full shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-accent to-bright-blue text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span className="font-medium">Travel Assistant</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setChatbotOpen(false)}
                className="text-white hover:bg-white/20"
              >
                ×
              </Button>
            </div>
            <div className="flex-1 p-4 bg-gray-50">
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm">
                    Hi! I'm your AI travel concierge. How can I help you find the perfect group tour?
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    Best tours for beginners
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Solo traveler options
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Budget recommendations
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input placeholder="Ask me anything..." className="text-sm" />
                <Button size="sm" className="bg-accent hover:bg-bright-blue">
                  Send
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 md:hidden z-40">
        <div className="flex space-x-3">
          <Button className="flex-1 bg-gradient-to-r from-accent to-bright-blue text-white">
            Book Now
          </Button>
          <Button variant="outline" className="flex-1">
            Get Quote
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GroupTours;