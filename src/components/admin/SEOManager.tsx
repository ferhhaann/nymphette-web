import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Plus, Globe, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdminAccess } from "@/hooks/useAdminAccess";

interface SEOSettings {
  id?: string;
  page_url: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  structured_data?: any;
  robots_meta?: string;
  page_type: 'homepage' | 'packages' | 'package-detail' | 'blog' | 'blog-post' | 'about' | 'contact' | 'group-tours' | 'group-tour-detail' | 'country' | 'region' | 'privacy-policy' | 'terms-of-service' | 'cookie-policy' | 'custom';
  is_active: boolean;
}

const PAGE_TEMPLATES = {
  homepage: {
    page_url: '/',
    meta_title: 'Premium Travel Packages & Group Tours | Nymphette Tours',
    meta_description: 'Explore premium travel packages across Asia, Europe, Africa & more. Expert-guided group tours, custom trips, authentic experiences. 50+ destinations worldwide.',
    meta_keywords: 'travel packages, group tours, custom trips, vacation packages, travel agency, international tours',
    robots_meta: 'index,follow'
  },
  packages: {
    page_url: '/packages',
    meta_title: 'Travel Packages - Curated Tours & Custom Trips | Nymphette Tours',
    meta_description: 'Explore our handpicked travel packages across Asia, Europe, Africa & more. Customizable itineraries, expert guides, and unforgettable experiences.',
    meta_keywords: 'travel packages, tour packages, vacation packages, custom tours, holiday packages',
    robots_meta: 'index,follow'
  },
  'package-detail': {
    page_url: '/package/{slug}',
    meta_title: '{Package Name} - Premium Travel Package | Nymphette Tours',
    meta_description: 'Discover {Package Name} with expert guides, curated itinerary, and authentic experiences. Book your dream vacation today.',
    meta_keywords: 'travel package, vacation, tour, holiday',
    robots_meta: 'index,follow'
  },
  blog: {
    page_url: '/blog',
    meta_title: 'Travel Blog - Tips, Guides & Destination Insights | Nymphette Tours',
    meta_description: 'Expert travel tips, destination guides, and insider insights from our travel experts. Discover inspiration for your next adventure.',
    meta_keywords: 'travel blog, travel tips, destination guides, travel advice',
    robots_meta: 'index,follow'
  },
  'blog-post': {
    page_url: '/blog/{slug}',
    meta_title: '{Post Title} | Nymphette Tours Blog',
    meta_description: '{Post excerpt or description}',
    meta_keywords: 'travel blog, travel tips, destination guide',
    robots_meta: 'index,follow'
  },
  about: {
    page_url: '/about',
    meta_title: 'About Us - Our Story & Mission | Nymphette Tours',
    meta_description: 'Learn about Nymphette Tours\' commitment to authentic travel experiences. Meet our expert team and discover our passion for crafting unforgettable journeys.',
    meta_keywords: 'about us, travel agency, our story, our mission, travel experts',
    robots_meta: 'index,follow'
  },
  contact: {
    page_url: '/contact',
    meta_title: 'Contact Us - Get in Touch | Nymphette Tours',
    meta_description: 'Contact Nymphette Tours for personalized travel planning. Available 24/7 to help you plan your perfect trip.',
    meta_keywords: 'contact, get in touch, customer service, travel inquiry',
    robots_meta: 'index,follow'
  },
  'group-tours': {
    page_url: '/group-tours',
    meta_title: 'Group Tours - Join Like-Minded Travelers | Nymphette Tours',
    meta_description: 'Join our expertly guided group tours. Small groups, authentic experiences, and hassle-free travel across the world\'s most exciting destinations.',
    meta_keywords: 'group tours, guided tours, travel groups, group travel packages',
    robots_meta: 'index,follow'
  },
  'group-tour-detail': {
    page_url: '/group-tour/{slug}',
    meta_title: '{Tour Name} - Group Tour | Nymphette Tours',
    meta_description: 'Join {Tour Name} with expert guides and like-minded travelers. Limited spots available. Book your group tour adventure today.',
    meta_keywords: 'group tour, guided tour, travel group',
    robots_meta: 'index,follow'
  },
  country: {
    page_url: '/country/{slug}',
    meta_title: 'Travel to {Country Name} - Packages & Tours | Nymphette Tours',
    meta_description: 'Discover {Country Name} with our curated travel packages and expert guides. Explore top attractions, hidden gems, and authentic experiences.',
    meta_keywords: '{country name} travel, {country name} tours, {country name} packages',
    robots_meta: 'index,follow'
  },
  region: {
    page_url: '/regions/{region}',
    meta_title: '{Region Name} Travel Packages & Tours | Nymphette Tours',
    meta_description: 'Explore {Region Name} with our premium travel packages. Discover diverse cultures, stunning landscapes, and unforgettable experiences.',
    meta_keywords: '{region} travel, {region} tours, {region} packages',
    robots_meta: 'index,follow'
  },
  'privacy-policy': {
    page_url: '/privacy-policy',
    meta_title: 'Privacy Policy | Nymphette Tours',
    meta_description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
    meta_keywords: 'privacy policy, data protection, privacy',
    robots_meta: 'noindex,follow'
  },
  'terms-of-service': {
    page_url: '/terms-of-service',
    meta_title: 'Terms of Service | Nymphette Tours',
    meta_description: 'Read our terms of service to understand the terms and conditions for using our services.',
    meta_keywords: 'terms of service, terms and conditions, user agreement',
    robots_meta: 'noindex,follow'
  },
  'cookie-policy': {
    page_url: '/cookie-policy',
    meta_title: 'Cookie Policy | Nymphette Tours',
    meta_description: 'Learn about how we use cookies and similar technologies on our website.',
    meta_keywords: 'cookie policy, cookies, tracking',
    robots_meta: 'noindex,follow'
  }
};

const SEOManager = () => {
  const { isAdmin, logAdminAction } = useAdminAccess();
  const [seoSettings, setSeoSettings] = useState<SEOSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<SEOSettings | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const initialFormData: SEOSettings = {
    page_url: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: '',
    structured_data: {},
    robots_meta: 'index,follow',
    page_type: 'custom',
    is_active: true
  };

  const [formData, setFormData] = useState<SEOSettings>(initialFormData);
  const formRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showForm]);

  const fetchSEOSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .order('created_at', { ascending: false});

      if (error) {
        console.error('Error fetching SEO settings:', error);
        setSeoSettings([]);
        return;
      }
      
      const seoData = data?.map(item => ({
        id: item.id,
        page_url: item.page_url,
        meta_title: item.meta_title || '',
        meta_description: item.meta_description || '',
        meta_keywords: item.meta_keywords || '',
        canonical_url: item.canonical_url || '',
        og_title: item.og_title || '',
        og_description: item.og_description || '',
        og_image: item.og_image || '',
        structured_data: item.structured_data || {},
        robots_meta: item.robots_meta || 'index,follow',
        page_type: item.page_type as any || 'custom',
        is_active: item.is_active
      })) || [];
      
      setSeoSettings(seoData);
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
      setSeoSettings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSetup = async () => {
    try {
      setLoading(true);
      const templatesToCreate = Object.entries(PAGE_TEMPLATES).filter(([key]) => 
        !['package-detail', 'blog-post', 'group-tour-detail', 'country', 'region'].includes(key)
      );

      for (const [pageType, template] of templatesToCreate) {
        const exists = seoSettings.find(s => s.page_url === template.page_url);
        if (!exists) {
          await supabase.from('seo_settings').insert({
            ...template,
            page_type: pageType,
            is_active: true
          });
        }
      }

      await logAdminAction('QUICK_SETUP_SEO', 'seo_settings');
      toast.success('Quick setup completed! Default SEO settings added for all main pages.');
      fetchSEOSettings();
    } catch (error) {
      console.error('Error during quick setup:', error);
      toast.error('Failed to complete quick setup');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (pageType: string) => {
    const template = PAGE_TEMPLATES[pageType as keyof typeof PAGE_TEMPLATES];
    if (template) {
      setFormData({
        ...formData,
        ...template,
        page_type: pageType as any
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('seo_settings')
          .update({
            page_url: formData.page_url,
            meta_title: formData.meta_title,
            meta_description: formData.meta_description,
            meta_keywords: formData.meta_keywords,
            canonical_url: formData.canonical_url,
            og_title: formData.og_title,
            og_description: formData.og_description,
            og_image: formData.og_image,
            structured_data: formData.structured_data,
            robots_meta: formData.robots_meta,
            page_type: formData.page_type,
            is_active: formData.is_active
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        await logAdminAction('UPDATE', 'seo_settings', editingItem.id);
        toast.success('SEO settings updated successfully');
      } else {
        const { error } = await supabase
          .from('seo_settings')
          .insert({
            page_url: formData.page_url,
            meta_title: formData.meta_title,
            meta_description: formData.meta_description,
            meta_keywords: formData.meta_keywords,
            canonical_url: formData.canonical_url,
            og_title: formData.og_title,
            og_description: formData.og_description,
            og_image: formData.og_image,
            structured_data: formData.structured_data,
            robots_meta: formData.robots_meta,
            page_type: formData.page_type,
            is_active: formData.is_active
          });

        if (error) throw error;
        await logAdminAction('INSERT', 'seo_settings');
        toast.success('SEO settings created successfully');
      }

      fetchSEOSettings();
      setShowForm(false);
      setEditingItem(null);
      setFormData(initialFormData);
    } catch (error: any) {
      console.error('Error saving SEO settings:', error);
      toast.error(error.message || 'Failed to save SEO settings');
    }
  };

  const handleEdit = (item: SEOSettings) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
    // Scroll will happen in useEffect after showForm updates
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SEO setting?')) return;

    try {
      const { error } = await supabase
        .from('seo_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await logAdminAction('DELETE', 'seo_settings', id);
      toast.success('SEO settings deleted successfully');
      fetchSEOSettings();
    } catch (error: any) {
      console.error('Error deleting SEO settings:', error);
      toast.error(error.message || 'Failed to delete SEO settings');
    }
  };

  const filteredSettings = seoSettings.filter(setting =>
    setting.page_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.meta_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSEOScore = (setting: SEOSettings) => {
    let score = 0;
    
    // Meta title (0-25 points) - Modern SEO best practices
    const titleLength = setting.meta_title?.length || 0;
    if (titleLength >= 50 && titleLength <= 60) {
      score += 25; // Optimal length
    } else if ((titleLength >= 45 && titleLength <= 49) || (titleLength >= 61 && titleLength <= 65)) {
      score += 15; // Acceptable but not optimal
    } else if ((titleLength >= 40 && titleLength <= 44) || (titleLength >= 66 && titleLength <= 70)) {
      score += 10; // Too short or too long
    }
    // Under 40 or over 70 = 0 points
    
    // Meta description (0-25 points) - Industry standard lengths
    const descLength = setting.meta_description?.length || 0;
    if (descLength >= 150 && descLength <= 160) {
      score += 25; // Optimal length
    } else if (descLength >= 140 && descLength <= 149) {
      score += 20; // Good length
    } else if (descLength >= 120 && descLength <= 139) {
      score += 15; // Acceptable
    }
    // Under 120 or over 160 = 0 points
    
    // Canonical URL (0-10 points)
    if (setting.canonical_url) {
      score += 10;
    }
    
    // Open Graph tags (0-25 points)
    if (setting.og_title) score += 10;
    if (setting.og_description) score += 10;
    if (setting.og_image) score += 5;
    
    // Structured data (0-10 points)
    if (setting.structured_data && Object.keys(setting.structured_data).length > 0) {
      score += 10;
    }
    
    // Robots meta (0-5 points) - Check for proper directives
    if (setting.robots_meta) {
      const validDirectives = ['index', 'noindex', 'follow', 'nofollow', 'noarchive', 'nosnippet'];
      const hasValidDirective = validDirectives.some(directive => 
        setting.robots_meta?.toLowerCase().includes(directive)
      );
      if (hasValidDirective) {
        score += 5;
      }
    }
    
    // Meta keywords removed from scoring (obsolete since 2009)
    
    return score;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SEO Manager</h2>
          <p className="text-muted-foreground">
            Manage meta tags, structured data, and SEO optimization for all pages
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleQuickSetup} disabled={loading}>
            <Globe className="h-4 w-4 mr-2" />
            Quick Setup All Pages
          </Button>
          <Button onClick={() => {
            setShowForm(true);
            setEditingItem(null);
            setFormData(initialFormData);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add SEO Settings
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by URL or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {showForm && (
        <Card ref={formRef}>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit SEO Settings' : 'Add New SEO Settings'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Page URL</label>
                  <Input
                    value={formData.page_url}
                    onChange={(e) => setFormData({...formData, page_url: e.target.value})}
                    placeholder="/example-page"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Page Type</label>
                  <select
                    value={formData.page_type}
                    onChange={(e) => {
                      const pageType = e.target.value as any;
                      setFormData({...formData, page_type: pageType});
                      handleTemplateSelect(pageType);
                    }}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="homepage">Homepage</option>
                    <option value="packages">Packages</option>
                    <option value="package-detail">Package Detail (Dynamic)</option>
                    <option value="blog">Blog</option>
                    <option value="blog-post">Blog Post (Dynamic)</option>
                    <option value="about">About</option>
                    <option value="contact">Contact</option>
                    <option value="group-tours">Group Tours</option>
                    <option value="group-tour-detail">Group Tour Detail (Dynamic)</option>
                    <option value="country">Country Pages (Dynamic)</option>
                    <option value="region">Region Pages</option>
                    <option value="privacy-policy">Privacy Policy</option>
                    <option value="terms-of-service">Terms of Service</option>
                    <option value="cookie-policy">Cookie Policy</option>
                    <option value="custom">Custom</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Selecting a page type will auto-fill the fields with recommended values
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Meta Title</label>
                <Input
                  value={formData.meta_title}
                  onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                  placeholder="Page title for search engines"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.meta_title.length}/60 characters (recommended: 30-60)
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Meta Description</label>
                <Textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                  placeholder="Brief description for search results"
                  required
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.meta_description.length}/160 characters (recommended: 120-160)
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Meta Keywords</label>
                <Input
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Canonical URL</label>
                <Input
                  value={formData.canonical_url || ''}
                  onChange={(e) => setFormData({...formData, canonical_url: e.target.value})}
                  placeholder="https://example.com/canonical-url"
                />
              </div>

              <div>
                <label className="text-sm font-medium">OG Title</label>
                <Input
                  value={formData.og_title || ''}
                  onChange={(e) => setFormData({...formData, og_title: e.target.value})}
                  placeholder="Social media title"
                />
              </div>

              <div>
                <label className="text-sm font-medium">OG Description</label>
                <Textarea
                  value={formData.og_description || ''}
                  onChange={(e) => setFormData({...formData, og_description: e.target.value})}
                  placeholder="Social media description"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">OG Image URL</label>
                <Input
                  value={formData.og_image || ''}
                  onChange={(e) => setFormData({...formData, og_image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Robots Meta</label>
                <select
                  value={formData.robots_meta || 'index,follow'}
                  onChange={(e) => setFormData({...formData, robots_meta: e.target.value})}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="index,follow">Index, Follow</option>
                  <option value="index,nofollow">Index, No Follow</option>
                  <option value="noindex,follow">No Index, Follow</option>
                  <option value="noindex,nofollow">No Index, No Follow</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  id="is-active"
                />
                <label htmlFor="is-active" className="text-sm font-medium">
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                    setFormData(initialFormData);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update' : 'Create'} SEO Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        ) : filteredSettings.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                {searchTerm ? 'No SEO settings found matching your search.' : 'No SEO settings yet. Click "Quick Setup All Pages" or "Add SEO Settings" to get started.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSettings.map((setting) => {
            const score = getSEOScore(setting);
            return (
              <Card key={setting.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-lg">{setting.page_url}</CardTitle>
                        <Badge variant={setting.is_active ? 'default' : 'secondary'}>
                          {setting.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">{setting.page_type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{setting.meta_title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        <p className="text-sm font-medium">SEO Score</p>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold">{score}%</div>
                          {score >= 80 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : score >= 50 ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(setting)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setting.id && handleDelete(setting.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Description:</span>{' '}
                      <span className="text-muted-foreground">{setting.meta_description}</span>
                    </div>
                    {setting.meta_keywords && (
                      <div>
                        <span className="font-medium">Keywords:</span>{' '}
                        <span className="text-muted-foreground">{setting.meta_keywords}</span>
                      </div>
                    )}
                    {setting.canonical_url && (
                      <div>
                        <span className="font-medium">Canonical:</span>{' '}
                        <span className="text-muted-foreground">{setting.canonical_url}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Robots:</span>{' '}
                      <span className="text-muted-foreground">{setting.robots_meta}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SEOManager;