import React, { useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionLanding from "@/components/regions/RegionLanding";
import americasMerged from "@/data/regions/americas.data";
import type { TravelPackage } from "@/data/packagesData";
import hero1 from "@/assets/hero-travel.jpg";
import hero2 from "@/assets/destinations-collage.jpg";
import hero3 from "@/assets/regions-world.jpg";

const Americas: React.FC = () => {
  const packages: TravelPackage[] = useMemo(() => (Object.values((americasMerged as any).countries || {}).flatMap((c: any) => c.packages) as TravelPackage[]), []);
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
