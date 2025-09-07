import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, Eye, Tag, Share2, Heart, MessageCircle, ChevronLeft, User } from 'lucide-react'
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  gallery_images: any
  reading_time: number
  views_count: number
  published_at: string
  tags: string[]
  meta_title: string
  meta_description: string
  category_id?: string
  author: {
    name: string
    avatar_url: string
    bio: string
    social_links: any
  }
  category: {
    name: string
    color: string
    slug: string
  }
}

interface Comment {
  id: string
  author_name: string
  content: string
  created_at: string
  status: string
}

export default function BlogPost() {
  usePerformanceOptimization();
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [commentForm, setCommentForm] = useState({
    author_name: '',
    author_email: '',
    content: ''
  })

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      // Fetch blog post
      const { data: postData, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:authors(name, avatar_url, bio, social_links),
          category:blog_categories(name, color, slug)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle()

      if (error) {
        console.error('Error fetching blog post:', error);
        setLoading(false);
        return;
      }

      if (postData) {
        setPost(postData)
        
        // Update views count
        await supabase
          .from('blog_posts')
          .update({ views_count: (postData.views_count || 0) + 1 })
          .eq('id', postData.id)

        // Fetch comments using secure function that excludes email addresses
        const { data: commentsData } = await supabase
          .rpc('get_blog_comments_public', { blog_post_id: postData.id })

        if (commentsData) {
          setComments(commentsData)
        }

        // Fetch related posts
        const { data: relatedData } = await supabase
          .from('blog_posts')
          .select(`
            id, title, slug, excerpt, featured_image, published_at,
            author:authors(name, avatar_url),
            category:blog_categories(name, color)
          `)
          .eq('category_id', postData.category_id)
          .neq('id', postData.id)
          .eq('status', 'published')
          .limit(3)

        if (relatedData) {
          setRelatedPosts(relatedData)
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentForm.author_name || !commentForm.author_email || !commentForm.content) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      await supabase
        .from('blog_comments')
        .insert({
          post_id: post?.id,
          ...commentForm
        })

      toast.success('Comment submitted for review!')
      setCommentForm({ author_name: '', author_email: '', content: '' })
    } catch (error) {
      toast.error('Failed to submit comment')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading article...</div>
        </div>
        <Footer />
      </div>
    )
  }

  const blogPostStructuredData = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image,
    "url": `/blog/${post.slug || slug}`,
    "datePublished": post.published_at,
    "dateModified": post.published_at,
    "author": {
      "@type": "Person",
      "name": post.author?.name,
      "image": post.author?.avatar_url
    },
    "publisher": {
      "@type": "Organization",
      "name": "Nymphette Tours",
      "logo": "/lovable-uploads/55a5a12c-6872-4f3f-b1d6-da7e436ed8f1.png"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `/blog/${post.slug || slug}`
    },
    "keywords": post.tags?.join(", "),
    "wordCount": post.content?.split(' ').length || 0,
    "timeRequired": `PT${post.reading_time}M`
  } : {};

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link to="/blog">
            <Button variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
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
        {/* Article Header */}
        <article className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            {/* Article Meta */}
            <div className="mb-8">
              <Badge 
                className="mb-4"
                style={{ backgroundColor: post.category?.color }}
              >
                {post.category?.name}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <img 
                    src={post.author?.avatar_url || '/placeholder.svg'} 
                    alt={post.author?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-foreground">{post.author?.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.reading_time} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{post.views_count} views</span>
                </div>
                <Button variant="ghost" size="sm" onClick={sharePost}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
            </div>

            {/* Gallery */}
            {post.gallery_images && post.gallery_images.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Gallery</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {post.gallery_images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-8" />

            {/* Author Bio */}
            <div className="mb-8 p-6 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-4">
                <img 
                  src={post.author?.avatar_url || '/placeholder.svg'} 
                  alt={post.author?.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">About {post.author?.name}</h3>
                  <p className="text-muted-foreground mb-4">{post.author?.bio}</p>
                  {post.author?.social_links && (
                    <div className="flex gap-2">
                      {Object.entries(post.author.social_links).map(([platform, url]) => (
                        <Button key={platform} variant="outline" size="sm" asChild>
                          <a href={url as string} target="_blank" rel="noopener noreferrer">
                            {platform}
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Comments ({comments.length})
              </h3>

              {/* Comment Form */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Leave a Comment</h4>
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Your Name"
                        value={commentForm.author_name}
                        onChange={(e) => setCommentForm({...commentForm, author_name: e.target.value})}
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Your Email"
                        value={commentForm.author_email}
                        onChange={(e) => setCommentForm({...commentForm, author_email: e.target.value})}
                        required
                      />
                    </div>
                    <Textarea
                      placeholder="Your comment..."
                      value={commentForm.content}
                      onChange={(e) => setCommentForm({...commentForm, content: e.target.value})}
                      required
                      rows={4}
                    />
                    <Button type="submit">Submit Comment</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map(comment => (
                  <Card key={comment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{comment.author_name}</span>
                            <span className="text-muted-foreground text-sm">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{comment.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {comments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Be the first to comment on this article!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
      </main>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map(relatedPost => (
                <Card key={relatedPost.id} className="overflow-hidden hover-scale transition-all duration-300">
                  <img 
                    src={relatedPost.featured_image || '/placeholder.svg'} 
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2 story-link">
                      <Link to={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <img 
                        src={relatedPost.author?.avatar_url || '/placeholder.svg'} 
                        alt={relatedPost.author?.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span>{relatedPost.author?.name}</span>
                      <span>•</span>
                      <span>{formatDate(relatedPost.published_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
      </section>
      )}

      <footer>
        <Footer />
      </footer>
    </div>
  )
}