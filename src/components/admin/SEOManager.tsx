import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Edit, Trash2, Plus, Eye, BarChart3, TrendingUp, Globe, Target, Link as LinkIcon } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  page_type: 'homepage' | 'packages' | 'blog' | 'about' | 'contact' | 'group-tours' | 'custom';
  is_active: boolean;
}

interface SEOAnalytics {
  page_url: string;
  views: number;
  bounce_rate: number;
  avg_session_duration: number;
  search_impressions: number;
  search_clicks: number;
  ctr: number;
  avg_position: number;
  top_keywords: string[];
}

const SEOManager = () => {
  const [seoSettings, setSeoSettings] = useState<SEOSettings[]>([]);
  const [analytics, setAnalytics] = useState<SEOAnalytics[]>([]);
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

  useEffect(() => {
    fetchSEOSettings();
    fetchAnalytics();
  }, []);

  const fetchSEOSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSeoSettings(data || []);
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
      toast.error('Failed to load SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    // Mock analytics data - in real implementation, integrate with Google Analytics or similar
    const mockAnalytics: SEOAnalytics[] = [
      {
        page_url: '/',
        views: 15420,
        bounce_rate: 42.3,
        avg_session_duration: 185,
        search_impressions: 45230,
        search_clicks: 2870,
        ctr: 6.3,
        avg_position: 3.2,
        top_keywords: ['travel packages', 'nymphette tours', 'vacation planning']
      },
      {
        page_url: '/packages',
        views: 8950,
        bounce_rate: 38.7,
        avg_session_duration: 220,
        search_impressions: 32140,
        search_clicks: 1980,
        ctr: 6.2,
        avg_position: 4.1,
        top_keywords: ['travel packages', 'asia tours', 'group travel']
      },
      {
        page_url: '/group-tours',
        views: 5200,
        bounce_rate: 35.2,
        avg_session_duration: 240,
        search_impressions: 18750,
        search_clicks: 1125,
        ctr: 6.0,
        avg_position: 4.8,
        top_keywords: ['group tours', 'small group travel', 'guided tours']
      }
    ];
    setAnalytics(mockAnalytics);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('seo_settings')
          .update(formData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        toast.success('SEO settings updated successfully');
      } else {
        const { error } = await supabase
          .from('seo_settings')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('SEO settings created successfully');
      }
      
      fetchSEOSettings();
      resetForm();
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      toast.error('Failed to save SEO settings');
    }
  };

  const handleEdit = (item: SEOSettings) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('seo_settings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('SEO settings deleted successfully');
      fetchSEOSettings();
    } catch (error) {
      console.error('Error deleting SEO settings:', error);
      toast.error('Failed to delete SEO settings');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingItem(null);
    setShowForm(false);
  };

  const generateStructuredData = (pageType: string) => {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": formData.meta_title,
      "description": formData.meta_description,
      "url": formData.page_url
    };

    switch (pageType) {
      case 'homepage':
        return {
          ...baseStructuredData,
          "@type": "WebSite",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "/?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
      case 'packages':
        return {
          ...baseStructuredData,
          "mainEntity": {
            "@type": "ItemList",
            "name": "Travel Packages"
          }
        };
      case 'blog':
        return {
          ...baseStructuredData,
          "@type": "Blog",
          "publisher": {
            "@type": "Organization",
            "name": "Nymphette Tours"
          }
        };
      default:
        return baseStructuredData;
    }
  };

  const filteredSettings = seoSettings.filter(setting =>
    setting.page_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.meta_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SEO Manager</h2>
          <p className="text-muted-foreground">
            Manage meta tags, structured data, and SEO optimization for all pages
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add SEO Settings
        </Button>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">SEO Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="tools">SEO Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          {/* Search Bar */}
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

          {/* SEO Settings Form */}
          {showForm && (
            <Card>
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
                        onChange={(e) => setFormData({...formData, page_type: e.target.value as any})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="homepage">Homepage</option>
                        <option value="packages">Packages</option>
                        <option value="blog">Blog</option>
                        <option value="about">About</option>
                        <option value="contact">Contact</option>
                        <option value="group-tours">Group Tours</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Meta Title (60 chars max)</label>
                    <Input
                      value={formData.meta_title}
                      onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                      placeholder="Optimized page title"
                      maxLength={60}
                      required
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {formData.meta_title.length}/60 characters
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Meta Description (160 chars max)</label>
                    <Textarea
                      value={formData.meta_description}
                      onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                      placeholder="Compelling page description"
                      maxLength={160}
                      rows={3}
                      required
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {formData.meta_description.length}/160 characters
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Keywords (comma separated)</label>
                    <Input
                      value={formData.meta_keywords}
                      onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="advanced">
                      <AccordionTrigger>Advanced SEO Settings</AccordionTrigger>
                      <AccordionContent className="space-y-4">
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
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="index,follow">Index, Follow</option>
                            <option value="index,nofollow">Index, No Follow</option>
                            <option value="noindex,follow">No Index, Follow</option>
                            <option value="noindex,nofollow">No Index, No Follow</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Generate Structured Data</label>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const structuredData = generateStructuredData(formData.page_type);
                              setFormData({...formData, structured_data: structuredData});
                              toast.success('Structured data generated');
                            }}
                            className="w-full mt-2"
                          >
                            Generate for {formData.page_type}
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="flex space-x-2">
                    <Button type="submit">
                      {editingItem ? 'Update' : 'Create'} SEO Settings
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* SEO Settings List */}
          <div className="grid gap-4">
            {filteredSettings.map((setting) => (
              <Card key={setting.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={setting.is_active ? 'default' : 'secondary'}>
                          {setting.page_type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {setting.page_url}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg">{setting.meta_title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {setting.meta_description}
                      </p>
                      {setting.meta_keywords && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {setting.meta_keywords.split(',').map((keyword, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {keyword.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(setting.page_url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(setting)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setting.id && handleDelete(setting.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            {analytics.map((data) => (
              <Card key={data.page_url}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{data.page_url}</span>
                    <Badge variant="outline">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Avg Pos: {data.avg_position}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{data.views.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Page Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{data.ctr}%</div>
                      <div className="text-sm text-muted-foreground">CTR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{data.bounce_rate}%</div>
                      <div className="text-sm text-muted-foreground">Bounce Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Math.floor(data.avg_session_duration / 60)}m</div>
                      <div className="text-sm text-muted-foreground">Avg Duration</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Top Keywords:</div>
                    <div className="flex flex-wrap gap-1">
                      {data.top_keywords.map((keyword, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Site Health Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Check your site's SEO health and get recommendations.
                </p>
                <Button className="w-full">Run SEO Audit</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Keyword Research
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Find new keyword opportunities for your content.
                </p>
                <Button className="w-full">Research Keywords</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Sitemap Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Generate and submit XML sitemaps to search engines.
                </p>
                <Button className="w-full">Generate Sitemap</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Monitor page speed and Core Web Vitals.
                </p>
                <Button className="w-full">Check Performance</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOManager;