import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionLanding from "@/components/regions/RegionLanding";
import type { TravelPackage } from "@/data/packagesData";
import hero1 from "@/assets/europe/eiffel.jpg";
import hero2 from "@/assets/europe/santorini.jpg";
import hero3 from "@/assets/europe/alps.jpg";

// TODO: Replace with API call
const europePackagesData: TravelPackage[] = [
  {
    "id": "eur-001",
    "title": "European Grand Tour",
    "country": "France, Italy, Switzerland",
    "countrySlug": "multi-country",
    "region": "Europe", 
    "duration": "12 Days / 11 Nights",
    "price": "₹1,25,000",
    "rating": 4.9,
    "reviews": 156,
    "image": "/src/assets/regions-world.jpg",
    "highlights": ["Eiffel Tower", "Colosseum", "Swiss Alps", "Rhine Valley"],
    "inclusions": ["Flights", "Hotels", "Eurail Pass", "Breakfast", "City Tours"],
    "exclusions": ["Lunch & Dinner", "Personal Expenses", "Tips", "Travel Insurance"],
    "category": "Cultural & Scenic",
    "bestTime": "Apr - Oct",
    "groupSize": "4-25 people",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Paris",
        "description": "Welcome to the City of Light! Transfer to hotel and evening at leisure.",
        "activities": ["Airport pickup", "Hotel check-in", "Seine River evening cruise"],
        "meals": ["Welcome dinner"],
        "accommodation": "4-star hotel in central Paris"
      }
    ]
  }
];

const Europe: React.FC = () => {
  // TODO: Replace with API call - const packages = await fetchEuropePackages();
  const packages = europePackagesData;
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <RegionLanding
        regionKey="europe"
        title="Europe Tour Packages"
        description="All-inclusive Europe holidays with accommodation, transfers, sightseeing, and activities. Customize for families, honeymooners, luxury and more."
        canonical="/regions/europe"
        data={packages}
        heroImages={[hero1, hero2, hero3]}
      />
      <Footer />
    </div>
  );
};

export default Europe;
