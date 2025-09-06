import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Save, X, Upload, Star, Users, Calendar, MapPin, DollarSign, Image, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GroupTour {
  id?: string;
  title: string;
  description?: string;
  destination: string;
  category_id?: string;
  start_date: string;
  end_date: string;
  duration: string;
  price: number;
  original_price?: number;
  currency?: string;
  max_participants: number;
  available_spots: number;
  min_age?: number;
  max_age?: number;
  difficulty_level?: string;
  group_type?: string;
  image_url?: string;
  gallery_images?: any;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: any;
  badges?: string[];
  rating?: number;
  reviews_count?: number;
  status?: string;
  featured?: boolean;
  early_bird_discount?: number;
  last_minute_discount?: number;
  is_eco_friendly?: boolean;
  contact_info?: any;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const GroupTourManager = () => {
  const [selectedTour, setSelectedTour] = useState<GroupTour | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<GroupTour>>({});
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: 'Mountain', color: '#8B5CF6' });
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch group tours
  const { data: tours = [], isLoading: toursLoading } = useQuery({
    queryKey: ['admin-group-tours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_tours')
        .select(`
          *,
          category:group_tour_categories(id, name, color, icon)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-tour-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_tour_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Create/Update tour mutation
  const tourMutation = useMutation({
    mutationFn: async (tour: any) => {
      if (tour.id) {
        const { data, error } = await supabase
          .from('group_tours')
          .update(tour)
          .eq('id', tour.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('group_tours')
          .insert(tour)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-group-tours'] });
      toast({
        title: "Success",
        description: `Tour ${formData.id ? 'updated' : 'created'} successfully`,
      });
      setIsEditing(false);
      setSelectedTour(null);
      setFormData({});
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete tour mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('group_tours')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-group-tours'] });
      toast({
        title: "Success",
        description: "Tour deleted successfully",
      });
      setSelectedTour(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Create category mutation
  const categoryMutation = useMutation({
    mutationFn: async (category: typeof newCategory) => {
      const { data, error } = await supabase
        .from('group_tour_categories')
        .insert(category)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tour-categories'] });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      setShowCategoryDialog(false);
      setNewCategory({ name: '', description: '', icon: 'Mountain', color: '#8B5CF6' });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Image upload function
  const uploadImage = async (file: File, folder: string = 'tours'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('group-tour-images')
      .upload(fileName, file);

    if (error) throw error;
    return fileName;
  };

  // Handle main image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imagePath = await uploadImage(file);
      setFormData({ ...formData, image_url: imagePath });
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle gallery images upload
  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setGalleryUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file, 'gallery'));
      const imagePaths = await Promise.all(uploadPromises);
      
      const currentGallery = Array.isArray(formData.gallery_images) ? formData.gallery_images : [];
      setFormData({ 
        ...formData, 
        gallery_images: [...currentGallery, ...imagePaths] 
      });
      
      toast({
        title: "Success",
        description: `${imagePaths.length} images uploaded successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGalleryUploading(false);
    }
  };

  // Get image URL
  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return '/placeholder.svg';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a static asset path, return as is
    if (imagePath.startsWith('/places/')) return imagePath;
    
    // Construct Supabase storage URL
    return `https://duouhbzwivonyssvtiqo.supabase.co/storage/v1/object/public/group-tour-images/${imagePath}`;
  };

  const handleSubmit = () => {
    const tourData = {
      ...formData,
      price: Number(formData.price),
      original_price: formData.original_price ? Number(formData.original_price) : undefined,
      max_participants: Number(formData.max_participants),
      available_spots: Number(formData.available_spots),
      min_age: Number(formData.min_age),
      max_age: formData.max_age ? Number(formData.max_age) : undefined,
      rating: Number(formData.rating),
      reviews_count: Number(formData.reviews_count),
      early_bird_discount: Number(formData.early_bird_discount || 0),
      last_minute_discount: Number(formData.last_minute_discount || 0),
    };
    
    tourMutation.mutate(tourData);
  };

  const startEditing = (tour?: any) => {
    if (tour) {
      setFormData({
        ...tour,
        category_id: tour.category?.id || tour.category_id,
        start_date: tour.start_date?.split('T')[0],
        end_date: tour.end_date?.split('T')[0],
      });
      setSelectedTour(tour);
    } else {
      setFormData({
        title: '',
        description: '',
        destination: '',
        category_id: '',
        start_date: '',
        end_date: '',
        duration: '',
        price: 0,
        currency: 'INR',
        max_participants: 20,
        available_spots: 20,
        min_age: 18,
        difficulty_level: 'Easy',
        group_type: 'Mixed',
        image_url: '',
        gallery_images: [],
        highlights: [],
        inclusions: [],
        exclusions: [],
        itinerary: [],
        badges: [],
        rating: 4.5,
        reviews_count: 0,
        status: 'Active',
        featured: false,
        early_bird_discount: 0,
        last_minute_discount: 0,
        is_eco_friendly: false,
        contact_info: {},
      });
      setSelectedTour(null);
    }
    setIsEditing(true);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Sold Out': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const removeGalleryImage = (index: number) => {
    const currentGallery = Array.isArray(formData.gallery_images) ? formData.gallery_images : [];
    const newGallery = currentGallery.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery_images: newGallery });
  };

  if (toursLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Group Tours Management</h2>
          <p className="text-muted-foreground">Manage group tours, categories, and bookings</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Name</Label>
                  <Input
                    id="category-name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="e.g., Adventure Tours"
                  />
                </div>
                <div>
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea
                    id="category-description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Brief description of the category"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category-icon">Icon</Label>
                    <Select value={newCategory.icon} onValueChange={(value) => setNewCategory({ ...newCategory, icon: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mountain">Mountain</SelectItem>
                        <SelectItem value="Globe">Globe</SelectItem>
                        <SelectItem value="Waves">Waves</SelectItem>
                        <SelectItem value="Building">Building</SelectItem>
                        <SelectItem value="Binoculars">Binoculars</SelectItem>
                        <SelectItem value="Crown">Crown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category-color">Color</Label>
                    <Input
                      id="category-color"
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => categoryMutation.mutate(newCategory)}>
                    Create Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button onClick={() => startEditing()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tour
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tours</p>
                <h3 className="text-2xl font-bold">{tours.length}</h3>
              </div>
              <Calendar className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tours</p>
                <h3 className="text-2xl font-bold">
                  {tours.filter(tour => tour.status === 'Active').length}
                </h3>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <h3 className="text-2xl font-bold">
                  {tours.reduce((sum, tour) => sum + (tour.max_participants - tour.available_spots), 0)}
                </h3>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <h3 className="text-2xl font-bold">
                  {formatCurrency(tours.reduce((sum, tour) => 
                    sum + (tour.price * (tour.max_participants - tour.available_spots)), 0
                  ))}
                </h3>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tours List/Edit Form */}
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{formData.id ? 'Edit Tour' : 'Create New Tour'}</CardTitle>
            <CardDescription>
              {formData.id ? 'Update tour details' : 'Add a new group tour to your collection'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Tour Title</Label>
                    <Input
                      id="title"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Amazing Group Adventure"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      value={formData.destination || ''}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="Bali, Indonesia"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category_id || ''} 
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="7 Days / 6 Nights"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.start_date || ''}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={formData.end_date || ''}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed tour description..."
                    rows={4}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select 
                      value={formData.difficulty_level || ''} 
                      onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Challenging">Challenging</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="group-type">Group Type</Label>
                    <Select 
                      value={formData.group_type || ''} 
                      onValueChange={(value) => setFormData({ ...formData, group_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select group type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                        <SelectItem value="Solo Travelers">Solo Travelers</SelectItem>
                        <SelectItem value="Families">Families</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                        <SelectItem value="Adventure Seekers">Adventure Seekers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status || ''} 
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Sold Out">Sold Out</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="max-participants">Max Participants</Label>
                    <Input
                      id="max-participants"
                      type="number"
                      value={formData.max_participants || ''}
                      onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="available-spots">Available Spots</Label>
                    <Input
                      id="available-spots"
                      type="number"
                      value={formData.available_spots || ''}
                      onChange={(e) => setFormData({ ...formData, available_spots: parseInt(e.target.value) })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="min-age">Minimum Age</Label>
                    <Input
                      id="min-age"
                      type="number"
                      value={formData.min_age || ''}
                      onChange={(e) => setFormData({ ...formData, min_age: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label htmlFor="image-upload">Main Tour Image</Label>
                  <div className="space-y-4">
                    {formData.image_url && (
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                        <img
                          src={getImageUrl(formData.image_url)}
                          alt="Tour preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData({ ...formData, image_url: '' })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <Alert>
                      <Image className="h-4 w-4" />
                      <AlertDescription>
                        Upload a high-quality image that represents your tour. Recommended size: 1200x800 pixels.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <div>
                  <Label htmlFor="gallery-upload">Gallery Images</Label>
                  <div className="space-y-4">
                    {Array.isArray(formData.gallery_images) && formData.gallery_images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.gallery_images.map((image, index) => (
                          <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                            <img
                              src={getImageUrl(image)}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => removeGalleryImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={galleryUploading}
                      >
                        {galleryUploading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        {galleryUploading ? 'Uploading...' : 'Add Gallery Images'}
                      </Button>
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </div>
                    <Alert>
                      <Image className="h-4 w-4" />
                      <AlertDescription>
                        Upload multiple images to showcase different aspects of your tour. You can select multiple files at once.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="highlights">Highlights (comma-separated)</Label>
                  <Textarea
                    id="highlights"
                    value={formData.highlights?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      highlights: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    })}
                    placeholder="Amazing views, Local cuisine, Cultural experiences"
                  />
                </div>
                
                <div>
                  <Label htmlFor="inclusions">Inclusions (comma-separated)</Label>
                  <Textarea
                    id="inclusions"
                    value={formData.inclusions?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      inclusions: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    })}
                    placeholder="Accommodation, Meals, Transportation, Guide"
                  />
                </div>
                
                <div>
                  <Label htmlFor="exclusions">Exclusions (comma-separated)</Label>
                  <Textarea
                    id="exclusions"
                    value={formData.exclusions?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      exclusions: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    })}
                    placeholder="Flights, Personal expenses, Insurance"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="original-price">Original Price (₹)</Label>
                    <Input
                      id="original-price"
                      type="number"
                      value={formData.original_price || ''}
                      onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="early-bird">Early Bird Discount (%)</Label>
                    <Input
                      id="early-bird"
                      type="number"
                      value={formData.early_bird_discount || ''}
                      onChange={(e) => setFormData({ ...formData, early_bird_discount: parseFloat(e.target.value) })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="last-minute">Last Minute Discount (%)</Label>
                    <Input
                      id="last-minute"
                      type="number"
                      value={formData.last_minute_discount || ''}
                      onChange={(e) => setFormData({ ...formData, last_minute_discount: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Featured Tour</Label>
                    <div className="text-sm text-muted-foreground">
                      Display this tour prominently on the website
                    </div>
                  </div>
                  <Switch
                    checked={formData.featured || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Eco-Friendly</Label>
                    <div className="text-sm text-muted-foreground">
                      Mark as an environmentally conscious tour
                    </div>
                  </div>
                  <Switch
                    checked={formData.is_eco_friendly || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_eco_friendly: checked })}
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating || ''}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="reviews-count">Reviews Count</Label>
                    <Input
                      id="reviews-count"
                      type="number"
                      value={formData.reviews_count || ''}
                      onChange={(e) => setFormData({ ...formData, reviews_count: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={tourMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {tourMutation.isPending ? 'Saving...' : 'Save Tour'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Group Tours</CardTitle>
            <CardDescription>
              Manage your group tour offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tours.map((tour) => (
                <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <img
                      src={getImageUrl(tour.image_url)}
                      alt={tour.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold">{tour.title}</h4>
                      <p className="text-sm text-muted-foreground">{tour.destination}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(tour.status)}>
                          {tour.status}
                        </Badge>
                        {tour.featured && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            Featured
                          </Badge>
                        )}
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {tour.rating} ({tour.reviews_count})
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(tour.price)}</div>
                    <div className="text-sm text-muted-foreground">
                      {tour.available_spots}/{tour.max_participants} spots
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => startEditing(tour)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteMutation.mutate(tour.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GroupTourManager;