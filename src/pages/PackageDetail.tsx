import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TravelPackage } from "@/data/packagesData";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
  ArrowLeft,
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
  ZoomIn,
  Heart
} from "lucide-react";

// Import content configuration
import packageDetailContent from "@/data/packageDetailContent.json";

// Import all region data to find packages
import asiaMerged from "@/data/regions/asia.data";
import europeMerged from "@/data/regions/europe.data";
import africaMerged from "@/data/regions/africa.data";
import americasMerged from "@/data/regions/americas.data";
import pacificIslandsMerged from "@/data/regions/pacificIslands.data";
import middleEastMerged from "@/data/regions/middleEast.data";

// Get all packages from all regions
const getAllPackages = (): TravelPackage[] => {
  const allRegions = [
    asiaMerged,
    europeMerged,
    africaMerged,
    americasMerged,
    pacificIslandsMerged,
    middleEastMerged
  ];
  
  return allRegions.flatMap(region => 
    Object.values((region as any).countries || {}).flatMap((c: any) => c.packages || [])
  ) as TravelPackage[];
};

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

const PackageDetail = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pkg, setPkg] = useState<TravelPackage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    email: "",
    phone: "",
    countryCode: "+1",
    message: "",
  });

  useEffect(() => {
    if (packageId) {
      const allPackages = getAllPackages();
      const foundPackage = allPackages.find(p => p.id === packageId);
      setPkg(foundPackage || null);
      
      if (foundPackage) {
        // Set page title and meta using content from JSON
        const title = packageDetailContent.meta.titleTemplate
          .replace('{packageTitle}', foundPackage.title);
        document.title = title;
        
        const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
        if (metaDesc) {
          metaDesc.content = packageDetailContent.meta.descriptionTemplate
            .replace('{packageTitle}', foundPackage.title)
            .replace('{country}', foundPackage.country)
            .replace('{duration}', foundPackage.duration);
        }
      }
    }
  }, [packageId]);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{packageDetailContent.ui.messages.packageNotFound.title}</h1>
            <Button onClick={() => navigate('/')}>{packageDetailContent.ui.messages.packageNotFound.action}</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    toast({
      title: packageDetailContent.ui.messages.enquirySent.title,
      description: packageDetailContent.ui.messages.enquirySent.description,
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

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? packageDetailContent.ui.messages.wishlistRemoved.title : packageDetailContent.ui.messages.wishlistAdded.title,
      description: isWishlisted ? packageDetailContent.ui.messages.wishlistRemoved.description : packageDetailContent.ui.messages.wishlistAdded.description,
    });
  };

  // Reviews breakdown from JSON
  const reviewsBreakdown = packageDetailContent.content.reviewsBreakdown;

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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {packageDetailContent.ui.buttons.back}
          </Button>
      </div>

      {/* Hero Section with Image Gallery */}
      <div className="max-w-6xl mx-auto px-4">
        <Card className="overflow-hidden">
          <div className="relative h-96 overflow-hidden">
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
                <div className="text-right flex items-end gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleWishlist}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <div>
                    {pkg.originalPrice && (
                      <span className="text-lg text-white/70 line-through">{pkg.originalPrice}</span>
                    )}
                    <div className="text-3xl font-bold">{pkg.price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Facts Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{packageDetailContent.ui.labels.duration}</div>
                  <div className="text-sm text-muted-foreground">{pkg.duration}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{packageDetailContent.ui.labels.groupSize}</div>
                  <div className="text-sm text-muted-foreground">{pkg.groupSize}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{packageDetailContent.ui.labels.bestTime}</div>
                  <div className="text-sm text-muted-foreground">{pkg.bestTime}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Languages className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{packageDetailContent.ui.labels.languages}</div>
                  <div className="text-sm text-muted-foreground">{packageDetailContent.content.defaultLanguages.join(", ")}</div>
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
              <h2 className="text-2xl font-semibold mb-3">{packageDetailContent.ui.labels.overview}</h2>
              <p className="text-muted-foreground mb-4">
                {packageDetailContent.content.overviewTemplate
                  .replace('{country}', pkg.country)
                  .replace('{duration}', pkg.duration)}
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
              <h2 className="text-2xl font-semibold mb-4">{packageDetailContent.ui.labels.itinerary}</h2>
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
                    {packageDetailContent.ui.labels.included}
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
                    {packageDetailContent.ui.labels.excluded}
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
          </div>

          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>{packageDetailContent.ui.buttons.bookNow}</CardTitle>
                <div className="text-3xl font-bold text-primary">{pkg.price}</div>
                <p className="text-sm text-muted-foreground">per person</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">{packageDetailContent.ui.labels.name} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={packageDetailContent.ui.placeholders.name}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">{packageDetailContent.ui.labels.email} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder={packageDetailContent.ui.placeholders.email}
                      required
                    />
                  </div>
                  
                    <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="countryCode">Code</Label>
                      <Select value={formData.countryCode} onValueChange={(value) => setFormData({...formData, countryCode: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {packageDetailContent.content.countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.code} ({country.country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="phone">{packageDetailContent.ui.labels.phone} *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder={packageDetailContent.ui.placeholders.phone}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="city">{packageDetailContent.ui.labels.city}</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder={packageDetailContent.ui.placeholders.city}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">{packageDetailContent.ui.labels.message}</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder={packageDetailContent.ui.placeholders.message}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {packageDetailContent.ui.buttons.sendEnquiry}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Phone className="h-3 w-3" />
                      <span>+1-800-TRAVEL</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>info@travel.com</span>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setEnlargedImage(null)}>
          <img
            src={enlargedImage}
            alt="Enlarged view"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setEnlargedImage(null)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PackageDetail;