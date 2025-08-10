import React, { useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionLanding from "@/components/regions/RegionLanding";
import { RegionSidebar } from "@/components/regions/RegionSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import asiaMerged from "@/data/regions/asia.data";
import type { TravelPackage } from "@/data/packagesData";
import hero1 from "@/assets/hero-travel.jpg";
import hero2 from "@/assets/destinations-collage.jpg";
import hero3 from "@/assets/regions-world.jpg";

const Asia: React.FC = () => {
  const packages: TravelPackage[] = useMemo(() => (Object.values((asiaMerged as any).countries || {}).flatMap((c: any) => c.packages) as TravelPackage[]), []);
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background w-full">
        <header className="h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <Navigation />
          <SidebarTrigger className="ml-4" />
        </header>
        
        <div className="flex w-full">
          <RegionSidebar regionKey="asia" data={packages} />
          
          <main className="flex-1">
            <RegionLanding
              regionKey="asia"
              title="Asia Tour Packages"
              description="All-inclusive Asia trips with hotels, transfers, sightseeing, activities and Indian meals on request. Tailor for couples, families, adventure, and luxury."
              canonical="/regions/asia"
              data={packages}
              heroImages={[hero1, hero2, hero3]}
            />
            <Footer />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Asia;
