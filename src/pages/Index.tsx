import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import FeaturedPackages from "@/components/FeaturedPackages";
import TopValues from "@/components/TopValues";
import PromoBanner from "@/components/PromoBanner";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { preloadCriticalImages } from "@/hooks/useImagePreloader";
import { useStaticSEO } from "@/hooks/useStaticSEO";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { useEffect } from "react";
import heroImage from "@/assets/hero-mountain-road.jpg";
import regionsImage from "@/assets/regions-world.jpg";
const Index = () => {
  // Add error boundary for hooks
  try {
    useStaticSEO(); // This will fetch and apply SEO settings from database
    usePerformanceOptimization();
  } catch (error) {
    console.error('Hook error:', error);
  }
  
  useEffect(() => {
    // Preload critical images for faster loading
    preloadCriticalImages([heroImage, regionsImage]);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Nymphette Tours - Premium Travel Packages & Group Tours",
    "description": "Discover premium travel packages, curated group tours, and custom trips worldwide with expert travel planning and 24/7 support.",
    "url": "/",
    "mainEntity": {
      "@type": "TravelAgency",
      "name": "Nymphette Tours",
      "description": "Premium travel agency specializing in curated packages, group tours, and custom trips to destinations worldwide.",
      "serviceType": ["Travel Packages", "Group Tours", "Custom Trips", "Luxury Travel"],
      "areaServed": ["Asia", "Europe", "Africa", "Americas", "Pacific Islands", "Middle East"]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Nymphette Tours - Premium Travel Packages & Group Tours Worldwide"
        description="Discover premium travel packages, curated group tours, and custom trips to Asia, Europe, Africa & more. Expert travel planning with 24/7 support. Book your dream vacation today!"
        keywords="travel packages, group tours, custom trips, Asia tours, Europe travel, Africa safari, vacation packages, travel agency, international tours, luxury travel, honeymoon packages"
        structuredData={structuredData}
      />
      <header>
        <div className="animate-fade-in">
          <Navigation />
        </div>
      </header>
      <main>
        <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <Hero />
        </div>
        <section className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <SearchSection />
        </section>
        <section className="animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <TopValues />
        </section>
        <section className="animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <FeaturedPackages />
        </section>
        <section className="animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <PromoBanner />
        </section>
        <section className="animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <WhyChooseUs />
        </section>
      </main>
      <footer className="animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
        <Footer />
      </footer>
    </div>
  );
};

export default Index;
