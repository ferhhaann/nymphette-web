import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import regionsImage from "@/assets/regions-world.jpg";

const Blog = () => {
  const featuredPost = {
    id: 1,
    title: "The Ultimate Guide to Planning Your First European Adventure",
    excerpt: "Everything you need to know about traveling through Europe as a first-timer, from budgeting to must-see destinations and insider tips from our travel experts.",
    content: "Planning your first European adventure can feel overwhelming with so many incredible destinations...",
    author: "Sarah Williams",
    publishDate: "2024-02-15",
    readTime: "8 min read",
    image: regionsImage,
    category: "Travel Guides",
    tags: ["Europe", "First Time", "Planning", "Budget Travel"]
  };

  const blogPosts = [
    {
      id: 2,
      title: "Hidden Gems of Southeast Asia You Must Visit",
      excerpt: "Discover lesser-known but absolutely stunning destinations in Southeast Asia that offer authentic experiences away from the crowds.",
      author: "Michael Johnson",
      publishDate: "2024-02-10",
      readTime: "6 min read",
      image: regionsImage,
      category: "Destinations",
      tags: ["Asia", "Hidden Gems", "Adventure"]
    },
    {
      id: 3,
      title: "Sustainable Tourism: How to Travel Responsibly",
      excerpt: "Learn about eco-friendly travel practices that help preserve destinations for future generations while supporting local communities.",
      author: "Priya Patel",
      publishDate: "2024-02-08",
      readTime: "5 min read",
      image: regionsImage,
      category: "Sustainable Travel",
      tags: ["Sustainability", "Eco Travel", "Responsible Tourism"]
    },
    {
      id: 4,
      title: "Monsoon Travel in India: Best Destinations",
      excerpt: "Embrace the beauty of India's monsoon season with our guide to the most spectacular destinations that come alive during the rains.",
      author: "Rajesh Sharma",
      publishDate: "2024-02-05",
      readTime: "7 min read",
      image: regionsImage,
      category: "India Travel",
      tags: ["India", "Monsoon", "Seasonal Travel"]
    },
    {
      id: 5,
      title: "Digital Nomad's Guide to Working While Traveling",
      excerpt: "Tips and tricks for maintaining productivity while exploring the world, including the best destinations for remote work.",
      author: "Sarah Williams",
      publishDate: "2024-02-01",
      readTime: "9 min read",
      image: regionsImage,
      category: "Travel Tips",
      tags: ["Digital Nomad", "Remote Work", "Productivity"]
    },
    {
      id: 6,
      title: "Budget Travel Hacks: Maximize Your Adventures",
      excerpt: "Expert strategies to stretch your travel budget without compromising on experiences, from accommodation to transportation tips.",
      author: "Michael Johnson",
      publishDate: "2024-01-28",
      readTime: "6 min read",
      image: regionsImage,
      category: "Budget Travel",
      tags: ["Budget", "Money Saving", "Travel Hacks"]
    },
    {
      id: 7,
      title: "Cultural Etiquette: Respectful Travel Tips",
      excerpt: "Navigate different cultures with confidence and respect. Essential etiquette tips for traveling to diverse destinations around the world.",
      author: "Priya Patel",
      publishDate: "2024-01-25",
      readTime: "4 min read",
      image: regionsImage,
      category: "Cultural Travel",
      tags: ["Culture", "Etiquette", "Respect"]
    }
  ];

  const categories = [
    "All Posts",
    "Travel Guides", 
    "Destinations",
    "Budget Travel",
    "Cultural Travel",
    "Sustainable Travel",
    "Travel Tips"
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Travel Stories & Guides
          </h1>
          <p className="text-xl text-soft-blue max-w-3xl mx-auto animate-slide-up">
            Discover inspiring travel stories, expert tips, and insider guides to help you plan your next adventure
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Featured Story</h2>
          </div>

          <Card className="overflow-hidden hover:shadow-travel transition-all duration-500 animate-fade-in">
            <div className="lg:flex">
              <div className="lg:w-1/2 relative overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 lg:h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-accent text-white">{featuredPost.category}</Badge>
                </div>
              </div>

              <CardContent className="lg:w-1/2 p-8">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(featuredPost.publishDate)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {featuredPost.readTime}
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-primary mb-4">{featuredPost.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">{featuredPost.excerpt}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="border-soft-blue text-deep-blue">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button className="bg-accent hover:bg-bright-blue text-white">
                  Read Full Article
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-pale-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category, index) => (
              <Button 
                key={category}
                variant="outline" 
                className="border-accent text-accent hover:bg-accent hover:text-white"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Latest Articles</h2>
            <p className="text-xl text-muted-foreground">Expert insights and travel inspiration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card 
                key={post.id}
                className="group overflow-hidden hover:shadow-travel transition-all duration-500 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-accent text-white">{post.category}</Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 2).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="border-soft-blue text-deep-blue text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge variant="outline" className="border-soft-blue text-deep-blue text-xs">
                        +{post.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(post.publishDate)}
                    </span>
                    <Button variant="ghost" className="text-accent hover:bg-accent hover:text-white p-2">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-hero-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-soft-blue mb-8">
            Subscribe to our newsletter for the latest travel tips, destination guides, and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-soft-blue outline-none focus:border-soft-blue"
            />
            <Button className="bg-accent hover:bg-bright-blue text-white px-8 py-3">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;