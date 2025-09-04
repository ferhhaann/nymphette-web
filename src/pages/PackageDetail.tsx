import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TravelPackage as TravelPackageType } from "@/data/packagesData";
import { usePackageById } from "@/hooks/usePackages";
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

// This component now uses the database via usePackageById hook

// Get package images - primary package image first, then additional place images
const getPackageImages = (pkg: TravelPackageType) => {
  const images = [];
  
  // Add the main package image first
  if (pkg.image) {
    images.push({ src: pkg.image, alt: pkg.title });
  }
  
  // Then add place images based on country
  const countrySlug = pkg.countrySlug || pkg.country?.toLowerCase().replace(/\s+/g, '-');
  const placeImages = getPlaceImagesByCountry(countrySlug);
  
  // Add place images, but avoid duplicating the main package image
  placeImages.forEach(placeImage => {
    if (placeImage.src !== pkg.image) {
      images.push(placeImage);
    }
  });
  
  return images.length > 0 ? images : [{ src: "/places/thailand/bangkok.webp", alt: "Travel Destination" }];
};

// Get additional place images for gallery
const getPlaceImagesByCountry = (countrySlug?: string) => {
  if (countrySlug === "thailand") {
    return [
      { src: "/places/thailand/bangkok.webp", alt: "Bangkok Grand Palace" },
      { src: "/places/thailand/phuket.webp", alt: "Phuket Beach" },
      { src: "/places/thailand/chiang-mai.webp", alt: "Chiang Mai Temples" }
    ];
  }
  if (countrySlug === "japan") {
    return [
      { src: "/places/japan/tokyo.webp", alt: "Tokyo Skyline" },
      { src: "/places/japan/mount-fuji.webp", alt: "Mount Fuji" },
      { src: "/places/japan/arashiyama-bamboo-grove.jpg", alt: "Kyoto Bamboo Grove" },
      { src: "/places/japan/fushimi-inari-shrine.jpg", alt: "Fushimi Inari Shrine" }
    ];
  }
  if (countrySlug === "indonesia") {
    return [
      { src: "/places/indonesia/bali.webp", alt: "Bali Rice Terraces" }
    ];
  }
  if (countrySlug === "china") {
    return [
      { src: "/places/china/beijing.webp", alt: "Beijing Forbidden City" }
    ];
  }
  if (countrySlug === "kazakhstan") {
    return [
      { src: "/places/kazakhstan/almaty.webp", alt: "Almaty Mountains" }
    ];
  }
  if (countrySlug === "malaysia") {
    return [
      { src: "/places/malaysia/kuala-lumpur.jpg", alt: "Kuala Lumpur Skyline" }
    ];
  }
  if (countrySlug === "philippines") {
    return [
      { src: "/places/philippines/manila.jpg", alt: "Manila Bay" }
    ];
  }
  if (countrySlug === "south-korea") {
    return [
      { src: "/places/south-korea/seoul.jpg", alt: "Seoul Skyline" }
    ];
  }
  if (countrySlug === "vietnam") {
    return [
      { src: "/places/vietnam/ho-chi-minh.jpg", alt: "Ho Chi Minh City" }
    ];
  }
  if (countrySlug === "singapore") {
    return [
      { src: "/places/singapore/singapore.jpg", alt: "Singapore Skyline" }
    ];
  }
  if (countrySlug === "cambodia") {
    return [
      { src: "/places/cambodia/angkor-wat.jpg", alt: "Angkor Wat Temple" }
    ];
  }
  if (countrySlug === "myanmar") {
    return [
      { src: "/places/myanmar/yangon.jpg", alt: "Yangon City" }
    ];
  }
  if (countrySlug === "laos") {
    return [
      { src: "/places/laos/luang-prabang.jpg", alt: "Luang Prabang" }
    ];
  }
  if (countrySlug === "taiwan") {
    return [
      { src: "/places/taiwan/taipei.jpg", alt: "Taipei City" }
    ];
  }
  if (countrySlug === "nepal") {
    return [
      { src: "/places/nepal/kathmandu.jpg", alt: "Kathmandu Valley" }
    ];
  }
  if (countrySlug === "sri-lanka") {
    return [
      { src: "/places/sri-lanka/colombo.jpg", alt: "Colombo City" }
    ];
  }
  if (countrySlug === "maldives") {
    return [
      { src: "/places/maldives/overwater-villas.jpg", alt: "Overwater Villas" },
      { src: "/places/maldives/banana-reef.jpg", alt: "Banana Reef" },
      { src: "/places/maldives/vaadhoo-island.jpg", alt: "Vaadhoo Island" },
      { src: "/places/maldives/sun-island.jpg", alt: "Sun Island Resort" }
    ];
  }
  if (countrySlug === "uae") {
    return [
      { src: "/places/uae/burj-khalifa.jpg", alt: "Burj Khalifa" },
      { src: "/places/uae/dubai-marina.jpg", alt: "Dubai Marina" },
      { src: "/places/uae/desert-safari.jpg", alt: "Desert Safari" },
      { src: "/places/uae/palm-jumeirah.jpg", alt: "Palm Jumeirah" }
    ];
  }
  if (countrySlug === "usa") {
    return [
      { src: "/places/usa/times-square.jpg", alt: "Times Square" },
      { src: "/places/usa/statue-of-liberty.jpg", alt: "Statue of Liberty" },
      { src: "/places/usa/grand-canyon.jpg", alt: "Grand Canyon" },
      { src: "/places/usa/niagara-falls.jpg", alt: "Niagara Falls" }
    ];
  }
  if (countrySlug === "kenya") {
    return [
      { src: "/places/kenya/masai-mara.jpg", alt: "Masai Mara Safari" },
      { src: "/places/kenya/amboseli-national-park.jpg", alt: "Amboseli National Park" },
      { src: "/places/kenya/lake-nakuru.jpg", alt: "Lake Nakuru" },
      { src: "/places/kenya/mount-kenya.jpg", alt: "Mount Kenya" }
    ];
  }
  
  return [];
};

const PackageDetail = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  console.log('PackageDetail: packageId =', packageId);
  const { packageData: pkg, loading, error } = usePackageById(packageId || '');
  console.log('PackageDetail: pkg =', pkg, 'loading =', loading, 'error =', error);
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
    if (pkg) {
      // Set page title and meta
      document.title = `${pkg.title} - Travel Package Details`;
      const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (metaDesc) {
        metaDesc.content = `Discover ${pkg.title} in ${pkg.country}. ${pkg.duration} journey with all-inclusive packages.`;
      }
    }
  }, [pkg]);

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

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
            <Button onClick={() => navigate('/')}>Return Home</Button>
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
  
  const placeImages = getPackageImages(pkg);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % placeImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + placeImages.length) % placeImages.length);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: isWishlisted ? "Package removed from your wishlist" : "Package added to your wishlist",
    });
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 py-6 mt-16">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="border-primary text-primary hover:bg-primary hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
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
                      <span className="text-lg text-white/70 line-through">
                        {typeof pkg.originalPrice === 'string' ? 
                            pkg.originalPrice.replace(/\$/g, '₹') : 
                            `₹${pkg.originalPrice}`}
                      </span>
                    )}
                    <div className="text-3xl font-bold">
                      {typeof pkg.price === 'string' ? 
                          pkg.price.replace(/\$/g, '₹') : 
                          `₹${pkg.price}`}
                    </div>
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
              <h2 className="text-2xl font-semibold mb-3">{pkg.overview?.sectionTitle || "Overview"}</h2>
              <p className="text-muted-foreground mb-4">
                {pkg.overview?.description || `Discover the beauty and culture of ${pkg.country} on this amazing ${pkg.duration.toLowerCase()} journey. Experience the highlights and hidden gems that make this destination truly special.`}
              </p>
              <div className="flex flex-wrap gap-2">
                {pkg.highlights.map((highlight, idx) => (
                  <Badge 
                    key={idx} 
                    variant={(pkg.overview?.highlightsBadgeVariant as any) || "outline"}
                    className={pkg.overview?.highlightsBadgeStyle || "border-primary text-primary"}
                  >
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
          </div>

          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Book This Package</CardTitle>
                <div className="text-3xl font-bold text-primary">
                  {typeof pkg.price === 'string' ? 
                      pkg.price.replace(/\$/g, '₹') : 
                      `₹${pkg.price}`}
                </div>
                <p className="text-sm text-muted-foreground">per person</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                          <SelectItem value="+1">+1</SelectItem>
                          <SelectItem value="+44">+44</SelectItem>
                          <SelectItem value="+91">+91</SelectItem>
                          <SelectItem value="+86">+86</SelectItem>
                          <SelectItem value="+81">+81</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Special Requirements</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Any special requirements or requests..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Send Enquiry
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