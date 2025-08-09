import React, { useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionLanding from "@/components/regions/RegionLanding";
import asiaData from "@/data/regions/asia.json";
import type { TravelPackage } from "@/data/packagesData";
import hero1 from "@/assets/hero-travel.jpg";
import hero2 from "@/assets/destinations-collage.jpg";
import hero3 from "@/assets/regions-world.jpg";

const Asia: React.FC = () => {
  const packages: TravelPackage[] = useMemo(() => (asiaData as unknown as TravelPackage[]), []);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <RegionLanding
        regionKey="asia"
        title="Asia Tour Packages"
        description="All-inclusive Asia trips with hotels, transfers, sightseeing, activities and Indian meals on request. Tailor for couples, families, adventure, and luxury."
        canonical="/regions/asia"
        data={packages}
        heroImages={[hero1, hero2, hero3]}
      />
      <Footer />
    </div>
  );
};

export default Asia;
