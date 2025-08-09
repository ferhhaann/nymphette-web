import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PackageCard from "@/components/PackageCard";
import PackageItineraryComponent from "@/components/PackageItinerary";
import regionsImage from "@/assets/regions-world.jpg";
import europeData from "@/data/regions/europe.json";
import { TravelPackage } from "@/data/packagesData";
import { useEffect, useMemo, useState } from "react";

const setMeta = (title: string, description: string, canonicalPath: string) => {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", description);
  let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  const url = new URL(canonicalPath, window.location.origin).toString();
  link.setAttribute("href", url);
};

const Europe = () => {
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [showItinerary, setShowItinerary] = useState(false);

  useEffect(() => {
    setMeta(
      "Europe Travel Packages | Explore Europe Tours",
      "Discover curated Europe travel packages: history, art, scenic beauty. Book European holidays now.",
      "/regions/europe"
    );
  }, []);

  const packages: TravelPackage[] = useMemo(
    () => (europeData as unknown as TravelPackage[]).map(p => ({ ...p, image: regionsImage })),
    []
  );

  const handleViewDetails = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId) || null;
    setSelectedPackage(pkg);
    setShowItinerary(!!pkg);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 mt-6 mb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-6">Europe Travel Packages</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <div key={pkg.id} style={{ animationDelay: `${index * 100}ms` }}>
              <PackageCard package={pkg} onViewDetails={handleViewDetails} />
            </div>
          ))}
        </div>

        {showItinerary && selectedPackage && (
          <PackageItineraryComponent
            itinerary={selectedPackage.itinerary}
            packageTitle={selectedPackage.title}
            onClose={() => setShowItinerary(false)}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Europe;
