import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GroupTourBookingModal } from "@/components/GroupTourBookingModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  Star,
  ArrowLeft,
  Sparkles,
  Edit,
  Eye,
  Share2,
  Heart,
} from "lucide-react";

const GroupTourDetail = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTourDetails();
  }, [tourId]);

  const loadTourDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('group_tours')
        .select('*, category:group_tour_categories!category_id(name, color, icon)')
        .eq('id', tourId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        setTour(null);
        return;
      }
      
      setTour(data);

      // Set page metadata
      document.title = `${data.title} - Group Tour Details`;
      const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (metaDesc) {
        metaDesc.content = data.description || `Join our group tour to ${data.destination}. ${data.duration} journey with expert guides.`;
      }
    } catch (error) {
      console.error('Error loading tour details:', error);
      toast({
        title: "Error",
        description: "Failed to load tour details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tour Not Found</h1>
            <Button onClick={() => navigate('/group-tours')}>View All Tours</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 py-2 sm:py-4 md:py-6 mt-2">
        <Button 
          variant="outline" 
          onClick={() => navigate('/group-tours')}
          className="border-primary text-primary hover:bg-primary hover:text-white text-xs sm:text-sm"
          size="sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Back to Tours
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-2 sm:py-4 md:py-8">
        <Card className="overflow-hidden">
          <div className="relative h-48 sm:h-64 md:h-96">
            <img
              src={tour.image_url || '/placeholder.svg'}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            {tour.featured && (
              <Badge className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-2 sm:px-3 rounded-full border-0 text-xs">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                Featured
              </Badge>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white">
              <h1 className="text-lg sm:text-2xl md:text-4xl font-bold mb-1 sm:mb-2">{tour.title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
                  <span className="text-sm sm:text-lg md:text-xl">{tour.destination}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-yellow-400 mr-1" />
                  <span className="text-xs sm:text-sm md:text-base">{tour.rating} ({tour.reviews_count} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-3 sm:p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="md:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
                {/* Tour Description */}
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">About This Tour</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">{tour.description}</p>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <Card>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <div>
                          <div className="text-xs sm:text-sm font-medium">Start Date</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {formatDate(tour.start_date)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <div>
                          <div className="text-xs sm:text-sm font-medium">Duration</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">{tour.duration}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <div>
                          <div className="text-xs sm:text-sm font-medium">Group Size</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {tour.available_spots} spots left
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Details */}
                {tour.highlights && tour.highlights.length > 0 && (
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">Highlights</h2>
                    <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-sm sm:text-base text-muted-foreground">
                      {tour.highlights.map((highlight: string, idx: number) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Booking Section */}
              <div>
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-lg sm:text-xl">Book Your Spot</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-primary">
                        ₹{tour.price.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">per person</div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Available Spots</span>
                        <span className="font-medium">{tour.available_spots}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Group Type</span>
                        <span className="font-medium">{tour.group_type}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Difficulty Level</span>
                        <span className="font-medium">{tour.difficulty_level}</span>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Button 
                        className="w-full bg-gradient-to-r from-accent to-bright-blue hover:from-bright-blue hover:to-accent text-sm sm:text-base"
                        onClick={() => setIsBookingModalOpen(true)}
                        disabled={tour.available_spots === 0}
                      >
                        {tour.available_spots > 0 ? 'Book Now' : 'Sold Out'}
                      </Button>
                      
                      <div className="grid grid-cols-3 gap-1 sm:gap-2">
                        <Button variant="outline" size="sm" className="text-xs p-1 sm:p-2">
                          <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                          <span className="hidden sm:inline">Save</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs p-1 sm:p-2">
                          <Share2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                          <span className="hidden sm:inline">Share</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs p-1 sm:p-2"
                          onClick={() => window.open(`/admin?section=group-tours&editTour=${tour.id}`, '_blank')}
                        >
                          <Edit className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <GroupTourBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tour={tour}
      />

      <Footer />
    </div>
  );
};

export default GroupTourDetail;
