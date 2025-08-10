import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedPackages from "@/components/FeaturedPackages";
import TopValues from "@/components/TopValues";
import PromoBanner from "@/components/PromoBanner";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <TopValues />
      <FeaturedPackages />
      <PromoBanner />
      <Footer />
    </div>
  );
};

export default Index;
