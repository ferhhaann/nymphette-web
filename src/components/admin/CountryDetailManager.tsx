import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Plus, Save, Upload, BarChart3, Users, MapPin, Shield, CreditCard, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Country {
  id: string;
  name: string;
  slug: string;
  region: string;
  capital?: string;
  currency?: string;
  languages?: string[];
  best_season?: string;
  climate?: string;
  speciality?: string;
  culture?: string;
  description?: string;
  hero_image_url?: string;
  map_outline_url?: string;
  contact_phone?: string;
  contact_email?: string;
  visitor_statistics?: {
    annual?: number;
    gender?: { male?: number; female?: number };
    purposes?: { name: string; value: number }[];
    topOrigins?: string[];
  };
  annual_visitors?: number;
  gender_male_percentage?: number;
  gender_female_percentage?: number;
}

interface EssentialTip {
  id?: string;
  title: string;
  note: string;
  icon: string;
  order_index: number;
}

interface MustVisitPlace {
  id?: string;
  name: string;
  description?: string;
  image_url?: string;
  type: string;
  highlights: string[];
  order_index: number;
}

interface TravelPurpose {
  id?: string;
  name: string;
  percentage: number;
  display_name?: string;
  color?: string;
}

interface CountryFAQ {
  id?: string;
  question: string;
  answer: string;
}

interface CountryDetailManagerProps {
  countryId: string;
  countryName: string;
  onBack: () => void;
}

const iconOptions = [
  'CreditCard', 'Building2', 'Shield', 'Beer', 'Landmark', 'Smile', 'Info',
  'Banknote', 'ShieldCheck', 'Users', 'MapPin', 'Phone', 'Mail', 'Globe2'
];

export const CountryDetailManager: React.FC<CountryDetailManagerProps> = ({
  countryId,
  countryName,
  onBack
}) => {
  const [country, setCountry] = useState<Country | null>(null);
  const [essentialTips, setEssentialTips] = useState<EssentialTip[]>([]);
  const [mustVisitPlaces, setMustVisitPlaces] = useState<MustVisitPlace[]>([]);
  const [travelPurposes, setTravelPurposes] = useState<TravelPurpose[]>([]);
  const [faqs, setFaqs] = useState<CountryFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCountryDetails();
  }, [countryId]);

  const loadCountryDetails = async () => {
    setLoading(true);
    try {
      // Load country details
      const { data: countryData, error: countryError } = await supabase
        .from('countries')
        .select('*')
        .eq('id', countryId)
        .single();

      if (countryError) throw countryError;
      setCountry({
        ...countryData,
        visitor_statistics: countryData.visitor_statistics as Country['visitor_statistics']
      });

      // Load essential tips
      const { data: tipsData, error: tipsError } = await supabase
        .from('country_essential_tips')
        .select('*')
        .eq('country_id', countryId)
        .order('order_index');

      if (tipsError) throw tipsError;
      setEssentialTips(tipsData || []);

      // Load must visit places
      const { data: placesData, error: placesError } = await supabase
        .from('country_must_visit')
        .select('*')
        .eq('country_id', countryId)
        .order('order_index');

      if (placesError) throw placesError;
      setMustVisitPlaces(placesData || []);

      // Load travel purposes
      const { data: purposesData, error: purposesError } = await supabase
        .from('travel_purposes')
        .select('*')
        .eq('country_id', countryId);

      if (purposesError) throw purposesError;
      setTravelPurposes(purposesData || []);

      // Load FAQs
      const { data: faqsData, error: faqsError } = await supabase
        .from('country_faqs')
        .select('*')
        .eq('country_id', countryId);

      if (faqsError) throw faqsError;
      setFaqs(faqsData || []);

    } catch (error) {
      console.error('Error loading country details:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load country details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCountryBasics = async () => {
    if (!country) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('countries')
        .update({
          name: country.name,
          capital: country.capital,
          currency: country.currency,
          languages: country.languages,
          best_season: country.best_season,
          climate: country.climate,
          speciality: country.speciality,
          culture: country.culture,
          description: country.description,
          hero_image_url: country.hero_image_url,
          map_outline_url: country.map_outline_url,
          contact_phone: country.contact_phone,
          contact_email: country.contact_email,
          annual_visitors: country.annual_visitors,
          gender_male_percentage: country.gender_male_percentage,
          gender_female_percentage: country.gender_female_percentage,
          visitor_statistics: country.visitor_statistics
        })
        .eq('id', countryId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Country details updated successfully"
      });
    } catch (error) {
      console.error('Error saving country:', error);
      toast({
        title: "Error",
        description: "Failed to save country details",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const saveEssentialTips = async () => {
    setSaving(true);
    try {
      // Delete existing tips
      await supabase
        .from('country_essential_tips')
        .delete()
        .eq('country_id', countryId);

      // Insert new tips
      if (essentialTips.length > 0) {
        const { error } = await supabase
          .from('country_essential_tips')
          .insert(essentialTips.map(tip => ({
            country_id: countryId,
            title: tip.title,
            note: tip.note,
            icon: tip.icon,
            order_index: tip.order_index
          })));

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Essential tips updated successfully"
      });
    } catch (error) {
      console.error('Error saving tips:', error);
      toast({
        title: "Error",
        description: "Failed to save essential tips",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const saveMustVisitPlaces = async () => {
    setSaving(true);
    try {
      // Delete existing places
      await supabase
        .from('country_must_visit')
        .delete()
        .eq('country_id', countryId);

      // Insert new places
      if (mustVisitPlaces.length > 0) {
        const { error } = await supabase
          .from('country_must_visit')
          .insert(mustVisitPlaces.map(place => ({
            country_id: countryId,
            name: place.name,
            description: place.description,
            image_url: place.image_url,
            type: place.type,
            highlights: place.highlights,
            order_index: place.order_index
          })));

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Must-visit places updated successfully"
      });
    } catch (error) {
      console.error('Error saving places:', error);
      toast({
        title: "Error",
        description: "Failed to save must-visit places",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const saveTravelPurposes = async () => {
    setSaving(true);
    try {
      // Delete existing purposes
      await supabase
        .from('travel_purposes')
        .delete()
        .eq('country_id', countryId);

      // Insert new purposes
      if (travelPurposes.length > 0) {
        const { error } = await supabase
          .from('travel_purposes')
          .insert(travelPurposes.map(purpose => ({
            country_id: countryId,
            name: purpose.name,
            percentage: purpose.percentage,
            display_name: purpose.display_name,
            color: purpose.color
          })));

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Travel purposes updated successfully"
      });
    } catch (error) {
      console.error('Error saving purposes:', error);
      toast({
        title: "Error",
        description: "Failed to save travel purposes",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const saveFAQs = async () => {
    setSaving(true);
    try {
      // Delete existing FAQs
      await supabase
        .from('country_faqs')
        .delete()
        .eq('country_id', countryId);

      // Insert new FAQs
      if (faqs.length > 0) {
        const { error } = await supabase
          .from('country_faqs')
          .insert(faqs.map(faq => ({
            country_id: countryId,
            question: faq.question,
            answer: faq.answer
          })));

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "FAQs updated successfully"
      });
    } catch (error) {
      console.error('Error saving FAQs:', error);
      toast({
        title: "Error",
        description: "Failed to save FAQs",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-32 bg-muted animate-pulse rounded" />
        <div className="h-32 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!country) {
    return (
      <Alert>
        <AlertDescription>
          Country not found. Please go back and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={onBack} className="mb-4">
            ← Back to Countries
          </Button>
          <h2 className="text-2xl font-bold">Manage {countryName} Details</h2>
        </div>
      </div>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="tips">Essential Tips</TabsTrigger>
          <TabsTrigger value="places">Must Visit</TabsTrigger>
          <TabsTrigger value="purposes">Travel Purposes</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Country Name</Label>
                  <Input
                    id="name"
                    value={country.name}
                    onChange={(e) => setCountry({ ...country, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="capital">Capital</Label>
                  <Input
                    id="capital"
                    value={country.capital || ''}
                    onChange={(e) => setCountry({ ...country, capital: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={country.currency || ''}
                    onChange={(e) => setCountry({ ...country, currency: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="climate">Climate</Label>
                  <Input
                    id="climate"
                    value={country.climate || ''}
                    onChange={(e) => setCountry({ ...country, climate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bestSeason">Best Season</Label>
                  <Input
                    id="bestSeason"
                    value={country.best_season || ''}
                    onChange={(e) => setCountry({ ...country, best_season: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="languages">Languages (comma-separated)</Label>
                  <Input
                    id="languages"
                    value={country.languages?.join(', ') || ''}
                    onChange={(e) => setCountry({ 
                      ...country, 
                      languages: e.target.value.split(',').map(lang => lang.trim()).filter(Boolean)
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="speciality">Speciality</Label>
                <Input
                  id="speciality"
                  value={country.speciality || ''}
                  onChange={(e) => setCountry({ ...country, speciality: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={country.description || ''}
                  onChange={(e) => setCountry({ ...country, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="culture">Culture</Label>
                <Textarea
                  id="culture"
                  value={country.culture || ''}
                  onChange={(e) => setCountry({ ...country, culture: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heroImage">Hero Image URL</Label>
                  <Input
                    id="heroImage"
                    value={country.hero_image_url || ''}
                    onChange={(e) => setCountry({ ...country, hero_image_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="mapOutline">Map Outline URL</Label>
                  <Input
                    id="mapOutline"
                    value={country.map_outline_url || ''}
                    onChange={(e) => setCountry({ ...country, map_outline_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={country.contact_phone || ''}
                    onChange={(e) => setCountry({ ...country, contact_phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    value={country.contact_email || ''}
                    onChange={(e) => setCountry({ ...country, contact_email: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Visitor Statistics
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="annualVisitors">Annual Visitors</Label>
                    <Input
                      id="annualVisitors"
                      type="number"
                      value={country.annual_visitors || ''}
                      onChange={(e) => setCountry({ ...country, annual_visitors: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="malePercentage">Male Percentage</Label>
                    <Input
                      id="malePercentage"
                      type="number"
                      max="100"
                      value={country.gender_male_percentage || ''}
                      onChange={(e) => setCountry({ ...country, gender_male_percentage: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="femalePercentage">Female Percentage</Label>
                    <Input
                      id="femalePercentage"
                      type="number"
                      max="100"
                      value={country.gender_female_percentage || ''}
                      onChange={(e) => setCountry({ ...country, gender_female_percentage: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={saveCountryBasics} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Basic Information'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Essential Tips
                </span>
                <Button
                  onClick={() => setEssentialTips([
                    ...essentialTips,
                    { title: '', note: '', icon: 'Info', order_index: essentialTips.length }
                  ])}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Tip
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {essentialTips.map((tip, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Tip #{index + 1}</h4>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setEssentialTips(essentialTips.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={tip.title}
                        onChange={(e) => {
                          const newTips = [...essentialTips];
                          newTips[index].title = e.target.value;
                          setEssentialTips(newTips);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <Select
                        value={tip.icon}
                        onValueChange={(value) => {
                          const newTips = [...essentialTips];
                          newTips[index].icon = value;
                          setEssentialTips(newTips);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map(icon => (
                            <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={tip.order_index}
                        onChange={(e) => {
                          const newTips = [...essentialTips];
                          newTips[index].order_index = parseInt(e.target.value) || 0;
                          setEssentialTips(newTips);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Note</Label>
                    <Textarea
                      value={tip.note}
                      onChange={(e) => {
                        const newTips = [...essentialTips];
                        newTips[index].note = e.target.value;
                        setEssentialTips(newTips);
                      }}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              
              <Button onClick={saveEssentialTips} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Essential Tips'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="places" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Must Visit Places
                </span>
                <Button
                  onClick={() => setMustVisitPlaces([
                    ...mustVisitPlaces,
                    { name: '', description: '', image_url: '', type: 'attraction', highlights: [], order_index: mustVisitPlaces.length }
                  ])}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Place
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mustVisitPlaces.map((place, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Place #{index + 1}</h4>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setMustVisitPlaces(mustVisitPlaces.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={place.name}
                        onChange={(e) => {
                          const newPlaces = [...mustVisitPlaces];
                          newPlaces[index].name = e.target.value;
                          setMustVisitPlaces(newPlaces);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={place.type}
                        onValueChange={(value) => {
                          const newPlaces = [...mustVisitPlaces];
                          newPlaces[index].type = value;
                          setMustVisitPlaces(newPlaces);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="attraction">Attraction</SelectItem>
                          <SelectItem value="landmark">Landmark</SelectItem>
                          <SelectItem value="natural">Natural</SelectItem>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="historical">Historical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={place.description || ''}
                      onChange={(e) => {
                        const newPlaces = [...mustVisitPlaces];
                        newPlaces[index].description = e.target.value;
                        setMustVisitPlaces(newPlaces);
                      }}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={place.image_url || ''}
                      onChange={(e) => {
                        const newPlaces = [...mustVisitPlaces];
                        newPlaces[index].image_url = e.target.value;
                        setMustVisitPlaces(newPlaces);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Highlights (comma-separated)</Label>
                    <Input
                      value={place.highlights.join(', ')}
                      onChange={(e) => {
                        const newPlaces = [...mustVisitPlaces];
                        newPlaces[index].highlights = e.target.value.split(',').map(h => h.trim()).filter(Boolean);
                        setMustVisitPlaces(newPlaces);
                      }}
                    />
                  </div>
                </div>
              ))}
              
              <Button onClick={saveMustVisitPlaces} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Must Visit Places'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purposes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Travel Purposes
                </span>
                <Button
                  onClick={() => setTravelPurposes([
                    ...travelPurposes,
                    { name: '', percentage: 0, display_name: '', color: '#8B5CF6' }
                  ])}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Purpose
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {travelPurposes.map((purpose, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Purpose #{index + 1}</h4>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setTravelPurposes(travelPurposes.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={purpose.name}
                        onChange={(e) => {
                          const newPurposes = [...travelPurposes];
                          newPurposes[index].name = e.target.value;
                          setTravelPurposes(newPurposes);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Display Name</Label>
                      <Input
                        value={purpose.display_name || ''}
                        onChange={(e) => {
                          const newPurposes = [...travelPurposes];
                          newPurposes[index].display_name = e.target.value;
                          setTravelPurposes(newPurposes);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Percentage</Label>
                      <Input
                        type="number"
                        max="100"
                        value={purpose.percentage}
                        onChange={(e) => {
                          const newPurposes = [...travelPurposes];
                          newPurposes[index].percentage = parseInt(e.target.value) || 0;
                          setTravelPurposes(newPurposes);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Color</Label>
                      <Input
                        type="color"
                        value={purpose.color || '#8B5CF6'}
                        onChange={(e) => {
                          const newPurposes = [...travelPurposes];
                          newPurposes[index].color = e.target.value;
                          setTravelPurposes(newPurposes);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button onClick={saveTravelPurposes} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Travel Purposes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Frequently Asked Questions</span>
                <Button
                  onClick={() => setFaqs([
                    ...faqs,
                    { question: '', answer: '' }
                  ])}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Add FAQ
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">FAQ #{index + 1}</h4>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Question</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index].question = e.target.value;
                        setFaqs(newFaqs);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index].answer = e.target.value;
                        setFaqs(newFaqs);
                      }}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              
              <Button onClick={saveFAQs} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save FAQs'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};