import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, MapPin, Eye } from "lucide-react";
import { TravelPackage } from "@/data/packagesData";

interface PackageCardProps {
  package: TravelPackage;
  onViewDetails: (packageId: string) => void;
}

const PackageCard = ({ package: pkg, onViewDetails }: PackageCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-travel transition-all duration-500 animate-fade-in">
      <div className="relative overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-accent text-white">{pkg.category}</Badge>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{pkg.rating}</span>
          </div>
        </div>
        {pkg.originalPrice && (
          <div className="absolute bottom-4 right-4">
            <Badge variant="destructive" className="bg-red-500">
              Save ₹{parseInt(pkg.originalPrice.replace('₹', '').replace(',', '')) - parseInt(pkg.price.replace('₹', '').replace(',', ''))}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{pkg.title}</h3>
        
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{pkg.country}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {pkg.duration}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {pkg.groupSize}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Best Time: {pkg.bestTime}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
            <span>{pkg.rating} ({pkg.reviews} reviews)</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {pkg.highlights.slice(0, 3).map((highlight, idx) => (
            <Badge key={idx} variant="outline" className="border-soft-blue text-deep-blue text-xs">
              {highlight}
            </Badge>
          ))}
          {pkg.highlights.length > 3 && (
            <Badge variant="outline" className="border-soft-blue text-deep-blue text-xs">
              +{pkg.highlights.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <div>
          {pkg.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{pkg.originalPrice}</span>
          )}
          <div className="text-2xl font-bold text-accent">{pkg.price}</div>
          <span className="text-xs text-muted-foreground">per person</span>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(pkg.id)}
            className="border-accent text-accent hover:bg-accent hover:text-white"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button className="bg-accent hover:bg-bright-blue text-white">
            Book Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PackageCard;