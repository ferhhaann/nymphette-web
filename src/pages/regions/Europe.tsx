import React, { useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionLanding from "@/components/regions/RegionLanding";
import europeData from "@/data/regions/europe.json";
import type { TravelPackage } from "@/data/packagesData";
import hero1 from "@/assets/europe/eiffel.jpg";
import hero2 from "@/assets/europe/santorini.jpg";
import hero3 from "@/assets/europe/alps.jpg";

const Europe: React.FC = () => {
  const packages: TravelPackage[] = useMemo(() => (europeData as unknown as TravelPackage[]), []);
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
