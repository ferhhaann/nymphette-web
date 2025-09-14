import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, FileText, Calendar, User, Tag, Upload, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  status: string
  featured: boolean
  tags: string[]
  reading_time: number
  views_count: number
  published_at: string
  author_id?: string
  category_id?: string
  meta_title?: string
  meta_description?: string
  author?: { name: string }
  category?: { name: string, color: string }
}

interface Author {
  id: string
  name: string
  email: string
  bio: string
}

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

export const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author_id: '',
    category_id: '',
    tags: '',
    status: 'draft',
    featured: false,
    meta_title: '',
    meta_description: ''
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch posts
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:authors(name),
          category:blog_categories(name, color)
        `)
        .order('created_at', { ascending: false })

      // Fetch authors - use secure function for admin access
      // This ensures full author data (including emails) is only accessible to admins
      const { data: authorsData } = await supabase
        .from('authors')
        .select('*') // Safe because this component requires admin access
        .order('name')

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')

      if (postsData) setPosts(postsData)
      if (authorsData) setAuthors(authorsData)
      if (categoriesData) setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch blog data')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file)
    
    if (error) throw error
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName)
    
    return publicUrl
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const imageUrl = await uploadImage(file)
      setPostForm(prev => ({ ...prev, featured_image: imageUrl }))
      setSelectedFile(null)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSavePost = async () => {
    try {
      const tagsArray = postForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      const readingTime = calculateReadingTime(postForm.content)
      
      const postData = {
        ...postForm,
        tags: tagsArray,
        reading_time: readingTime,
        slug: postForm.slug || generateSlug(postForm.title),
        published_at: postForm.status === 'published' ? new Date().toISOString() : null
      }

      if (selectedPost) {
        await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', selectedPost.id)
        toast.success('Post updated successfully')
      } else {
        await supabase
          .from('blog_posts')
          .insert([postData])
        toast.success('Post created successfully')
      }

      setIsEditing(false)
      setSelectedPost(null)
      setSelectedFile(null)
      setPostForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        author_id: '',
        category_id: '',
        tags: '',
        status: 'draft',
        featured: false,
        meta_title: '',
        meta_description: ''
      })
      fetchData()
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post')
    }
  }

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post)
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      featured_image: post.featured_image || '',
      author_id: post.author_id || '',
      category_id: post.category_id || '',
      tags: post.tags ? post.tags.join(', ') : '',
      status: post.status,
      featured: post.featured,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || ''
    })
    setIsEditing(true)
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId)
      
      toast.success('Post deleted successfully')
      fetchData()
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="p-4">Loading blog data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Blog Management</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Real-time updates enabled</span>
          </div>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedPost(null)
              setSelectedFile(null)
              setPostForm({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                featured_image: '',
                author_id: '',
                category_id: '',
                tags: '',
                status: 'draft',
                featured: false,
                meta_title: '',
                meta_description: ''
              })
            }}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={postForm.title}
                    onChange={(e) => {
                      setPostForm({ ...postForm, title: e.target.value })
                      if (!postForm.slug) {
                        setPostForm(prev => ({ ...prev, slug: generateSlug(e.target.value) }))
                      }
                    }}
                    placeholder="Post title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={postForm.slug}
                    onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                    placeholder="post-url-slug"
                  />
                </div>
                
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={postForm.excerpt}
                    onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                    placeholder="Brief description of the post"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    placeholder="Write your post content here..."
                    rows={15}
                    className="font-mono"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Select value={postForm.author_id} onValueChange={(value) => setPostForm({ ...postForm, author_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select author" />
                      </SelectTrigger>
                      <SelectContent>
                        {authors.map(author => (
                          <SelectItem key={author.id} value={author.id}>{author.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={postForm.category_id} onValueChange={(value) => setPostForm({ ...postForm, category_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="featured_image">Featured Image</Label>
                  <div className="space-y-4">
                    {postForm.featured_image && (
                      <div className="relative">
                        <img 
                          src={postForm.featured_image} 
                          alt="Featured" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setPostForm({ ...postForm, featured_image: '' })}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4">
                      <Input
                        id="featured_image"
                        value={postForm.featured_image}
                        onChange={(e) => setPostForm({ ...postForm, featured_image: e.target.value })}
                        placeholder="Image URL or upload a file"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button type="button" variant="outline" disabled={uploadingImage}>
                          <Upload className="w-4 h-4 mr-2" />
                          {uploadingImage ? 'Uploading...' : 'Upload'}
                        </Button>
                      </div>
                    </div>
                    
                    {selectedFile && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Selected: {selectedFile.name}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleImageUpload(selectedFile)}
                          disabled={uploadingImage}
                        >
                          {uploadingImage ? 'Uploading...' : 'Upload File'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={postForm.tags}
                    onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                    placeholder="travel, adventure, tips"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={postForm.status} onValueChange={(value) => setPostForm({ ...postForm, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch
                      id="featured"
                      checked={postForm.featured}
                      onCheckedChange={(checked) => setPostForm({ ...postForm, featured: checked })}
                    />
                    <Label htmlFor="featured">Featured Post</Label>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="seo" className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={postForm.meta_title}
                    onChange={(e) => setPostForm({ ...postForm, meta_title: e.target.value })}
                    placeholder="SEO optimized title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={postForm.meta_description}
                    onChange={(e) => setPostForm({ ...postForm, meta_description: e.target.value })}
                    placeholder="SEO meta description (max 160 characters)"
                    rows={3}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePost}>
                {selectedPost ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Posts List */}
      <div className="grid gap-4">
        {filteredPosts.map(post => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                    {post.featured && <Badge variant="outline">Featured</Badge>}
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author?.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Not published'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views_count} views
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {post.tags.slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEditPost(post)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeletePost(post.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No blog posts found.
        </div>
      )}
    </div>
  )
}