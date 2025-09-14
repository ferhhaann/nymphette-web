import React from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const IndexSimple = () => {
  return (
    <div className="min-h-screen bg-background">
      <header>
        <div className="animate-fade-in">
          <Navigation />
        </div>
      </header>
      <main>
        <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <Hero />
        </div>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center">More content coming...</h1>
        </div>
      </main>
      <footer className="animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
        <Footer />
      </footer>
    </div>
  );
};

export default IndexSimple;