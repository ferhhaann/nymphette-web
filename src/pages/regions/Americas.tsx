import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegionPackages from "@/components/RegionPackages";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

const Americas = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setMeta(
      "Americas Travel Packages | Explore Americas Tours",
      "Discover curated Americas travel packages: cities, nature, culture. Book American holidays now.",
      "/regions/americas"
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 mt-6 mb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-6">Americas Travel Packages</h1>
        <RegionPackages region="Americas" onBack={() => navigate("/packages")} />
      </main>
      <Footer />
    </div>
  );
};

export default Americas;
