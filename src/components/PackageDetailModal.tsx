import { useState } from "react";
import { TravelPackage } from "@/data/packagesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  X, 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Calendar,
  Check,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
  Languages,
  Globe,
  Phone,
  Mail,
  StarHalf,
  ZoomIn
} from "lucide-react";

interface PackageDetailModalProps {
  package: TravelPackage;
  onClose: () => void;
  onBook?: (pkg: TravelPackage) => void;
}

// Get multiple images for places in each country for gallery
const getPlaceImages = (countrySlug?: string, country?: string) => {
  const slug = countrySlug || country?.toLowerCase().replace(/\s+/g, '-');
  
  if (slug === "thailand") {
    return [
      { src: "/places/thailand/bangkok.webp", alt: "Bangkok Grand Palace" },
      { src: "/places/thailand/phuket.webp", alt: "Phuket Beach" },
      { src: "/places/thailand/chiang-mai.webp", alt: "Chiang Mai Temples" }
    ];
  }
  if (slug === "japan") {
    return [
      { src: "/places/japan/tokyo.webp", alt: "Tokyo Skyline" },
      { src: "/places/japan/mount-fuji.webp", alt: "Mount Fuji" },
      { src: "/places/japan/arashiyama-bamboo-grove.jpg", alt: "Kyoto Bamboo Grove" },
      { src: "/places/japan/fushimi-inari-shrine.jpg", alt: "Fushimi Inari Shrine" }
    ];
  }
  if (slug === "indonesia") {
    return [
      { src: "/places/indonesia/bali.webp", alt: "Bali Rice Terraces" }
    ];
  }
  if (slug === "china") {
    return [
      { src: "/places/china/beijing.webp", alt: "Beijing Forbidden City" }
    ];
  }
  if (slug === "kazakhstan") {
    return [
      { src: "/places/kazakhstan/almaty.webp", alt: "Almaty Mountains" }
    ];
  }
  if (slug === "malaysia") {
    return [
      { src: "/places/malaysia/kuala-lumpur.jpg", alt: "Kuala Lumpur Skyline" }
    ];
  }
  if (slug === "philippines") {
    return [
      { src: "/places/philippines/manila.jpg", alt: "Manila Bay" }
    ];
  }
  if (slug === "south-korea") {
    return [
      { src: "/places/south-korea/seoul.jpg", alt: "Seoul Skyline" }
    ];
  }
  if (slug === "vietnam") {
    return [
      { src: "/places/vietnam/ho-chi-minh.jpg", alt: "Ho Chi Minh City" }
    ];
  }
  if (slug === "maldives") {
    return [
      { src: "/places/maldives/overwater-villas.jpg", alt: "Overwater Villas" },
      { src: "/places/maldives/banana-reef.jpg", alt: "Banana Reef" },
      { src: "/places/maldives/vaadhoo-island.jpg", alt: "Vaadhoo Island" },
      { src: "/places/maldives/sun-island.jpg", alt: "Sun Island Resort" }
    ];
  }
  if (slug === "uae") {
    return [
      { src: "/places/uae/burj-khalifa.jpg", alt: "Burj Khalifa" },
      { src: "/places/uae/dubai-marina.jpg", alt: "Dubai Marina" },
      { src: "/places/uae/desert-safari.jpg", alt: "Desert Safari" },
      { src: "/places/uae/palm-jumeirah.jpg", alt: "Palm Jumeirah" }
    ];
  }
  if (slug === "usa") {
    return [
      { src: "/places/usa/times-square.jpg", alt: "Times Square" },
      { src: "/places/usa/statue-of-liberty.jpg", alt: "Statue of Liberty" },
      { src: "/places/usa/grand-canyon.jpg", alt: "Grand Canyon" },
      { src: "/places/usa/niagara-falls.jpg", alt: "Niagara Falls" }
    ];
  }
  if (slug === "kenya") {
    return [
      { src: "/places/kenya/masai-mara.jpg", alt: "Masai Mara Safari" },
      { src: "/places/kenya/amboseli-national-park.jpg", alt: "Amboseli National Park" },
      { src: "/places/kenya/lake-nakuru.jpg", alt: "Lake Nakuru" },
      { src: "/places/kenya/mount-kenya.jpg", alt: "Mount Kenya" }
    ];
  }
  
  // Default fallback
  return [
    { src: "/places/thailand/bangkok.webp", alt: "Travel Destination" }
  ];
};

const PackageDetailModal = ({ package: pkg, onClose, onBook }: PackageDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    email: "",
    phone: "",
    countryCode: "+1",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    toast({
      title: "Enquiry Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({
      name: "",
      city: "",
      email: "",
      phone: "",
      countryCode: "+1",
      message: "",
    });
  };
  
  const placeImages = getPlaceImages(pkg.countrySlug, pkg.country);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % placeImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + placeImages.length) % placeImages.length);
  };

  // Mock data for reviews breakdown
  const reviewsBreakdown = {
    excellent: 65,
    veryGood: 25, 
    average: 8,
    poor: 2,
    terrible: 0
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-background">
          {/* Header with Hero Image */}
          <CardHeader className="relative p-0">
            <div className="relative h-80 overflow-hidden">
              <img
                src={placeImages[currentImageIndex].src}
                alt={placeImages[currentImageIndex].alt}
                className="w-full h-full object-cover cursor-pointer"
                loading="eager"
                onClick={() => setEnlargedImage(placeImages[currentImageIndex].src)}
              />
              
              {/* Navigation buttons */}
              {placeImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
              
              {/* Image indicators */}
              {placeImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {placeImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              
              {/* Zoom indicator */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full">
                <ZoomIn className="h-4 w-4" />
              </div>

              {/* Package info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{pkg.title}</h1>
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-lg">{pkg.country}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {pkg.originalPrice && (
                      <span className="text-lg text-white/70 line-through">{pkg.originalPrice}</span>
                    )}
                    <div className="text-3xl font-bold">{pkg.price}</div>
                    <Button size="lg" className="mt-2 bg-primary hover:bg-primary/90" onClick={() => onBook?.(pkg)}>
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <ScrollArea className="max-h-[calc(90vh-20rem)] overflow-auto">
            <CardContent className="p-6 space-y-8">
              {/* Key Facts Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Duration</div>
                    <div className="text-sm text-muted-foreground">{pkg.duration}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Group Size</div>
                    <div className="text-sm text-muted-foreground">{pkg.groupSize}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Best Time</div>
                    <div className="text-sm text-muted-foreground">{pkg.bestTime}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <Languages className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Languages</div>
                    <div className="text-sm text-muted-foreground">English</div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                {renderStars(pkg.rating)}
                <span className="font-medium text-lg">{pkg.rating}</span>
                <span className="text-muted-foreground">({pkg.reviews} reviews)</span>
                <Badge>{pkg.category}</Badge>
              </div>

              {/* Overview Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-3">Overview</h2>
                <p className="text-muted-foreground mb-4">
                  Discover the beauty and culture of {pkg.country} on this amazing {pkg.duration} journey. 
                  Experience the highlights and hidden gems that make this destination truly special.
                </p>
                <div className="flex flex-wrap gap-2">
                  {pkg.highlights.map((highlight, idx) => (
                    <Badge key={idx} variant="outline" className="border-primary text-primary">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Itinerary Accordion */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Day-by-Day Itinerary</h2>
                <Accordion type="single" collapsible className="w-full">
                  {pkg.itinerary.map((day, idx) => (
                    <AccordionItem key={idx} value={`day-${day.day}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">Day {day.day}</Badge>
                          <span className="font-semibold">{day.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <p className="text-muted-foreground mb-4">{day.description}</p>
                        
                        {day.activities && day.activities.length > 0 && (
                          <div className="mb-3">
                            <span className="font-medium text-sm">Activities: </span>
                            <span className="text-sm text-muted-foreground">
                              {day.activities.join(", ")}
                            </span>
                          </div>
                        )}
                        
                        {day.meals && day.meals.length > 0 && (
                          <div className="mb-3">
                            <span className="font-medium text-sm">Meals: </span>
                            <span className="text-sm text-muted-foreground">
                              {day.meals.join(", ")}
                            </span>
                          </div>
                        )}
                        
                        {day.accommodation && (
                          <div>
                            <span className="font-medium text-sm">Accommodation: </span>
                            <span className="text-sm text-muted-foreground">
                              {day.accommodation}
                            </span>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Included / Excluded Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600 flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pkg.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center">
                      <XIcon className="h-5 w-5 mr-2" />
                      What's Not Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pkg.exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <XIcon className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Location & Map */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Globe className="h-6 w-6 mr-2" />
                  Location & Destinations
                </h2>
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-medium">Primary Destination: {pkg.country}</span>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Globe className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Interactive map coming soon</p>
                </div>
              </div>

              {/* Reviews Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Reviews & Ratings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      {renderStars(pkg.rating)}
                      <span className="text-2xl font-bold">{pkg.rating}</span>
                      <span className="text-muted-foreground">({pkg.reviews} reviews)</span>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(reviewsBreakdown).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-3">
                          <span className="w-16 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <Progress value={value} className="flex-1" />
                          <span className="text-sm text-muted-foreground w-8">{value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Leave a Review</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Your Rating:</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                          ))}
                        </div>
                      </div>
                      <Textarea placeholder="Share your experience..." />
                      <Button size="sm">Submit Review</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enquiry Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Send Enquiry
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name"
                          placeholder="Enter your name" 
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="city">City of Residence</Label>
                        <Input 
                          id="city"
                          placeholder="Enter your city" 
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="Enter your email" 
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="countryCode">Country Code</Label>
                        <Select 
                          value={formData.countryCode}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, countryCode: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+1">+1 (US)</SelectItem>
                            <SelectItem value="+44">+44 (UK)</SelectItem>
                            <SelectItem value="+91">+91 (IN)</SelectItem>
                            <SelectItem value="+61">+61 (AU)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-3">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone"
                          placeholder="Enter your phone number" 
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea 
                        id="message"
                        placeholder="Any specific requirements or questions..." 
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button type="submit" className="flex-1">Send Enquiry</Button>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>+1-800-TRAVEL</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>info@travel.com</span>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={enlargedImage} 
              alt="Enlarged view" 
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageDetailModal;