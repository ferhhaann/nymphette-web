import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageItinerary } from "@/data/packagesData";
import { Calendar, MapPin, Utensils, Home, X } from "lucide-react";

interface PackageItineraryProps {
  itinerary: PackageItinerary[];
  packageTitle: string;
  onClose: () => void;
}

const PackageItineraryComponent = ({ itinerary, packageTitle, onClose }: PackageItineraryProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">{packageTitle} - Detailed Itinerary</h2>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {itinerary.map((day, index) => (
            <Card key={day.day} className="overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="bg-card-gradient">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-accent text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      {day.day}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary">{day.title}</h3>
                      <p className="text-muted-foreground text-sm">{day.description}</p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Activities */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="h-5 w-5 text-accent" />
                      <h4 className="font-semibold text-primary">Activities</h4>
                    </div>
                    <ul className="space-y-2">
                      {day.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Meals & Accommodation */}
                  <div className="space-y-4">
                    {/* Meals */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Utensils className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold text-primary">Meals Included</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {day.meals.map((meal, idx) => (
                          <Badge key={idx} variant="outline" className="border-green-500 text-green-700">
                            {meal}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Accommodation */}
                    {day.accommodation && (
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Home className="h-5 w-5 text-accent" />
                          <h4 className="font-semibold text-primary">Accommodation</h4>
                        </div>
                        <p className="text-muted-foreground">{day.accommodation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-accent hover:bg-bright-blue text-white">
              Book This Package
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageItineraryComponent;