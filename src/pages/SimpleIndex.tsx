import SimpleNavigation from "@/components/SimpleNavigation";

const SimpleIndex = () => {
  console.log('SimpleIndex rendering...');
  
  return (
    <div className="min-h-screen bg-background">
      <SimpleNavigation />
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 text-foreground">
              Discover Amazing Destinations
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Experience the world with our carefully curated travel packages. 
              From exotic beaches to mountain adventures, we have something for everyone.
            </p>
            <div className="space-x-4">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Explore Packages
              </button>
              <button className="border border-border text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
                Plan Custom Trip
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-accent/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Why Choose Us
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary-foreground text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Expert Planning</h3>
                <p className="text-muted-foreground">
                  Our travel experts plan every detail to ensure your perfect vacation.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary-foreground text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">5-Star Service</h3>
                <p className="text-muted-foreground">
                  Exceptional service and support throughout your entire journey.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary-foreground text-2xl">💝</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Best Value</h3>
                <p className="text-muted-foreground">
                  Competitive prices without compromising on quality or experience.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-accent py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Nymphette Tours. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SimpleIndex;