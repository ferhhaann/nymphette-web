import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionLanding from "@/components/regions/RegionLanding";
import type { TravelPackage } from "@/data/packagesData";
import hero1 from "@/assets/hero-travel.jpg";
import hero2 from "@/assets/destinations-collage.jpg";
import hero3 from "@/assets/regions-world.jpg";

// TODO: Replace with API call
const middleEastPackagesData: TravelPackage[] = [
  {
    "id": "mid-001",
    "title": "Dubai Luxury Experience",
    "country": "UAE",
    "countrySlug": "uae",
    "region": "Middle East",
    "duration": "5 Days / 4 Nights",
    "price": "₹55,000",
    "rating": 4.7,
    "reviews": 198,
    "image": "/src/assets/regions-world.jpg",
    "highlights": ["Burj Khalifa", "Desert Safari", "Dubai Mall", "Palm Jumeirah"],
    "inclusions": ["Flights", "5-star Hotels", "Breakfast", "Desert Safari", "City Tour"],
    "exclusions": ["Lunch & Dinner", "Shopping", "Optional Activities"],
    "category": "Luxury & Modern",
    "bestTime": "Nov - Mar",
    "groupSize": "2-20 people",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Dubai",
        "description": "Welcome to the city of gold!",
        "activities": ["Airport pickup", "Hotel check-in", "Dubai Fountain show"],
        "meals": ["Welcome dinner"],
        "accommodation": "5-star hotel Downtown"
      }
    ]
  }
];

const MiddleEast: React.FC = () => {
  // TODO: Replace with API call - const packages = await fetchMiddleEastPackages();
  const packages = middleEastPackagesData;
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <RegionLanding
        regionKey="middle-east"
        title="Middle East Tour Packages"
        description="All-inclusive Middle East luxury tours with 5-star stays, drivers & guides, desert safaris and activities. Fully customizable itineraries."
        canonical="/regions/middle-east"
        data={packages}
        heroImages={[hero1, hero2, hero3]}
      />
      <Footer />
    </div>
  );
};

export default MiddleEast;
