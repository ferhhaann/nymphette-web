import React, { useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionLanding from "@/components/regions/RegionLanding";
import africaData from "@/data/regions/africa.json";
import africaCountries from "@/data/regionCountries/africa.json";
import type { TravelPackage } from "@/data/packagesData";
import hero1 from "@/assets/hero-travel.jpg";
import hero2 from "@/assets/destinations-collage.jpg";
import hero3 from "@/assets/regions-world.jpg";

const Africa: React.FC = () => {
  const packages: TravelPackage[] = useMemo(() => (africaData as unknown as TravelPackage[]), []);
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
        countryData={africaCountries as any}
      />
      <Footer />
    </div>
  );
};

export default Africa;
