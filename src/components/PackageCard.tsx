import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Star, MapPin } from "lucide-react";
import { TravelPackage } from "@/data/packagesData";

interface PackageCardProps {
  package: TravelPackage;
  onViewDetails: (packageId: string) => void;
}

const PackageCard = ({ package: pkg, onViewDetails }: PackageCardProps) => {
  // Use database image first, fallback to static paths if null/empty
  const getPackageImage = () => {
    if (pkg.image && pkg.image.trim() !== '') {
      return pkg.image;
    }
    
    // Fallback to static images only if database image is empty
    const countrySlug = pkg.countrySlug;
    if (countrySlug === "thailand") return "/places/thailand/bangkok.jpg";
    if (countrySlug === "japan") return "/places/japan/tokyo.jpg";
    if (countrySlug === "indonesia") return "/places/indonesia/bali.jpg";
    if (countrySlug === "china") return "/places/china/beijing.jpg";
    if (countrySlug === "kazakhstan") return "/places/kazakhstan/almaty.jpg";
    if (countrySlug === "malaysia") return "/places/malaysia/kuala-lumpur.jpg";
    if (countrySlug === "philippines") return "/places/philippines/manila.jpg";
    if (countrySlug === "south-korea") return "/places/south-korea/seoul.jpg";
    if (countrySlug === "vietnam") return "/places/vietnam/ho-chi-minh.jpg";
    if (countrySlug === "maldives") return "/places/maldives/male-city.jpg";
    if (countrySlug === "uae") return "/places/uae/dubai-marina.jpg";
    if (countrySlug === "usa") return "/places/usa/times-square.jpg";
    if (countrySlug === "kenya") return "/places/kenya/masai-mara.jpg";
    
    return "/placeholder.svg"; // Final fallback
  };

  const packageImage = getPackageImage();
  
  return (
    <Card className="group overflow-hidden hover:shadow-card-soft transition-all duration-300 cursor-pointer"
          onClick={() => onViewDetails(pkg.id)}>
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={packageImage}
          alt={pkg.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-foreground text-background text-xs">{pkg.category}</Badge>
        </div>
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{pkg.rating}</span>
          </div>
        </div>
        {pkg.originalPrice && (
          <div className="absolute bottom-4 right-4">
            <Badge className="bg-destructive text-destructive-foreground text-xs">
              Save ₹{parseInt(pkg.originalPrice.replace('₹', '').replace(',', '')) - parseInt(pkg.price.replace('₹', '').replace(',', ''))}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-primary mb-2 line-clamp-1">{pkg.title}</h3>
        
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="text-sm">{pkg.country}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span>{pkg.duration}</span>
          <span>{pkg.groupSize}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {pkg.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{pkg.originalPrice}</span>
            )}
            <div className="text-xl font-bold text-accent">{pkg.price}</div>
          </div>
          <Button 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(pkg.id);
            }}
            className="bg-foreground hover:bg-foreground/90 text-background"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageCard;