import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionLanding from "@/components/regions/RegionLanding";
import type { TravelPackage } from "@/data/packagesData";
import hero1 from "@/assets/hero-travel.jpg";
import hero2 from "@/assets/destinations-collage.jpg";
import hero3 from "@/assets/regions-world.jpg";

// TODO: Replace with API call
const africaPackagesData: TravelPackage[] = [
  {
    "id": "afr-001",
    "title": "Kenya Safari Adventure",
    "country": "Kenya",
    "countrySlug": "kenya",
    "region": "Africa",
    "duration": "8 Days / 7 Nights",
    "price": "₹95,000",
    "rating": 4.9,
    "reviews": 98,
    "image": "/src/assets/regions-world.jpg",
    "highlights": ["Masai Mara", "Big Five Safari", "Maasai Village", "Great Migration"],
    "inclusions": ["Flights", "Safari Lodges", "All Meals", "Game Drives", "Park Fees"],
    "exclusions": ["Tips", "Drinks", "Personal Items", "Optional Activities"],
    "category": "Wildlife & Adventure",
    "bestTime": "Jul - Oct",
    "groupSize": "2-12 people",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Nairobi",
        "description": "Welcome to Kenya! Gateway to African safari.",
        "activities": ["Airport pickup", "Hotel check-in", "City tour"],
        "meals": ["Dinner"],
        "accommodation": "Safari lodge"
      }
    ]
  }
];

const Africa: React.FC = () => {
  // TODO: Replace with API call - const packages = await fetchAfricaPackages();
  const packages = africaPackagesData;
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <RegionLanding
        regionKey="africa"
        title="Africa Tour Packages"
        description="All-inclusive African safaris and tours with stays, transfers, guided game drives and activities. Customize for families, honeymooners and luxury."
        canonical="/regions/africa"
        data={packages}
        heroImages={[hero1, hero2, hero3]}
      />
      <Footer />
    </div>
  );
};

export default Africa;
