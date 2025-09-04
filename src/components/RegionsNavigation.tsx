import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

const regions = [
  { name: "Asia", slug: "asia", description: "Exotic temples, bustling cities & pristine beaches" },
  { name: "Europe", slug: "europe", description: "Historic landmarks, art & cultural heritage" },
  { name: "Africa", slug: "africa", description: "Wildlife safaris, cultural diversity & adventure" },
  { name: "Americas", slug: "americas", description: "Natural wonders, vibrant cities & ancient ruins" },
  { name: "Pacific Islands", slug: "pacific-islands", description: "Tropical paradise, coral reefs & island culture" },
  { name: "Middle East", slug: "middle-east", description: "Desert landscapes, luxury & ancient history" }
];

const RegionsNavigation = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Explore by Region</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover incredible destinations across the globe with our curated travel packages
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region, index) => (
            <Link key={region.slug} to={`/regions/${region.slug}`}>
              <Card className="group hover:shadow-card-soft transition-all duration-300 cursor-pointer animate-fade-in h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {region.name}
                    </h3>
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {region.description}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <Badge variant="outline" className="text-primary border-primary">
                      Explore Region
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegionsNavigation;