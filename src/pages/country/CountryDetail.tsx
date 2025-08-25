import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DayPicker } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  MapPin, Info, Clock, CalendarIcon, CreditCard, Banknote, ShieldCheck, Beer, Landmark,
  Users, Phone, Mail, Globe2, Flag, HandCoins, HeartHandshake, BookOpenText, Map, Smile
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { supabase } from '@/integrations/supabase/client'

interface Country {
  id: string
  name: string
  slug: string
  region: string
  capital?: string
  currency?: string
  climate?: string
  best_season?: string
  languages?: string[]
  annual_visitors?: number
  gender_male_percentage?: number
  gender_female_percentage?: number
  culture?: string
  speciality?: string
  description?: string
  hero_image_url?: string
  map_outline_url?: string
  contact_phone?: string
  contact_email?: string
  visitor_statistics?: any
}

interface FamousPlace {
  id: string
  name: string
  description?: string
  image_url?: string
  type?: string
}

interface EssentialTip {
  id: string
  title: string
  note: string
  icon: string
}

interface CountryMustVisit {
  id: string
  name: string
  description?: string
  image_url?: string
  type?: string
  highlights?: string[]
}

interface TravelPurpose {
  id: string
  name: string
  percentage: number
  color?: string
}

interface CountryFAQ {
  id: string
  question: string
  answer: string
}

interface EnquiryData {
  name: string;
  city: string;
  email: string;
  phone: string;
  whatsapp: string;
  destination: string;
  date: Date | undefined;
  travellers: number;
  vacationType: string;
  captcha: string;
}

// Icon map to avoid dynamic require in browser
const iconMap = {
  CreditCard,
  Banknote,
  ShieldCheck,
  Beer,
  Landmark,
  Smile,
  Info,
} as const;

const CountryDetail: React.FC = () => {
  const { country } = useParams<{ country: string }>()
  const navigate = useNavigate()
  const { toast } = useToast();
  const [loading, setLoading] = useState(true)
  const [countryData, setCountryData] = useState<Country | null>(null)
  const [famousPlaces, setFamousPlaces] = useState<FamousPlace[]>([])
  const [essentialTips, setEssentialTips] = useState<EssentialTip[]>([])
  const [mustVisitPlaces, setMustVisitPlaces] = useState<CountryMustVisit[]>([])
  const [travelPurposes, setTravelPurposes] = useState<TravelPurpose[]>([])
  const [faqs, setFaqs] = useState<CountryFAQ[]>([])
  const [packageCount, setPackageCount] = useState(0)

  // Enquiry form state
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  
  const [formData, setFormData] = useState<EnquiryData>({
    name: "",
    city: "",
    email: "",
    phone: "",
    whatsapp: "",
    destination: "",
    date: undefined,
    travellers: 2,
    vacationType: "Leisure",
    captcha: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (country) {
      loadCountryData(country)
    }
  }, [country])

  // Generate random captcha numbers
  useEffect(() => {
    setA(2 + Math.floor(Math.random() * 8));
    setB(1 + Math.floor(Math.random() * 7));
  }, [country]);

  // Update form destination when country data loads
  useEffect(() => {
    if (countryData) {
      setFormData(prev => ({ ...prev, destination: countryData.name }));
    }
  }, [countryData]);

  const loadCountryData = async (countrySlug: string) => {
    try {
      setLoading(true)

      // Load country basic data
      const { data: countryInfo, error: countryError } = await supabase
        .from('countries')
        .select('*')
        .eq('slug', countrySlug)
        .maybeSingle()

      if (countryError) throw countryError
      setCountryData(countryInfo)

      if (countryInfo) {
        // Load package count
        const { count } = await supabase
          .from('packages')
          .select('*', { count: 'exact', head: true })
          .eq('country_slug', countrySlug)
        
        setPackageCount(count || 0)

        // Load all related data in parallel
        const [placesResult, tipsResult, mustVisitResult, purposesResult, faqResult] = await Promise.all([
          supabase.from('famous_places').select('*').eq('country_id', countryInfo.id).order('name'),
          supabase.from('country_essential_tips').select('*').eq('country_id', countryInfo.id).order('order_index'),
          supabase.from('country_must_visit').select('*').eq('country_id', countryInfo.id).order('order_index'),
          supabase.from('travel_purposes').select('*').eq('country_id', countryInfo.id).order('percentage', { ascending: false }),
          supabase.from('country_faqs').select('*').eq('country_id', countryInfo.id)
        ])

        setFamousPlaces(placesResult.data || [])
        setEssentialTips(tipsResult.data || [])
        setMustVisitPlaces(mustVisitResult.data || [])
        setTravelPurposes(purposesResult.data || [])
        setFaqs(faqResult.data || [])
      }
    } catch (error) {
      console.error('Error loading country data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Form validation and submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.name.length < 2) newErrors.name = "Name required";
    if (formData.city.length < 2) newErrors.city = "City required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email required";
    if (formData.phone.length < 6) newErrors.phone = "Valid phone required";
    if (!formData.date) newErrors.date = "Please select a travel date";
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormField = (field: keyof EnquiryData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const answer = String(a + b);
    if (formData.captcha.trim() !== answer) {
      toast({ title: "CAPTCHA incorrect", description: "Please solve the simple math to verify.", variant: "destructive" });
      return;
    }
    toast({ title: "Enquiry submitted", description: `Thanks ${formData.name}! Our team will reach out shortly.` });
    setFormData({
      name: "",
      city: "",
      email: "",
      phone: "",
      whatsapp: "",
      destination: countryData?.name || "",
      date: undefined,
      travellers: 2,
      vacationType: "Leisure",
      captcha: "",
    });
  };

  // Chart component for travel purposes
  const PurposeChart = () => (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={travelPurposes.map(p => ({ name: p.name, value: p.percentage }))}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip cursor={{ fill: "hsl(var(--muted)/0.2)" }} />
          <Bar dataKey="value" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!countryData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Country not found
            </h2>
            <p className="text-muted-foreground">
              The country you're looking for doesn't exist or has been removed.
            </p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="animate-fade-in">
        {/* Hero Section */}
        <section className="relative overflow-hidden mt-6">
          <div
            className="bg-gradient-to-br from-secondary to-background"
            style={{ backgroundImage: countryData.hero_image_url ? `url(${countryData.hero_image_url})` : "radial-gradient(40rem 40rem at 120% -10%, hsl(var(--accent)/0.15), transparent)" }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
              <div className="grid lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-3">
                  <h1 className="text-3xl sm:text-4xl font-bold text-primary">Explore {countryData.name} Tour Packages</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Flag className="size-4" /> 
                    {countryData.speciality || `Discover ${countryData.name}'s highlights`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {countryData.capital && (
                      <Badge variant="outline" className="gap-1">
                        <MapPin className="size-4" /> Capital: {countryData.capital}
                      </Badge>
                    )}
                    {countryData.currency && (
                      <Badge variant="outline" className="gap-1">
                        <HandCoins className="size-4" /> {countryData.currency}
                      </Badge>
                    )}
                    {countryData.best_season && (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="size-4" /> Best season: {countryData.best_season}
                      </Badge>
                    )}
                    {Array.isArray(countryData.languages) && countryData.languages.length > 0 && (
                      <Badge variant="outline" className="gap-1">
                        <Globe2 className="size-4" /> {countryData.languages.join(", ")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={() => document.getElementById("enquiry")?.scrollIntoView({ behavior: 'smooth' })}>
                      Book Now
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to={`/regions/${countryData.region}`}>View Region Packages</Link>
                    </Button>
                  </div>
                </div>

                {/* Quick Facts Card */}
                <Card className="bg-card/80 backdrop-blur">
                  <CardContent className="p-4 space-y-3">
                    <div className="text-sm text-muted-foreground">Essential facts</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {countryData.currency && (
                        <div>
                          <div className="text-muted-foreground">Currency</div>
                          <div className="font-medium">{countryData.currency}</div>
                        </div>
                      )}
                      {countryData.climate && (
                        <div>
                          <div className="text-muted-foreground">Climate</div>
                          <div className="font-medium">{countryData.climate}</div>
                        </div>
                      )}
                      {countryData.best_season && (
                        <div>
                          <div className="text-muted-foreground">Best Season</div>
                          <div className="font-medium">{countryData.best_season}</div>
                        </div>
                      )}
                      {Array.isArray(countryData.languages) && countryData.languages.length > 0 && (
                        <div>
                          <div className="text-muted-foreground">Languages</div>
                          <div className="font-medium">{countryData.languages.join(', ')}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Essential Tips */}
        {essentialTips?.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Essential Tips</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {essentialTips.map((tip) => {
                const Icon = (iconMap as any)[tip.icon as keyof typeof iconMap] || Info;
                return (
                  <Card key={tip.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Icon className="size-5 text-accent" />
                      <div>
                        <div className="font-medium">{tip.title}</div>
                        <div className="text-sm text-muted-foreground">{tip.note}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Visitor Statistics */}
        {(countryData.annual_visitors || travelPurposes.length > 0) && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <h2 className="text-2xl font-semibold mb-4">Visitor Statistics</h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {countryData.annual_visitors && (
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-2">Annual Visitors</div>
                  <div className="text-3xl font-bold">{countryData.annual_visitors.toLocaleString()}</div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    {countryData.gender_male_percentage && (
                      <div className="flex items-center gap-2">
                        <Users className="size-4" /> Male: {countryData.gender_male_percentage}%
                      </div>
                    )}
                    {countryData.gender_female_percentage && (
                      <div className="flex items-center gap-2">
                        <Users className="size-4" /> Female: {countryData.gender_female_percentage}%
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {travelPurposes.length > 0 && (
                <Card className="p-4 lg:col-span-2">
                  <div className="text-sm text-muted-foreground mb-2">Travel Purposes</div>
                  <PurposeChart />
                </Card>
              )}

              {countryData.map_outline_url && (
                <Card className="p-4 lg:col-span-2">
                  <div className="text-sm text-muted-foreground mb-2">Map Outline</div>
                  <div className="h-48 rounded-md border overflow-hidden">
                    <img 
                      src={countryData.map_outline_url} 
                      alt={`${countryData.name} map outline`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* About Section */}
        {(countryData.culture || countryData.description) && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <h2 className="text-2xl font-semibold">Everything You Need to Know About {countryData.name}</h2>
            <p className="text-muted-foreground mt-2 max-w-3xl">
              {countryData.description || countryData.culture}
            </p>
          </section>
        )}

        {/* Famous Places */}
        {famousPlaces.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <h2 className="text-2xl font-semibold mb-4">Famous Places</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {famousPlaces.map((place) => (
                <Card key={place.id} className="overflow-hidden">
                  {place.image_url && (
                    <div className="h-40 relative">
                      <img 
                        src={place.image_url} 
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{place.name}</h3>
                    {place.description && (
                      <p className="text-sm text-muted-foreground mt-1">{place.description}</p>
                    )}
                    {place.type && (
                      <Badge variant="outline" className="mt-2">{place.type}</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Must Visit Places */}
        {mustVisitPlaces.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <h2 className="text-2xl font-semibold mb-4">Must Visit Places</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mustVisitPlaces.map((place) => (
                <Card key={place.id} className="overflow-hidden">
                  {place.image_url && (
                    <div className="h-40 relative">
                      <img 
                        src={place.image_url} 
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{place.name}</h3>
                    {place.description && (
                      <p className="text-sm text-muted-foreground mt-1">{place.description}</p>
                    )}
                    {place.highlights && place.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {place.highlights.map((highlight, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Travel Tips */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 flex items-start gap-3">
              <Landmark className="size-5 text-accent" />
              <div>
                <div className="font-medium">Visa Requirements</div>
                <div className="text-sm text-muted-foreground">Check eligibility, processing times and required documents.</div>
              </div>
            </Card>
            <Card className="p-4 flex items-start gap-3">
              <ShieldCheck className="size-5 text-accent" />
              <div>
                <div className="font-medium">Health & Safety</div>
                <div className="text-sm text-muted-foreground">Follow local advisories; consider travel insurance.</div>
              </div>
            </Card>
            <Card className="p-4 flex items-start gap-3">
              <HandCoins className="size-5 text-accent" />
              <div>
                <div className="font-medium">Currency & Tipping</div>
                <div className="text-sm text-muted-foreground">Use local currency; tipping norms vary by service.</div>
              </div>
            </Card>
          </div>
        </section>

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <h2 className="text-2xl font-semibold mb-4">FAQs about travelling to {countryData.name}</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* Enquiry Form */}
        <section id="enquiry" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Contact us</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="size-4" /> 
                  {countryData.contact_phone || '+1 (555) 123-4567'}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4" /> 
                  {countryData.contact_email || 'hello@nymphettetours.com'}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 text-lg font-semibold mb-1">
                  Enquire about {countryData.name}
                </div>
                
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => updateFormField('name', e.target.value)}
                  />
                  {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
                </div>
                
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={formData.city}
                    onChange={(e) => updateFormField('city', e.target.value)}
                  />
                  {formErrors.city && <p className="text-xs text-destructive mt-1">{formErrors.city}</p>}
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => updateFormField('email', e.target.value)}
                  />
                  {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email}</p>}
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={(e) => updateFormField('phone', e.target.value)}
                  />
                  {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input 
                    id="whatsapp" 
                    value={formData.whatsapp}
                    onChange={(e) => updateFormField('whatsapp', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input 
                    id="destination" 
                    value={formData.destination}
                    onChange={(e) => updateFormField('destination', e.target.value)}
                    readOnly 
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label>Desired Travel Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DayPicker
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => updateFormField('date', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {formErrors.date && <p className="text-xs text-destructive mt-1">{formErrors.date}</p>}
                </div>

                <div>
                  <Label htmlFor="travellers">Travellers</Label>
                  <Input 
                    id="travellers" 
                    type="number" 
                    min={1} 
                    max={99} 
                    value={formData.travellers}
                    onChange={(e) => updateFormField('travellers', parseInt(e.target.value) || 1)}
                  />
                </div>

                <div>
                  <Label htmlFor="vacationType">Vacation Type</Label>
                  <Input 
                    id="vacationType" 
                    placeholder="Leisure / Family / Honeymoon / Business" 
                    value={formData.vacationType}
                    onChange={(e) => updateFormField('vacationType', e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="captcha">Captcha: What is {a} + {b}?</Label>
                  <Input 
                    id="captcha" 
                    value={formData.captcha}
                    onChange={(e) => updateFormField('captcha', e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Button type="submit" className="w-full">Submit Enquiry</Button>
                </div>
              </form>
            </Card>
          </div>
        </section>
      </main>

      {/* Floating CTA */}
      <Button
        className="fixed bottom-6 right-6 shadow-lg"
        onClick={() => document.getElementById("enquiry")?.scrollIntoView({ behavior: 'smooth' })}
      >
        Enquire Now
      </Button>

      <Footer />
    </div>
  );
}

export default CountryDetail