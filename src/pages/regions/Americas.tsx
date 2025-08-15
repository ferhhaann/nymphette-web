import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionLanding from "@/components/regions/RegionLanding";
import type { TravelPackage } from "@/data/packagesData";
import hero1 from "@/assets/hero-travel.jpg";
import hero2 from "@/assets/destinations-collage.jpg";
import hero3 from "@/assets/regions-world.jpg";

// TODO: Replace with API call
const americasPackagesData: TravelPackage[] = [
  {
    "id": "ame-001",
    "title": "USA East Coast Explorer",
    "country": "USA",
    "countrySlug": "usa",
    "region": "Americas",
    "duration": "12 Days / 11 Nights",
    "price": "₹1,75,000",
    "rating": 4.6,
    "reviews": 145,
    "image": "/src/assets/regions-world.jpg",
    "highlights": ["Statue of Liberty", "Times Square", "White House", "Niagara Falls"],
    "inclusions": ["Flights", "Hotels", "Internal Flights", "Breakfast", "City Tours"],
    "exclusions": ["Meals", "Shopping", "Optional Tours", "Tips"],
    "category": "Urban & Scenic",
    "bestTime": "Apr - Oct",
    "groupSize": "4-25 people",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in New York",
        "description": "Welcome to the Big Apple!",
        "activities": ["JFK Airport arrival", "Times Square visit", "Broadway show"],
        "meals": ["Welcome dinner"],
        "accommodation": "Manhattan hotel"
      }
    ]
  }
];

const Americas: React.FC = () => {
  // TODO: Replace with API call - const packages = await fetchAmericasPackages();
  const packages = americasPackagesData;
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <RegionLanding
        regionKey="americas"
        title="Americas Tour Packages"
        description="All-inclusive North & South America holidays with hotels, transfers, sightseeing and activities. Customize for every budget and style."
        canonical="/regions/americas"
        data={packages}
        heroImages={[hero1, hero2, hero3]}
      />
      <Footer />
    </div>
  );
};

export default Americas;
