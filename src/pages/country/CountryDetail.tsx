import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { 
  MapPin, Phone, Mail, Calendar, Users, Clock, Globe, 
  BookOpen, Lightbulb, AlertCircle, Package, CheckCircle,
  Camera, Utensils, ShoppingBag, Heart, Palette, Info,
  ArrowRight, Star
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CountryBreadcrumb } from '@/components/regions/CountryBreadcrumb'
import { CountryStats } from '@/components/regions/CountryStats'
import { CountryQuickInfo } from '@/components/regions/CountryQuickInfo'
import { CountryPackagesList } from '@/components/regions/CountryPackagesList'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel"
import { useStaticSEO } from "@/hooks/useStaticSEO"

// Import hero images
import japanHero1 from '@/assets/hero/japan-hero-1.jpg'
import japanHero2 from '@/assets/hero/japan-hero-2.jpg'
import japanHero3 from '@/assets/hero/japan-hero-3.jpg'

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
  overview_description?: string
  about_content?: string
  fun_facts?: any
  before_you_go_tips?: any
  best_time_content?: string
  reasons_to_visit?: any
  food_shopping_content?: string
  dos_donts?: any
  art_culture_content?: string
  travel_tips?: string
  contact_info?: any
  visitor_statistics?: any
}

interface CountrySection {
  id: string
  section_name: string
  title?: string
  content: any
  images?: any
  order_index: number
  is_enabled: boolean
}

interface CountryHeroImage {
  id: string
  image_url: string
  alt_text?: string
  caption?: string
  order_index: number
}

interface EssentialTip {
  id: string
  title: string
  note: string
  icon: string
}

interface TravelPurpose {
  id: string
  name: string
  percentage: number
}

interface CountryFAQ {
  id: string
  question: string
  answer: string
}

interface EnquiryForm {
  name: string
  email: string
  phone: string
  message: string
  destination: string
  travel_date: string
  travelers: number
}

const CountryDetail = () => {
  useStaticSEO(); // Apply SEO settings from database
  const { country } = useParams<{ country: string }>()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [countryData, setCountryData] = useState<Country | null>(null)
  const [sections, setSections] = useState<CountrySection[]>([])
  const [heroImages, setHeroImages] = useState<CountryHeroImage[]>([])
  const [essentialTips, setEssentialTips] = useState<EssentialTip[]>([])
  const [travelPurposes, setTravelPurposes] = useState<TravelPurpose[]>([])
  const [faqs, setFaqs] = useState<CountryFAQ[]>([])
  const [packageCount, setPackageCount] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [enquiryForm, setEnquiryForm] = useState<EnquiryForm>({
    name: '',
    email: '',
    phone: '',
    message: '',
    destination: '',
    travel_date: '',
    travelers: 2
  })

  useEffect(() => {
    if (country) {
      loadCountryData(country)
    }
  }, [country])

  // Set up real-time subscriptions for live updates
  useEffect(() => {
    if (!countryData?.id) return

    const channel = supabase
      .channel(`country-detail-${countryData.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'countries',
          filter: `id=eq.${countryData.id}`
        },
        (payload) => {
          console.log('Country data changed:', payload)
          if (country) loadCountryData(country)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'country_sections',
          filter: `country_id=eq.${countryData.id}`
        },
        (payload) => {
          console.log('Country sections changed:', payload)
          if (country) loadCountryData(country)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'country_essential_tips',
          filter: `country_id=eq.${countryData.id}`
        },
        (payload) => {
          console.log('Essential tips changed:', payload)
          if (country) loadCountryData(country)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'country_hero_images',
          filter: `country_id=eq.${countryData.id}`
        },
        (payload) => {
          console.log('Hero images changed:', payload)
          if (country) loadCountryData(country)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'travel_purposes',
          filter: `country_id=eq.${countryData.id}`
        },
        (payload) => {
          console.log('Travel purposes changed:', payload)
          if (country) loadCountryData(country)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'country_faqs',
          filter: `country_id=eq.${countryData.id}`
        },
        (payload) => {
          console.log('FAQs changed:', payload)
          if (country) loadCountryData(country)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [countryData?.id, country])

  // Automatic slideshow effect for hero images
  useEffect(() => {
    if (!carouselApi) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [carouselApi]);

  const loadCountryData = async (countrySlug: string) => {
    try {
      setLoading(true)

      // Load country basic data
      const { data: countryInfo, error: countryError } = await supabase
        .from('countries')
        .select('*')
        .eq('slug', countrySlug)
        .single()

      if (countryError) throw countryError
      setCountryData(countryInfo)

      if (countryInfo) {
        setEnquiryForm(prev => ({ ...prev, destination: countryInfo.name }))

        // Load package count
        const { count } = await supabase
          .from('packages')
          .select('*', { count: 'exact', head: true })
          .eq('country_slug', countrySlug)
        
        setPackageCount(count || 0)

        // Load all related data in parallel
        const [sectionsResult, heroImagesResult, tipsResult, purposesResult, faqResult] = await Promise.all([
          supabase.from('country_sections').select('*').eq('country_id', countryInfo.id).eq('is_enabled', true).order('order_index'),
          supabase.from('country_hero_images').select('*').eq('country_id', countryInfo.id).order('order_index'),
          supabase.from('country_essential_tips').select('*').eq('country_id', countryInfo.id).order('order_index'),
          supabase.from('travel_purposes').select('*').eq('country_id', countryInfo.id).order('percentage', { ascending: false }),
          supabase.from('country_faqs').select('*').eq('country_id', countryInfo.id)
        ])

        setSections(sectionsResult.data || [])
        setHeroImages(heroImagesResult.data || [])
        setEssentialTips(tipsResult.data || [])
        setTravelPurposes(purposesResult.data || [])
        setFaqs(faqResult.data || [])
      }
    } catch (error) {
      console.error('Error loading country data:', error)
      toast({
        title: "Error",
        description: "Failed to load country information",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple validation
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    // In a real app, you'd send this to your backend
    toast({
      title: "Enquiry Submitted",
      description: `Thank you ${enquiryForm.name}! We'll contact you soon about your ${enquiryForm.destination} trip.`
    })

    // Reset form
    setEnquiryForm({
      name: '',
      email: '',
      phone: '',
      message: '',
      destination: countryData?.name || '',
      travel_date: '',
      travelers: 2
    })
  }

  const getSectionByName = (name: string) => {
    return sections.find(section => section.section_name === name)
  }

  const iconMap = {
    MapPin, Phone, Mail, Calendar, Users, Clock, Globe, 
    BookOpen, Lightbulb, AlertCircle, Package, CheckCircle,
    Camera, Utensils, ShoppingBag, Heart, Palette, Info
  }

  // Hero images with fallback
  const displayHeroImages = heroImages.length > 0 ? heroImages.map(img => ({
    ...img,
    image_url: img.image_url.startsWith('/src/') ? img.image_url.replace('/src/', '') : img.image_url
  })) : [
    { id: '1', image_url: japanHero1, alt_text: 'Hero Image 1', caption: '', order_index: 1 },
    { id: '2', image_url: japanHero2, alt_text: 'Hero Image 2', caption: '', order_index: 2 },
    { id: '3', image_url: japanHero3, alt_text: 'Hero Image 3', caption: '', order_index: 3 }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-96 bg-muted rounded"></div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Country not found
            </h2>
            <p className="text-muted-foreground">
              The country you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const heroSection = getSectionByName('hero')
  const overviewSection = getSectionByName('overview')
  const aboutSection = getSectionByName('about')
  const funFactsSection = getSectionByName('fun_facts')
  const beforeYouGoSection = getSectionByName('before_you_go')
  const bestTimeSection = getSectionByName('best_time')
  const reasonsSection = getSectionByName('reasons_to_visit')
  const foodShoppingSection = getSectionByName('food_shopping')
  const dosDontsSection = getSectionByName('dos_donts')
  const artCultureSection = getSectionByName('art_culture')

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        {/* Breadcrumb */}
        <CountryBreadcrumb 
          region={countryData.region} 
          countryName={countryData.name} 
        />

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl mb-8 mt-2">
          <div className="relative h-96 lg:h-[500px]">
            <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="w-full h-full">
              <CarouselContent>
                {displayHeroImages.map((image, index) => (
                  <CarouselItem key={image.id}>
                    <div className="relative h-96 lg:h-[500px] w-full">
                      <img 
                        src={image.image_url} 
                        alt={image.alt_text || countryData.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            
            {/* Hero Content Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full px-8 lg:px-16">
                <div className="max-w-2xl">
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                    {heroSection?.title || `Discover ${countryData.name}`}
                  </h1>
                  <p className="text-lg lg:text-xl text-white/90 mb-6">
                    {heroSection?.content?.description || countryData.description || `Experience the best of ${countryData.name}`}
                  </p>
                  {heroSection?.content?.highlights && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {heroSection.content.highlights.map((highlight: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4">
                    <Button size="lg" onClick={() => document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' })}>
                      Plan Your Trip
                    </Button>
                    <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Package className="h-4 w-4 mr-2" />
                      {packageCount} Packages Available
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Country Info & Stats */}
        <section className="grid lg:grid-cols-3 gap-8 my-8">
          {/* Essential Information - Left Side */}
          <div className="lg:col-span-2">
            <CountryQuickInfo
              currency={countryData.currency}
              bestSeason={countryData.best_season}
              languages={countryData.languages}
              climate={countryData.climate}
            />
          </div>
          
          {/* Visitor Statistics - Right Side */}
          {(countryData.annual_visitors || travelPurposes.length > 0) && (
            <div className="lg:col-span-1">
              <CountryStats
                annualVisitors={countryData.annual_visitors}
                genderMalePercentage={countryData.gender_male_percentage}
                genderFemalePercentage={countryData.gender_female_percentage}
                travelPurposes={travelPurposes}
                topOriginCities={countryData?.visitor_statistics && typeof countryData.visitor_statistics === 'object' ? (countryData.visitor_statistics as any).topOrigins : undefined}
              />
            </div>
          )}
        </section>

        {/* Essential Tips */}
        {essentialTips.length > 0 && (
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Lightbulb className="h-6 w-6 mr-2 text-primary" />
              Essential Travel Tips
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {essentialTips.map((tip) => {
                const IconComponent = (iconMap as any)[tip.icon] || Info
                return (
                  <Card key={tip.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.note}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>
        )}


        {/* Overview & Contents */}
        {overviewSection && (
          <section className="my-8">
            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <BookOpen className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {overviewSection.title}
                  </h2>
                </div>
                
                {overviewSection.content?.subtitle && (
                  <p className="text-xl font-semibold text-primary/90 mb-4 pl-1">
                    {overviewSection.content.subtitle}
                  </p>
                )}
                
                <p className="text-muted-foreground leading-relaxed text-base mb-6">
                  {overviewSection.content?.description}
                </p>
                
                {overviewSection.content?.highlight && (
                  <div className="my-6 p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border-l-4 border-primary shadow-sm">
                    <p className="font-medium text-foreground">{overviewSection.content.highlight}</p>
                  </div>
                )}
                
                {overviewSection.content?.points && overviewSection.content.points.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {overviewSection.content.points.map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {/* Quick Navigation */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                    Jump to Section
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sections.filter(s => s.section_name !== 'hero' && s.section_name !== 'overview').map((section) => (
                      <Button 
                        key={section.id}
                        variant="outline" 
                        className="justify-start h-auto py-3 px-4 hover:bg-primary/5 hover:border-primary/50 transition-all group"
                        onClick={() => document.getElementById(section.section_name)?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        <span className="text-left">{section.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Main Sections */}
        <div className="space-y-8">
          {/* About Section */}
          {aboutSection && (
            <section id="about" className="my-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Globe className="h-6 w-6 mr-2 text-primary" />
                  {aboutSection.title}
                </h2>
                {aboutSection.content?.subtitle && (
                  <p className="text-lg font-semibold text-primary mb-3">
                    {aboutSection.content.subtitle}
                  </p>
                )}
                <p className="text-muted-foreground leading-relaxed">
                  {aboutSection.content?.description}
                </p>
                {aboutSection.content?.highlight && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="text-sm font-medium">{aboutSection.content.highlight}</p>
                  </div>
                )}
                {aboutSection.content?.points && aboutSection.content.points.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {aboutSection.content.points.map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </section>
          )}

          {/* Fun Facts */}
          {funFactsSection && funFactsSection.content?.facts && (
            <section id="fun_facts" className="my-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Star className="h-6 w-6 mr-2 text-primary" />
                  {funFactsSection.title}
                </h2>
                {funFactsSection.content?.description && (
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {funFactsSection.content.description}
                  </p>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  {funFactsSection.content.facts.map((fact: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <p className="text-sm">{fact}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}

          {/* Before You Go */}
          {beforeYouGoSection && beforeYouGoSection.content?.tips && (
            <section id="before_you_go" className="my-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <AlertCircle className="h-6 w-6 mr-2 text-primary" />
                  {beforeYouGoSection.title}
                </h2>
                {beforeYouGoSection.content?.description && (
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {beforeYouGoSection.content.description}
                  </p>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  {beforeYouGoSection.content.tips.map((tip: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}

          {/* Best Packages */}
          <section id="packages" className="my-8">
            <CountryPackagesList countrySlug={country || ''} countryName={countryData.name} />
          </section>

          {/* Best Time to Visit */}
          {bestTimeSection && (
            <section id="best_time" className="my-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-primary" />
                  {bestTimeSection.title}
                </h2>
                {bestTimeSection.content?.subtitle && (
                  <p className="text-lg font-semibold text-primary mb-3">
                    {bestTimeSection.content.subtitle}
                  </p>
                )}
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {bestTimeSection.content?.content || bestTimeSection.content?.description}
                </p>
                {bestTimeSection.content?.highlights && bestTimeSection.content.highlights.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-3">Seasonal Highlights</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {bestTimeSection.content.highlights.map((highlight: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
                          <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </section>
          )}

          {/* Reasons to Visit */}
          {reasonsSection && reasonsSection.content?.reasons && (
            <section id="reasons_to_visit" className="my-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Heart className="h-6 w-6 mr-2 text-primary" />
                  {reasonsSection.title}
                </h2>
                {reasonsSection.content?.description && (
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {reasonsSection.content.description}
                  </p>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  {reasonsSection.content.reasons.map((reason: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                      <Heart className="h-5 w-5 text-primary mt-0.5" />
                      <p className="text-sm">{reason}</p>
                    </div>
                  ))}
                </div>
                {reasonsSection.content?.highlight && (
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                    <p className="text-sm font-medium">{reasonsSection.content.highlight}</p>
                  </div>
                )}
              </Card>
            </section>
          )}

          {/* Food & Shopping */}
          {foodShoppingSection && (
            <section id="food_shopping" className="my-8">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Utensils className="h-5 w-5 mr-2 text-primary" />
                    Local Cuisine
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {foodShoppingSection.content?.food}
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                    Shopping
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {foodShoppingSection.content?.shopping}
                  </p>
                </Card>
              </div>
            </section>
          )}

          {/* Dos and Don'ts */}
          {dosDontsSection && (dosDontsSection.content?.dos || dosDontsSection.content?.donts) && (
            <section id="dos_donts" className="my-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2 text-primary" />
                  {dosDontsSection.title}
                </h2>
                <div className="grid lg:grid-cols-2 gap-6">
                  {dosDontsSection.content?.dos && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-green-600">Do's</h3>
                      <div className="space-y-3">
                        {dosDontsSection.content.dos.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <p className="text-sm">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {dosDontsSection.content?.donts && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-red-600">Don'ts</h3>
                      <div className="space-y-3">
                        {dosDontsSection.content.donts.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <p className="text-sm">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </section>
          )}

          {/* Art & Culture */}
          {artCultureSection && (
            <section id="art_culture" className="my-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Palette className="h-6 w-6 mr-2 text-primary" />
                  {artCultureSection.title}
                </h2>
                {artCultureSection.content?.subtitle && (
                  <p className="text-lg font-semibold text-primary mb-3">
                    {artCultureSection.content.subtitle}
                  </p>
                )}
                <p className="text-muted-foreground leading-relaxed">
                  {artCultureSection.content?.content || artCultureSection.content?.description}
                </p>
                {artCultureSection.content?.highlight && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="text-sm font-medium">{artCultureSection.content.highlight}</p>
                  </div>
                )}
                {artCultureSection.content?.points && artCultureSection.content.points.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {artCultureSection.content.points.map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Palette className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </section>
          )}
        </div>

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="my-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.id} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </section>
        )}

        {/* Contact & Enquiry */}
        <section id="enquiry" className="my-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{countryData.contact_info?.phone || '+1 (555) 123-4567'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>{countryData.contact_info?.email || 'hello@nymphettetours.com'}</span>
                </div>
                {countryData.contact_info?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <span>{countryData.contact_info.address}</span>
                  </div>
                )}
              </div>
              
              {/* Travel Tips */}
              {countryData.travel_tips && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Quick Travel Tips</h4>
                  <p className="text-sm text-muted-foreground">{countryData.travel_tips}</p>
                </div>
              )}
            </Card>

            {/* Enquiry Form */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Plan Your {countryData.name} Trip</h3>
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="travelers">Number of Travelers</Label>
                    <Input
                      id="travelers"
                      type="number"
                      min="1"
                      value={enquiryForm.travelers}
                      onChange={(e) => setEnquiryForm(prev => ({ ...prev, travelers: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="travel_date">Preferred Travel Date</Label>
                  <Input
                    id="travel_date"
                    type="date"
                    value={enquiryForm.travel_date}
                    onChange={(e) => setEnquiryForm(prev => ({ ...prev, travel_date: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your travel preferences, special requirements, or any questions..."
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Send Enquiry
                </Button>
              </form>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default CountryDetail