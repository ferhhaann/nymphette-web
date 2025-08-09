import React, { useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionLanding from "@/components/regions/RegionLanding";
import middleEastData from "@/data/regions/middleEast.json";
import middleEastCountries from "@/data/regionCountries/middleEast.json";
import type { TravelPackage } from "@/data/packagesData";
import hero1 from "@/assets/hero-travel.jpg";
import hero2 from "@/assets/destinations-collage.jpg";
import hero3 from "@/assets/regions-world.jpg";

const MiddleEast: React.FC = () => {
  const packages: TravelPackage[] = useMemo(() => (middleEastData as unknown as TravelPackage[]), []);
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
        countryData={middleEastCountries as any}
      />
      <Footer />
    </div>
  );
};

export default MiddleEast;
