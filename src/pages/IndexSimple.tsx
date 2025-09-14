import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const IndexSimple = () => {
  return (
    <div className="min-h-screen bg-background">
      <header>
        <Navigation />
      </header>
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center">Nymphette Tours</h1>
          <p className="text-center mt-4 text-lg">Welcome to our travel website</p>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default IndexSimple;