import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedPackages from "@/components/FeaturedPackages";
import PopularDestinations from "@/components/PopularDestinations";
import WhyChooseUs from "@/components/WhyChooseUs";
import SEOContent from "@/components/SEOContent";
import Footer from "@/components/Footer";
import { preloadCriticalImages } from "@/hooks/useImagePreloader";
import { useStaticSEO } from "@/hooks/useStaticSEO";
import { useEffect } from "react";
import heroImage from "@/assets/hero-mountain-road.jpg";
import regionsImage from "@/assets/regions-world.jpg";

const Index = () => {
  try {
    useStaticSEO();
  } catch (error) {
    console.error('SEO error:', error);
  }
  
  useEffect(() => {
    preloadCriticalImages([heroImage, regionsImage]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <FeaturedPackages />
        <PopularDestinations />
        <WhyChooseUs />
        <SEOContent />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
