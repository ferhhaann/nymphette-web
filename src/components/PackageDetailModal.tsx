import { useState } from "react";
import { TravelPackage } from "@/data/packagesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Heart,
  Share2
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
      { src: "/places/thailand/bangkok.jpg", alt: "Bangkok Grand Palace" },
      { src: "/places/thailand/phuket.jpg", alt: "Phuket Beach" },
      { src: "/places/thailand/chiang-mai.jpg", alt: "Chiang Mai Temples" }
    ];
  }
  if (slug === "japan") {
    return [
      { src: "/places/japan/tokyo.jpg", alt: "Tokyo Skyline" },
      { src: "/places/japan/mount-fuji.jpg", alt: "Mount Fuji" },
      { src: "/places/japan/arashiyama-bamboo-grove.jpg", alt: "Kyoto Bamboo Grove" },
      { src: "/places/japan/fushimi-inari-shrine.jpg", alt: "Fushimi Inari Shrine" }
    ];
  }
  if (slug === "indonesia") {
    return [
      { src: "/places/indonesia/bali.jpg", alt: "Bali Rice Terraces" }
    ];
  }
  if (slug === "china") {
    return [
      { src: "/places/china/beijing.jpg", alt: "Beijing Forbidden City" }
    ];
  }
  if (slug === "kazakhstan") {
    return [
      { src: "/places/kazakhstan/almaty.jpg", alt: "Almaty Mountains" }
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
    { src: "/places/thailand/bangkok.jpg", alt: "Travel Destination" }
  ];
};

const PackageDetailModal = ({ package: pkg, onClose, onBook }: PackageDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  
  const placeImages = getPlaceImages(pkg.countrySlug, pkg.country);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % placeImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + placeImages.length) % placeImages.length);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-background">
        <CardHeader className="relative p-0">
          {/* Image Gallery */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={placeImages[currentImageIndex].src}
              alt={placeImages[currentImageIndex].alt}
              className="w-full h-full object-cover"
              loading="eager"
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
            
            {/* Action buttons */}
            <div className="absolute top-4 left-4 flex space-x-2">
              <Badge className="bg-foreground text-background">{pkg.category}</Badge>
              <button className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                <Heart className="h-4 w-4" />
              </button>
              <button className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>

        <ScrollArea className="max-h-[calc(90vh-20rem)] overflow-auto">
          <CardContent className="p-6">
            {/* Package Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-2">{pkg.title}</h1>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{pkg.country}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {pkg.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {pkg.groupSize}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Best: {pkg.bestTime}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {pkg.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">{pkg.originalPrice}</span>
                  )}
                  <div className="text-3xl font-bold text-accent">{pkg.price}</div>
                  <span className="text-sm text-muted-foreground">per person</span>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{pkg.rating}</span>
                    <span className="text-muted-foreground ml-1">({pkg.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-4 mb-6 border-b">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "itinerary", label: "Itinerary" },
                  { id: "inclusions", label: "Inclusions" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2 px-1 border-b-2 transition-colors ${
                      activeTab === tab.id 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.map((highlight, idx) => (
                        <Badge key={idx} variant="outline" className="border-primary text-primary">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "itinerary" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Day-by-Day Itinerary</h3>
                  {pkg.itinerary.map((day, idx) => (
                    <Card key={idx} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <Badge variant="outline" className="mr-3">Day {day.day}</Badge>
                          <h4 className="font-semibold">{day.title}</h4>
                        </div>
                        <p className="text-muted-foreground mb-3">{day.description}</p>
                        
                        {day.activities && day.activities.length > 0 && (
                          <div className="mb-2">
                            <span className="font-medium text-sm">Activities: </span>
                            <span className="text-sm text-muted-foreground">
                              {day.activities.join(", ")}
                            </span>
                          </div>
                        )}
                        
                        {day.meals && day.meals.length > 0 && (
                          <div className="mb-2">
                            <span className="font-medium text-sm">Meals: </span>
                            <span className="text-sm text-muted-foreground">
                              {day.meals.join(", ")}
                            </span>
                          </div>
                        )}
                        
                        {day.accommodation && (
                          <div>
                            <span className="font-medium text-sm">Stay: </span>
                            <span className="text-sm text-muted-foreground">
                              {day.accommodation}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === "inclusions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-600">What's Included</h3>
                    <ul className="space-y-2">
                      {pkg.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-600">What's Not Included</h3>
                    <ul className="space-y-2">
                      {pkg.exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <XIcon className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90" onClick={() => onBook?.(pkg)}>
                Book Now - {pkg.price}
              </Button>
              <Button size="lg" variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-white">
                Add to Wishlist
              </Button>
              <Button size="lg" variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default PackageDetailModal;