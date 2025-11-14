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
  console.log('Index component rendering...');
  
  // Initialize SEO settings
  try {
    useStaticSEO(); // This will fetch and apply SEO settings from database
    console.log('SEO initialized successfully');
  } catch (error) {
    console.error('SEO error:', error);
  }
  
  useEffect(() => {
    console.log('Index useEffect - preloading images');
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
      <Navigation />
      <main>
        <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <Hero />
        </div>
        <section className="animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <FeaturedPackages />
        </section>
        <section className="animate-fade-in" style={{ animationDelay: '0.45s', animationFillMode: 'both' }}>
          <PopularDestinations />
        </section>
        <section className="animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <WhyChooseUs />
        </section>
        <section className="animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
          <SEOContent />
        </section>
      </main>
      <footer className="animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
        <Footer />
      </footer>
    </div>
  );
};

export default Index;
