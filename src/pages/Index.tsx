import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import FeaturedPackages from "@/components/FeaturedPackages";
import TopValues from "@/components/TopValues";
import PromoBanner from "@/components/PromoBanner";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import { preloadCriticalImages } from "@/hooks/useImagePreloader";
import { useEffect } from "react";
import heroImage from "@/assets/hero-mountain-road.jpg";
import regionsImage from "@/assets/regions-world.jpg";
const Index = () => {
  useEffect(() => {
    // Preload critical images for faster loading
    preloadCriticalImages([heroImage, regionsImage]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="animate-fade-in">
        <Navigation />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <Hero />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <SearchSection />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        <TopValues />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
        <FeaturedPackages />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
        <PromoBanner />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
        <WhyChooseUs />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
