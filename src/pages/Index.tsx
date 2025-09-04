import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import RegionsNavigation from "@/components/RegionsNavigation";
import FeaturedPackages from "@/components/FeaturedPackages";
import TopValues from "@/components/TopValues";
import PromoBanner from "@/components/PromoBanner";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <SearchSection />
      <RegionsNavigation />
      <TopValues />
      <FeaturedPackages />
      <PromoBanner />
      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default Index;
