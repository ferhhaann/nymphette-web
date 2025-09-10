import React, { useState, useEffect } from 'react'
import { Search, Clock, Tag, Eye, Calendar, ChevronRight } from 'lucide-react'
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization"
import { useStaticSEO } from "@/hooks/useStaticSEO"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { Link } from 'react-router-dom'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string
  reading_time: number
  views_count: number
  published_at: string
  featured: boolean
  tags: string[]
  author: {
    name: string
    avatar_url: string
  }
  category: {
    name: string
    color: string
    slug: string
  }
}

interface BlogCategory {
  id: string
  name: string
  slug: string
  color: string
}

export default function Blog() {
  useStaticSEO(); // Apply SEO settings from database
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:authors(name, avatar_url),
          category:blog_categories(name, color, slug)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      const { data: categoriesData } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')

      if (postsData) {
        const featured = postsData.find(post => post.featured)
        const regular = postsData.filter(post => !post.featured)
        
        setFeaturedPost(featured || postsData[0])
        setPosts(regular)
      }

      if (categoriesData) {
        setCategories(categoriesData)
      }
    } catch (error) {
      console.error('Error fetching blog data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category?.slug === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Nymphette Tours Travel Blog - Stories & Insights",
    "description": "Discover travel stories, destination guides, tips, and insights from our expert travel writers. Get inspired for your next adventure.",
    "url": "/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Nymphette Tours",
      "logo": "/lovable-uploads/55a5a12c-6872-4f3f-b1d6-da7e436ed8f1.png"
    },
    "blogPost": posts.slice(0, 3).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `/blog/${post.slug}`,
      "datePublished": post.published_at,
      "author": {
        "@type": "Person",
        "name": post.author?.name
      }
    }))
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading amazing stories...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header>
        <Navigation />
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[calc(100vh-3rem)] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-x-3 sm:inset-x-6 md:inset-x-8 bottom-3 sm:bottom-6 md:bottom-8 top-3 sm:top-6 md:top-8 rounded-2xl sm:rounded-3xl overflow-hidden">
            <img 
              src="/src/assets/blog-hero.jpg" 
              alt="Travel Blog Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
          </div>
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">Travel Stories & Expert Insights</h1>
            <p className="text-xl opacity-90 animate-fade-in" style={{animationDelay: '0.2s'}}>
              Discover hidden gems, travel tips, and inspiring stories from around the world by our expert writers
            </p>
          </div>
        </section>

      {featuredPost && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Story</h2>
            <Card className="overflow-hidden hover-scale transition-all duration-300 shadow-lg">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative group">
                  <img 
                    src={featuredPost.featured_image || '/placeholder.svg'} 
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge 
                    className="absolute top-4 left-4"
                    style={{ backgroundColor: featuredPost.category?.color }}
                  >
                    {featuredPost.category?.name}
                  </Badge>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <img 
                        src={featuredPost.author?.avatar_url || '/placeholder.svg'} 
                        alt={featuredPost.author?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm">{featuredPost.author?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(featuredPost.published_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{featuredPost.reading_time} min read</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 story-link">
                    <Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm text-muted-foreground">{featuredPost.views_count} views</span>
                    </div>
                    <Link to={`/blog/${featuredPost.slug}`}>
                      <Button variant="outline" className="group">
                        Read More 
                        <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Card key={post.id} className="overflow-hidden hover-scale transition-all duration-300 shadow-md hover:shadow-lg animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="relative group">
                  <img 
                    src={post.featured_image || '/placeholder.svg'} 
                    alt={post.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge 
                    className="absolute top-4 left-4"
                    style={{ backgroundColor: post.category?.color }}
                  >
                    {post.category?.name}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <img 
                        src={post.author?.avatar_url || '/placeholder.svg'} 
                        alt={post.author?.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span>{post.author?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.reading_time} min</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 story-link">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span>{post.views_count}</span>
                    </div>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}