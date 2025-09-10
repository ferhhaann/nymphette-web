import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Globe, Heart, Target, Eye } from "lucide-react";


import teamPhoto from "@/assets/team-photo.jpg";
import heroImage from "@/assets/about-us-hero.jpg";

const AboutUs = () => {
  
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
      <header>
        <Navigation />
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[calc(100vh-3rem)] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-x-3 sm:inset-x-6 md:inset-x-8 bottom-3 sm:bottom-6 md:bottom-8 top-3 sm:top-6 md:top-8 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-primary-dark/70"></div>
          </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-background">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            About Nymphette International EMC - Premium Travel Agency Since 2001
          </h1>
          <p className="text-xl text-background/80 max-w-3xl mx-auto animate-slide-up">
            One of India's established and most reputed company with Tours & Events under one Umbrella
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
                  A dream becomes a goal when action is taken toward its achievement. Our dream is to make a difference in the world by creating magical dream moments for each special occasion. Our goal is to give pleasure to the soul of a person for him to cherish than the most expensive gift.
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
                  To transform visions into exceptional experiences, creating magical moments where the pleasure we give to the soul is more cherished than the most expensive gift.
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
                  Personalized "hands-on" approach with highly skilled, multi-lingual staff providing guidance and care for travellers from all corners of the world.
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
                Founded in 2001, Nymphette International EMC's legacy, in-depth experience and commitment towards quality service and product development has earned it a solid and respected reputation.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Because Nymphette International is privately owned and operated, its principals bring a truly personalized "hands-on" approach to the business. Highly skilled, multi-lingual staff with an intimate knowledge of all countries of the World are on hand from start to finish, providing guidance and care for the safety and well-being of travellers from all corners of the world.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We are the First Tour operator to Embarked our clients with more than 400 Passengers on a Indigo 6E Chartered Flight to Phuket, The Journey was smooth within flight gourmet Meals. With our events you can transform your vision into exceptional experience, since our mission is to create magical moments.
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