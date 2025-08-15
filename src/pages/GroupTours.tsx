import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Star } from "lucide-react";
import regionsImage from "@/assets/regions-world.jpg";

const GroupTours = () => {
  const upcomingTours = [
    {
      id: 1,
      title: "Incredible India Golden Triangle",
      destination: "Delhi, Agra, Jaipur",
      startDate: "2024-03-15",
      endDate: "2024-03-22",
      duration: "8 Days / 7 Nights",
      price: "₹45,000",
      maxSeats: 25,
      availableSeats: 8,
      image: regionsImage,
      highlights: ["Taj Mahal", "Red Fort", "Hawa Mahal", "City Palace"],
      rating: 4.8,
      region: "Asia"
    },
    {
      id: 2,
      title: "European Capitals Explorer",
      destination: "Paris, Amsterdam, Berlin, Prague",
      startDate: "2024-04-10",
      endDate: "2024-04-20",
      duration: "11 Days / 10 Nights",
      price: "₹1,35,000",
      maxSeats: 20,
      availableSeats: 5,
      image: regionsImage,
      highlights: ["Eiffel Tower", "Anne Frank House", "Brandenburg Gate", "Prague Castle"],
      rating: 4.9,
      region: "Europe"
    },
    {
      id: 3,
      title: "Bali Cultural Discovery",
      destination: "Ubud, Kuta, Seminyak, Sanur",
      startDate: "2024-03-25",
      endDate: "2024-04-01",
      duration: "7 Days / 6 Nights",
      price: "₹55,000",
      maxSeats: 18,
      availableSeats: 12,
      image: regionsImage,
      highlights: ["Temple Tours", "Rice Terraces", "Traditional Villages", "Beach Relaxation"],
      rating: 4.7,
      region: "Asia"
    },
    {
      id: 4,
      title: "Dubai & Abu Dhabi Luxury",
      destination: "Dubai, Abu Dhabi",
      startDate: "2024-04-05",
      endDate: "2024-04-10",
      duration: "6 Days / 5 Nights",
      price: "₹65,000",
      maxSeats: 15,
      availableSeats: 3,
      image: regionsImage,
      highlights: ["Burj Khalifa", "Desert Safari", "Sheikh Zayed Mosque", "Dubai Mall"],
      rating: 4.8,
      region: "Middle East"
    },
    {
      id: 5,
      title: "Thailand Island Hopping",
      destination: "Bangkok, Phuket, Krabi, Phi Phi",
      startDate: "2024-05-12",
      endDate: "2024-05-20",
      duration: "9 Days / 8 Nights",
      price: "₹48,000",
      maxSeats: 22,
      availableSeats: 15,
      image: regionsImage,
      highlights: ["Island Tours", "Snorkeling", "Thai Massage", "Street Food Tours"],
      rating: 4.6,
      region: "Asia"
    },
    {
      id: 6,
      title: "Switzerland Alpine Adventure",
      destination: "Zurich, Interlaken, Zermatt, Lucerne",
      startDate: "2024-06-08",
      endDate: "2024-06-16",
      duration: "9 Days / 8 Nights",
      price: "₹1,85,000",
      maxSeats: 16,
      availableSeats: 9,
      image: regionsImage,
      highlights: ["Matterhorn", "Jungfraujoch", "Lake Geneva", "Alpine Train Rides"],
      rating: 4.9,
      region: "Europe"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getAvailabilityStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return { status: 'Available', color: 'bg-foreground' };
    if (percentage > 20) return { status: 'Limited', color: 'bg-accent' };
    return { status: 'Few Left', color: 'bg-destructive' };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Join Our Group Tours
          </h1>
          <p className="text-xl text-soft-blue max-w-3xl mx-auto animate-slide-up">
            Travel with like-minded explorers and make new friends while discovering incredible destinations
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-pale-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
              All Regions
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
              Asia
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
              Europe
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
              Middle East
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
              Americas
            </Button>
          </div>
        </div>
      </section>

      {/* Group Tours Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Upcoming Group Tours</h2>
            <p className="text-xl text-muted-foreground">Join fellow travelers on these amazing journeys</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingTours.map((tour, index) => {
              const availability = getAvailabilityStatus(tour.availableSeats, tour.maxSeats);
              
              return (
                <Card 
                  key={tour.id}
                  className="group overflow-hidden hover:shadow-travel transition-all duration-500 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="md:flex">
                    <div className="relative md:w-1/2 overflow-hidden">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        loading="lazy"
                        className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-accent text-white">{tour.region}</Badge>
                      </div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{tour.rating}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className={`${availability.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                          {availability.status}: {tour.availableSeats} spots
                        </div>
                      </div>
                    </div>

                    <CardContent className="md:w-1/2 p-6">
                      <h3 className="text-2xl font-bold text-primary mb-3">{tour.title}</h3>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{tour.destination}</span>
                        </div>
                        
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(tour.startDate)} - {formatDate(tour.endDate)}</span>
                        </div>
                        
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{tour.duration}</span>
                        </div>
                        
                        <div className="flex items-center text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{tour.maxSeats} max travelers</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-primary mb-2">Tour Highlights:</h4>
                        <div className="flex flex-wrap gap-2">
                          {tour.highlights.slice(0, 3).map((highlight, idx) => (
                            <Badge key={idx} variant="outline" className="border-soft-blue text-deep-blue text-xs">
                              {highlight}
                            </Badge>
                          ))}
                          {tour.highlights.length > 3 && (
                            <Badge variant="outline" className="border-soft-blue text-deep-blue text-xs">
                              +{tour.highlights.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-muted-foreground">Starting from</span>
                          <div className="text-2xl font-bold text-accent">{tour.price}</div>
                        </div>
                        <Button className="bg-accent hover:bg-bright-blue text-white">
                          Join Group
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
              Load More Tours
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GroupTours;