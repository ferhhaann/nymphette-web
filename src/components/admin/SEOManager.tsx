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

  const fetchAnalytics = async () => {
    // Enhanced mock analytics data with realistic numbers and comprehensive page coverage
    const mockAnalytics: SEOAnalytics[] = [
      {
        page_url: '/',
        views: 28450,
        bounce_rate: 32.8,
        avg_session_duration: 245,
        search_impressions: 125230,
        search_clicks: 8870,
        ctr: 7.1,
        avg_position: 2.4,
        top_keywords: ['nymphette tours', 'travel packages', 'vacation planning', 'asia travel', 'group tours']
      },
      {
        page_url: '/packages',
        views: 18950,
        bounce_rate: 28.7,
        avg_session_duration: 320,
        search_impressions: 89140,
        search_clicks: 5980,
        ctr: 6.7,
        avg_position: 3.1,
        top_keywords: ['travel packages', 'asia tours', 'europe packages', 'vacation deals', 'holiday packages']
      },
      {
        page_url: '/group-tours',
        views: 12200,
        bounce_rate: 25.2,
        avg_session_duration: 380,
        search_impressions: 56750,
        search_clicks: 3125,
        ctr: 5.5,
        avg_position: 3.8,
        top_keywords: ['group tours', 'small group travel', 'guided tours', 'adventure tours', 'cultural tours']
      },
      {
        page_url: '/blog',
        views: 9850,
        bounce_rate: 45.1,
        avg_session_duration: 195,
        search_impressions: 34200,
        search_clicks: 1890,
        ctr: 5.5,
        avg_position: 4.2,
        top_keywords: ['travel blog', 'destination guide', 'travel tips', 'travel stories', 'vacation inspiration']
      },
      {
        page_url: '/about',
        views: 6420,
        bounce_rate: 38.9,
        avg_session_duration: 165,
        search_impressions: 18750,
        search_clicks: 890,
        ctr: 4.7,
        avg_position: 5.1,
        top_keywords: ['nymphette tours about', 'travel company', 'tour operator', 'travel agency', 'who we are']
      },
      {
        page_url: '/contact',
        views: 5120,
        bounce_rate: 22.3,
        avg_session_duration: 95,
        search_impressions: 12340,
        search_clicks: 650,
        ctr: 5.3,
        avg_position: 4.8,
        top_keywords: ['contact travel agency', 'book tour', 'travel inquiry', 'nymphette contact', 'tour booking']
      },
      {
        page_url: '/regions/asia',
        views: 8750,
        bounce_rate: 35.4,
        avg_session_duration: 285,
        search_impressions: 45200,
        search_clicks: 2750,
        ctr: 6.1,
        avg_position: 3.5,
        top_keywords: ['asia travel', 'southeast asia tours', 'asia vacation', 'asian destinations', 'asia packages']
      },
      {
        page_url: '/regions/europe',
        views: 7890,
        bounce_rate: 31.2,
        avg_session_duration: 310,
        search_impressions: 38900,
        search_clicks: 2340,
        ctr: 6.0,
        avg_position: 3.2,
        top_keywords: ['europe travel', 'european tours', 'europe vacation', 'european packages', 'europe destinations']
      }
    ];
    setAnalytics(mockAnalytics);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate SEO settings
      const { validateSEOSettings } = require('@/utils/seoValidator');
      const validationResults = validateSEOSettings(formData);
      
      // Check for errors
      const errors = validationResults.filter(result => result.status === 'error');
      if (errors.length > 0) {
        errors.forEach(error => {
          toast.error(`${error.field}: ${error.message}`);
        });
        return;
      }

      // Show warnings
      const warnings = validationResults.filter(result => result.status === 'warning');
      if (warnings.length > 0) {
        warnings.forEach(warning => {
          toast.warning(`${warning.field}: ${warning.message}`);
        });
      }

      const seoData = {
        page_url: formData.page_url,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        meta_keywords: formData.meta_keywords,
        canonical_url: formData.canonical_url,
        og_title: formData.og_title,
        og_description: formData.og_description,
        og_image: formData.og_image,
        structured_data: formData.structured_data || generateStructuredData(formData.page_type),
        robots_meta: formData.robots_meta,
        page_type: formData.page_type,
        is_active: formData.is_active
      };

      if (editingItem?.id) {
        const { error } = await supabase
          .from('seo_settings')
          .update(seoData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        toast.success('SEO settings updated successfully');
      } else {
        const { error } = await supabase
          .from('seo_settings')
          .insert([seoData]);
        
        if (error) throw error;
        toast.success('SEO settings created successfully');
      }
      
      fetchSEOSettings();
      resetForm();
    } catch (error: any) {
      console.error('Error saving SEO settings:', error);
      if (error.code === '23505') {
        toast.error('Page URL already exists. Please use a different URL or edit the existing entry.');
      } else {
        toast.error('Failed to save SEO settings: ' + error.message);
      }
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
    const { generateOrganizationSchema, generatePackageSchema, generateArticleSchema, generateBreadcrumbSchema } = require('@/config/schema.config');

    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": formData.meta_title,
      "description": formData.meta_description,
      "url": formData.canonical_url || formData.page_url,
      "breadcrumb": generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: formData.meta_title, url: formData.page_url }
      ])
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
          },
          "publisher": generateOrganizationSchema()
        };
      case 'packages':
        return {
          ...baseStructuredData,
          "@type": "CollectionPage",
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": generatePackageSchema({
                  title: formData.meta_title,
                  description: formData.meta_description,
                  images: [formData.og_image],
                  price: "0",
                  startDate: new Date().toISOString(),
                  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                })
              }
            ]
          }
        };
      case 'blog':
        return {
          ...baseStructuredData,
          ...generateArticleSchema({
            title: formData.meta_title,
            description: formData.meta_description,
            image: formData.og_image,
            author: "Nymphette Tours",
            publishDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString()
          })
        };
      default:
        return {
          ...baseStructuredData,
          "publisher": generateOrganizationSchema()
        };
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