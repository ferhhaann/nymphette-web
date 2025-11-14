import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Globe, Heart, Target, Eye } from "lucide-react";
import { useStaticSEO } from "@/hooks/useStaticSEO";
import teamPhoto from "@/assets/team-photo.jpg";
import heroImage from "@/assets/about-us-hero.jpg";

const AboutUs = () => {
  useStaticSEO(); // Apply SEO settings from database
  
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
      name: "Salim Abdul Vahid",
      position: "Founder & Managing Director",
      experience: "25+ years",
      specialization: "Strategic Leadership & Business Development"
    },
    {
      name: "Beena Mathew", 
      position: "CEO",
      experience: "25+ years",
      specialization: "Executive Management & Operations"
    },
    {
      name: "Ajees",
      position: "Head of Operations",
      experience: "15+ years",
      specialization: "Operations Management & Logistics"
    },
    {
      name: "Antony",
      position: "Head of Sales",
      experience: "15+ years", 
      specialization: "Sales Strategy & Customer Relations"
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: "Indigo 6E Excellence Award 2021-2022",
      description: "Received recognition from Indigo 6E for outstanding support and exceptional service"
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
      
      <main className="pt-16 lg:pt-20">
        {/* Hero Section - Matching dimensions from other pages */}
        <section className="relative h-64 sm:h-[70vh] md:h-[80vh] lg:h-[calc(100vh-3rem)] flex items-center justify-center overflow-hidden mt-4 sm:mt-0">
          <div className="absolute inset-x-3 sm:inset-x-6 md:inset-x-8 bottom-3 sm:bottom-6 md:bottom-8 top-3 sm:top-6 md:top-8 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-primary-dark/70"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-background flex flex-col justify-center h-full">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-6 animate-fade-in leading-tight">
              About Nymphette International EMC
            </h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-8 text-background/90 max-w-3xl mx-auto animate-slide-up leading-relaxed">
              Premium Travel Agency Since 2001 - One of India's most reputed companies
            </p>
          </div>
        </section>

        {/* Mission, Vision & Values - Mobile First Design */}
        <section className="py-8 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">Our Foundation</h2>
              <p className="text-base sm:text-lg text-muted-foreground">The values that drive our excellence</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              <Card className="text-center hover:shadow-travel transition-all duration-300 animate-fade-in">
                <CardContent className="p-6 sm:p-8">
                  <div className="bg-accent/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4">Our Mission</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    A dream becomes a goal when action is taken toward its achievement. Our dream is to make a difference in the world by creating magical dream moments for each special occasion.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <Card className="text-center hover:shadow-travel transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="bg-accent/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Eye className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4">Our Vision</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      To transform visions into exceptional experiences, creating magical moments where the pleasure we give to the soul is more cherished than the most expensive gift.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-travel transition-all duration-300 animate-fade-in" style={{ animationDelay: '400ms' }}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="bg-accent/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4">Our Values</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Personalized "hands-on" approach with highly skilled, multi-lingual staff providing guidance and care for travellers from all corners of the world.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Company Story - Mobile Optimized */}
        <section className="py-8 sm:py-16 md:py-20 bg-pale-blue/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="animate-fade-in order-2 lg:order-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-6">Our Journey</h2>
                <div className="space-y-4 text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Founded in 2001, Nymphette International EMC's legacy, in-depth experience and commitment towards quality service and product development has earned it a solid and respected reputation.
                  </p>
                  <p>
                    Because Nymphette International is privately owned and operated, its principals bring a truly personalized "hands-on" approach to the business. Highly skilled, multi-lingual staff with an intimate knowledge of all countries of the World are on hand from start to finish.
                  </p>
                  <p>
                    We are the First Tour operator to Embarked our clients with more than 400 Passengers on a Indigo 6E Chartered Flight to Phuket, creating exceptional experiences with our mission to create magical moments.
                  </p>
                </div>
              </div>
              
              <div className="animate-slide-up order-1 lg:order-2">
                <img 
                  src={teamPhoto}
                  alt="Nymphette Tours experienced travel team"
                  loading="lazy"
                  className="rounded-2xl shadow-travel w-full"
                  width="600"
                  height="400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Compact Timeline for Mobile */}
        <section className="py-8 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">Our Milestones</h2>
              <p className="text-sm sm:text-lg text-muted-foreground">25 years of excellence</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {milestones.map((milestone, index) => (
                <Card 
                  key={milestone.year}
                  className="animate-fade-in hover:shadow-travel transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="bg-accent text-white px-3 py-1 rounded-lg font-bold text-lg mb-3 text-center w-fit mx-auto">
                      {milestone.year}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-center">
                      {milestone.event}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Compact Team Section */}
        <section className="py-8 sm:py-16 md:py-20 bg-pale-blue/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">Meet Our Team</h2>
              <p className="text-sm sm:text-lg text-muted-foreground">Expert travel professionals</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {teamMembers.map((member, index) => (
                <Card 
                  key={member.name}
                  className="text-center hover:shadow-travel transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="w-16 h-16 bg-card-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-primary mb-1">{member.name}</h3>
                    <p className="text-sm text-accent font-medium mb-2">{member.position}</p>
                    <Badge variant="outline" className="border-soft-blue text-deep-blue text-xs mb-2">
                      {member.experience}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{member.specialization}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-8 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">Our Achievements</h2>
              <p className="text-sm sm:text-lg text-muted-foreground">Recognition for excellence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {achievements.map((achievement, index) => (
                <Card 
                  key={achievement.title}
                  className="text-center hover:shadow-travel transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-6 sm:p-8">
                    <div className="bg-accent/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <achievement.icon className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-primary mb-3">{achievement.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{achievement.description}</p>
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