import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Globe, Heart, Target, Eye } from "lucide-react";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import teamPhoto from "@/assets/team-photo.jpg";
import heroImage from "@/assets/hero-travel.jpg";

const AboutUs = () => {
  usePerformanceOptimization();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Nymphette Tours - Travel Agency Since 1999",
    "description": "Learn about Nymphette Tours, a premier travel agency with 25+ years of experience creating unforgettable journeys worldwide. Meet our team and discover our story.",
    "url": "/about",
    "mainEntity": {
      "@type": "TravelAgency",
      "name": "Nymphette Tours",
      "foundingDate": "1999",
      "founders": [{"@type": "Person", "name": "Rajesh Sharma"}],
      "numberOfEmployees": "50+",
      "areaServed": ["Asia", "Europe", "Africa", "Americas", "Pacific Islands", "Middle East"],
      "awards": ["Best Travel Agency 2023"]
    }
  };

  const milestones = [
    { year: "1999", event: "Founded Nymphette Tours with a vision to make travel accessible to everyone" },
    { year: "2005", event: "Expanded to international destinations, serving 10+ countries" },
    { year: "2010", event: "Launched group tour packages, connecting travelers worldwide" },
    { year: "2015", event: "Reached 25,000+ satisfied customers milestone" },
    { year: "2020", event: "Adapted to digital platforms, ensuring safe travel during challenges" },
    { year: "2024", event: "Celebrating 25 years with 50,000+ happy travelers served" }
  ];

  const teamMembers = [
    {
      name: "Rajesh Sharma",
      position: "Founder & CEO",
      experience: "25+ years",
      specialization: "International Travel Planning"
    },
    {
      name: "Priya Patel", 
      position: "Head of Operations",
      experience: "15+ years",
      specialization: "Group Tours & Logistics"
    },
    {
      name: "Michael Johnson",
      position: "Travel Consultant",
      experience: "12+ years", 
      specialization: "European Destinations"
    },
    {
      name: "Sarah Williams",
      position: "Customer Experience Manager",
      experience: "8+ years",
      specialization: "Customer Relations"
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: "Best Travel Agency 2023",
      description: "Awarded by India Travel Awards for excellence in customer service"
    },
    {
      icon: Users,
      title: "50,000+ Happy Customers",
      description: "Successfully served over 50,000 travelers with memorable experiences"
    },
    {
      icon: Globe,
      title: "500+ Destinations",
      description: "Covering major tourist destinations across all continents"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="About Nymphette Tours - Premier Travel Agency Since 1999"
        description="Learn about Nymphette Tours, a premier travel agency with 25+ years of experience creating unforgettable journeys worldwide. Meet our expert team and discover our story."
        keywords="about nymphette tours, travel agency history, travel experts, founded 1999, travel team, travel company story"
        url="/about"
        structuredData={structuredData}
      />
      <header>
        <Navigation />
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-4 pb-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-primary-dark/70"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-background">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            About Nymphette Tours - Premier Travel Agency Since 1999
          </h1>
          <p className="text-xl text-background/80 max-w-3xl mx-auto animate-slide-up">
            Creating unforgettable travel experiences for over 25 years with passion, expertise, and dedication
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-travel transition-all duration-300 animate-fade-in">
              <CardContent className="p-8">
                <div className="bg-accent/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To make travel accessible, enjoyable, and transformative for everyone, creating connections between cultures and unforgettable memories that last a lifetime.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-travel transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardContent className="p-8">
                <div className="bg-accent/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the world's most trusted travel partner, inspiring people to explore, discover, and connect with the beauty and diversity of our planet.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-travel transition-all duration-300 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CardContent className="p-8">
                <div className="bg-accent/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Our Values</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Excellence, integrity, safety, and customer satisfaction guide everything we do. We believe in sustainable tourism that benefits local communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-pale-blue/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold text-primary mb-6">Our Journey</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Founded in 1999 by travel enthusiast Rajesh Sharma, Nymphette Tours began as a small family business with a simple dream: to help people discover the world's most beautiful destinations.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                What started as organizing local tours has grown into a comprehensive travel company serving thousands of travelers annually. Our commitment to personalized service, attention to detail, and creating meaningful travel experiences has remained unchanged.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, we're proud to be one of India's most trusted travel partners, offering everything from intimate honeymoon packages to large group adventures across six continents.
              </p>
            </div>
            
            <div className="animate-slide-up">
              <img 
                src={teamPhoto}
                alt="Nymphette Tours experienced travel team of experts and consultants working together"
                loading="lazy"
                className="rounded-2xl shadow-travel w-full"
                width="600"
                height="400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Milestones</h2>
            <p className="text-xl text-muted-foreground">25 years of growth, innovation, and unforgettable journeys</p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div 
                key={milestone.year}
                className="flex items-center space-x-6 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-accent text-white px-4 py-2 rounded-lg font-bold text-lg min-w-[80px] text-center">
                  {milestone.year}
                </div>
                <div className="flex-1 bg-card-gradient p-4 rounded-lg">
                  <p className="text-muted-foreground">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-pale-blue/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">Passionate travel experts dedicated to creating your perfect journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={member.name}
                className="text-center hover:shadow-travel transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-card-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-1">{member.name}</h3>
                  <p className="text-accent font-medium mb-2">{member.position}</p>
                  <div className="space-y-1">
                    <Badge variant="outline" className="border-soft-blue text-deep-blue">
                      {member.experience}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{member.specialization}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Achievements</h2>
            <p className="text-xl text-muted-foreground">Recognition for our commitment to excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <Card 
                key={achievement.title}
                className="text-center hover:shadow-travel transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8">
                  <div className="bg-accent/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <achievement.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{achievement.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default AboutUs;