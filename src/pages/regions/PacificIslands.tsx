import React, { useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionLanding from "@/components/regions/RegionLanding";
import pacificIslandsData from "@/data/regions/pacificIslands.json";
import pacificCountries from "@/data/regionCountries/pacificIslands.json";
import type { TravelPackage } from "@/data/packagesData";
import hero1 from "@/assets/hero-travel.jpg";
import hero2 from "@/assets/destinations-collage.jpg";
import hero3 from "@/assets/regions-world.jpg";

const PacificIslands: React.FC = () => {
  const packages: TravelPackage[] = useMemo(() => (pacificIslandsData as unknown as TravelPackage[]), []);
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
        countryData={pacificCountries as any}
      />
      <Footer />
    </div>
  );
};

export default PacificIslands;
