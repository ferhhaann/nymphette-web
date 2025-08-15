import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionLanding from "@/components/regions/RegionLanding";
import type { TravelPackage } from "@/data/packagesData";
import hero1 from "@/assets/hero-travel.jpg";
import hero2 from "@/assets/destinations-collage.jpg";
import hero3 from "@/assets/regions-world.jpg";

// TODO: Replace with API call
const pacificIslandsPackagesData: TravelPackage[] = [
  {
    "id": "pac-001",
    "title": "Maldives Water Villa Experience",
    "country": "Maldives",
    "countrySlug": "maldives",
    "region": "Pacific Islands",
    "duration": "6 Days / 5 Nights",
    "price": "₹85,000",
    "rating": 4.9,
    "reviews": 267,
    "image": "/src/assets/regions-world.jpg",
    "highlights": ["Water Villa", "Snorkeling", "Sunset Cruise", "Spa Treatment"],
    "inclusions": ["Seaplane Transfer", "Water Villa", "All Meals", "Activities", "Spa"],
    "exclusions": ["Flights to Male", "Alcohol", "Personal Expenses"],
    "category": "Luxury & Romance",
    "bestTime": "Nov - Apr",
    "groupSize": "2-8 people",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Paradise",
        "description": "Welcome to your tropical paradise!",
        "activities": ["Seaplane transfer", "Resort check-in", "Welcome cocktail"],
        "meals": ["Lunch", "Dinner"],
        "accommodation": "Overwater villa"
      }
    ]
  }
];

const PacificIslands: React.FC = () => {
  // TODO: Replace with API call - const packages = await fetchPacificIslandsPackages();
  const packages = pacificIslandsPackagesData;
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <RegionLanding
        regionKey="pacific-islands"
        title="Pacific Islands Tour Packages"
        description="All-inclusive island escapes with resorts, transfers, water activities and romantic add-ons. Customize for families and honeymooners."
        canonical="/regions/pacific-islands"
        data={packages}
        heroImages={[hero1, hero2, hero3]}
      />
      <Footer />
    </div>
  );
};

export default PacificIslands;
