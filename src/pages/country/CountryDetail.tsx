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
import { CountryAttractionsGallery } from '@/components/regions/CountryAttractionsGallery'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  const [activeTab, setActiveTab] = useState("travel-guide")

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
    <div className="min-h-screen bg-[hsl(var(--luxury-cream))]">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        {/* Breadcrumb */}
        <CountryBreadcrumb 
          region={countryData.region} 
          countryName={countryData.name} 
        />

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-lg md:rounded-2xl mb-6 md:mb-8 mt-2">
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
            <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="w-full h-full">
              <CarouselContent>
                {displayHeroImages.map((image, index) => (
                  <CarouselItem key={image.id}>
                    <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] w-full">
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
              <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16">
                <div className="max-w-2xl">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
                    {heroSection?.title || `Discover ${countryData.name}`}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">
                    {heroSection?.content?.description || countryData.description || `Experience the best of ${countryData.name}`}
                  </p>
                  {heroSection?.content?.highlights && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 md:mb-6">
                      {heroSection.content.highlights.map((highlight: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Button size="lg" className="bg-[hsl(var(--luxury-gold))] hover:bg-[hsl(var(--luxury-gold-light))] text-[hsl(var(--luxury-navy))] font-semibold shadow-lg w-full sm:w-auto" onClick={() => document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' })}>
                      Plan Your Trip
                    </Button>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                      <Package className="h-4 w-4 mr-2" />
                      <span className="truncate">{packageCount} Packages</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Country Info & Stats */}
        <section className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 my-6 md:my-8">
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
          <section className="my-8 md:my-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center text-[hsl(var(--luxury-navy))]">
              <Lightbulb className="h-6 w-6 md:h-7 md:w-7 mr-3 text-[hsl(var(--luxury-gold))]" />
              Essential Travel Tips
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {essentialTips.map((tip) => {
                const IconComponent = (iconMap as any)[tip.icon] || Info
                return (
                  <Card key={tip.id} className="p-6 bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[hsl(var(--luxury-gold))]">
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-6 w-6 text-[hsl(var(--luxury-gold))] mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-[hsl(var(--luxury-navy))] text-lg mb-2">{tip.title}</h4>
                        <p className="text-sm text-[hsl(var(--luxury-accent))] leading-relaxed">{tip.note}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>
        )}


        {/* Overview Section - Always Visible */}
        {overviewSection && (
          <section className="my-8 md:my-12">
            <Card className="p-6 md:p-10 bg-white border-none shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center text-[hsl(var(--luxury-navy))]">
                <BookOpen className="h-7 w-7 mr-3 text-[hsl(var(--luxury-gold))]" />
                {overviewSection.title}
              </h2>
              {overviewSection.content?.subtitle && (
                <p className="text-xl font-semibold text-[hsl(var(--luxury-gold))] mb-4">
                  {overviewSection.content.subtitle}
                </p>
              )}
              <p className="text-[hsl(var(--luxury-accent))] leading-relaxed text-base md:text-lg">
                {overviewSection.content?.description}
              </p>
              {overviewSection.content?.highlight && (
                <div className="mt-6 p-5 bg-gradient-to-r from-[hsl(var(--luxury-gold))]/10 to-transparent rounded-lg border-l-4 border-[hsl(var(--luxury-gold))]">
                  <p className="text-base font-medium text-[hsl(var(--luxury-navy))]">{overviewSection.content.highlight}</p>
                </div>
              )}
              {overviewSection.content?.points && overviewSection.content.points.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {overviewSection.content.points.map((point: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--luxury-gold))] mt-0.5 flex-shrink-0" />
                      <span className="text-base text-[hsl(var(--luxury-accent))]">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </section>
        )}

        {/* Packages Section - Always Visible */}
        <CountryPackagesList 
          countrySlug={country} 
          countryName={countryData.name}
        />

        {/* Additional Information Tabs - Maximum 4 Tabs */}
        {(beforeYouGoSection || dosDontsSection || bestTimeSection || reasonsSection || foodShoppingSection || artCultureSection || funFactsSection || aboutSection) && (
          <section className="my-8 md:my-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto flex-nowrap md:flex-wrap h-auto gap-2 md:gap-3 bg-white p-2 md:p-3 scrollbar-hide shadow-md rounded-xl border-none">
                {(beforeYouGoSection || dosDontsSection) && <TabsTrigger value="travel-guide" className="text-sm md:text-base whitespace-nowrap data-[state=active]:bg-[hsl(var(--luxury-navy))] data-[state=active]:text-white data-[state=inactive]:text-[hsl(var(--luxury-accent))] px-4 md:px-6 py-2 md:py-3 font-medium rounded-lg transition-all">Travel Guide</TabsTrigger>}
                {(bestTimeSection || reasonsSection) && <TabsTrigger value="planning" className="text-sm md:text-base whitespace-nowrap data-[state=active]:bg-[hsl(var(--luxury-navy))] data-[state=active]:text-white data-[state=inactive]:text-[hsl(var(--luxury-accent))] px-4 md:px-6 py-2 md:py-3 font-medium rounded-lg transition-all">Planning</TabsTrigger>}
                {(foodShoppingSection || artCultureSection) && <TabsTrigger value="experiences" className="text-sm md:text-base whitespace-nowrap data-[state=active]:bg-[hsl(var(--luxury-navy))] data-[state=active]:text-white data-[state=inactive]:text-[hsl(var(--luxury-accent))] px-4 md:px-6 py-2 md:py-3 font-medium rounded-lg transition-all">Experiences</TabsTrigger>}
                {(funFactsSection || aboutSection) && <TabsTrigger value="discover" className="text-sm md:text-base whitespace-nowrap data-[state=active]:bg-[hsl(var(--luxury-navy))] data-[state=active]:text-white data-[state=inactive]:text-[hsl(var(--luxury-accent))] px-4 md:px-6 py-2 md:py-3 font-medium rounded-lg transition-all">Discover</TabsTrigger>}
              </TabsList>

              {/* Travel Guide Tab (Before You Go + Do's & Don'ts) */}
              {(beforeYouGoSection || dosDontsSection) && (
                <TabsContent value="travel-guide" className="mt-6 md:mt-8 space-y-6">
                  {/* Before You Go Section */}
                  {beforeYouGoSection && beforeYouGoSection.content?.tips && (
                    <Card className="p-6 md:p-8 bg-white border-none shadow-lg">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center text-[hsl(var(--luxury-navy))]">
                        <AlertCircle className="h-7 w-7 mr-3 text-[hsl(var(--luxury-gold))]" />
                        {beforeYouGoSection.title}
                      </h2>
                      {beforeYouGoSection.content?.description && (
                        <p className="text-[hsl(var(--luxury-accent))] leading-relaxed mb-6 text-base">
                          {beforeYouGoSection.content.description}
                        </p>
                      )}
                      <div className="grid md:grid-cols-2 gap-4">
                        {beforeYouGoSection.content.tips.map((tip: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-5 border rounded-lg border-[hsl(var(--luxury-gold))]/20 bg-gradient-to-br from-[hsl(var(--luxury-cream))] to-white hover:shadow-md transition-all">
                            <Lightbulb className="h-5 w-5 text-[hsl(var(--luxury-gold))] mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-[hsl(var(--luxury-accent))]">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Dos and Don'ts Section */}
                  {dosDontsSection && (dosDontsSection.content?.dos || dosDontsSection.content?.donts) && (
                    <Card className="p-6 md:p-8 bg-white border-none shadow-lg">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center text-[hsl(var(--luxury-navy))]">
                        <CheckCircle className="h-7 w-7 mr-3 text-[hsl(var(--luxury-gold))]" />
                        {dosDontsSection.title}
                      </h2>
                      <div className="grid lg:grid-cols-2 gap-6">
                        {dosDontsSection.content?.dos && (
                          <div>
                            <h3 className="text-xl font-semibold mb-4 text-[hsl(var(--luxury-gold))]">Do's</h3>
                            <div className="space-y-3">
                              {dosDontsSection.content.dos.map((item: string, index: number) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-[hsl(var(--luxury-cream))] rounded-lg">
                                  <CheckCircle className="h-5 w-5 text-[hsl(var(--luxury-gold))] mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-[hsl(var(--luxury-accent))]">{item}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {dosDontsSection.content?.donts && (
                          <div>
                            <h3 className="text-xl font-semibold mb-4 text-[hsl(var(--luxury-navy))]">Don'ts</h3>
                            <div className="space-y-3">
                              {dosDontsSection.content.donts.map((item: string, index: number) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-[hsl(var(--luxury-cream))] rounded-lg">
                                  <AlertCircle className="h-5 w-5 text-[hsl(var(--luxury-navy))] mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-[hsl(var(--luxury-accent))]">{item}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </TabsContent>
              )}

              {/* Planning Your Visit Tab (Best Time + Why Visit) */}
              {(bestTimeSection || reasonsSection) && (
                <TabsContent value="planning" className="mt-6 md:mt-8 space-y-6">
                  {/* Best Time to Visit Section */}
                  {bestTimeSection && (
                    <Card className="p-6 md:p-8 bg-white border-none shadow-lg">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center text-[hsl(var(--luxury-navy))]">
                        <Calendar className="h-7 w-7 mr-3 text-[hsl(var(--luxury-gold))]" />
                        {bestTimeSection.title}
                      </h2>
                      {bestTimeSection.content?.subtitle && (
                        <p className="text-xl font-semibold text-[hsl(var(--luxury-gold))] mb-4">
                          {bestTimeSection.content.subtitle}
                        </p>
                      )}
                      <p className="text-[hsl(var(--luxury-accent))] leading-relaxed mb-4 text-base">
                        {bestTimeSection.content?.content || bestTimeSection.content?.description}
                      </p>
                      {bestTimeSection.content?.highlights && bestTimeSection.content.highlights.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-semibold mb-4 text-[hsl(var(--luxury-navy))] text-lg">Seasonal Highlights</h3>
                          <div className="grid md:grid-cols-2 gap-3">
                            {bestTimeSection.content.highlights.map((highlight: string, index: number) => (
                              <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-br from-[hsl(var(--luxury-cream))] to-white rounded-lg border border-[hsl(var(--luxury-gold))]/20 hover:shadow-md transition-all">
                                <Calendar className="h-5 w-5 text-[hsl(var(--luxury-gold))] mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-[hsl(var(--luxury-accent))]">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  )}

                  {/* Reasons to Visit Section */}
                  {reasonsSection && reasonsSection.content?.reasons && (
                    <Card className="p-6 md:p-8 bg-white border-none shadow-lg">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center text-[hsl(var(--luxury-navy))]">
                        <Heart className="h-7 w-7 mr-3 text-[hsl(var(--luxury-gold))]" />
                        {reasonsSection.title}
                      </h2>
                      {reasonsSection.content?.description && (
                        <p className="text-[hsl(var(--luxury-accent))] leading-relaxed mb-6 text-base">
                          {reasonsSection.content.description}
                        </p>
                      )}
                      <div className="grid md:grid-cols-2 gap-4">
                        {reasonsSection.content.reasons.map((reason: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-5 bg-gradient-to-br from-[hsl(var(--luxury-cream))] to-white rounded-lg border border-[hsl(var(--luxury-gold))]/20 hover:shadow-md transition-all">
                            <Heart className="h-5 w-5 text-[hsl(var(--luxury-gold))] mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-[hsl(var(--luxury-accent))]">{reason}</p>
                          </div>
                        ))}
                      </div>
                      {reasonsSection.content?.highlight && (
                        <div className="mt-6 p-5 bg-gradient-to-r from-[hsl(var(--luxury-gold))]/10 to-transparent rounded-lg border-l-4 border-[hsl(var(--luxury-gold))]">
                          <p className="text-base font-medium text-[hsl(var(--luxury-navy))]">{reasonsSection.content.highlight}</p>
                        </div>
                      )}
                    </Card>
                  )}
                </TabsContent>
              )}

              {/* Local Experiences Tab (Food & Shopping + Art & Culture) */}
              {(foodShoppingSection || artCultureSection) && (
                <TabsContent value="experiences" className="mt-6 md:mt-8 space-y-6">
                  {/* Food & Shopping Section */}
                  {foodShoppingSection && (
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                      <Card className="p-6 md:p-8 bg-white border-none shadow-lg hover:shadow-xl transition-all">
                        <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center text-[hsl(var(--luxury-navy))]">
                          <Utensils className="h-6 w-6 mr-3 text-[hsl(var(--luxury-gold))]" />
                          Local Cuisine
                        </h3>
                        <p className="text-[hsl(var(--luxury-accent))] leading-relaxed text-base">
                          {foodShoppingSection.content?.food}
                        </p>
                      </Card>
                      
                      <Card className="p-6 md:p-8 bg-white border-none shadow-lg hover:shadow-xl transition-all">
                        <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center text-[hsl(var(--luxury-navy))]">
                          <ShoppingBag className="h-6 w-6 mr-3 text-[hsl(var(--luxury-gold))]" />
                          Shopping
                        </h3>
                        <p className="text-[hsl(var(--luxury-accent))] leading-relaxed text-base">
                          {foodShoppingSection.content?.shopping}
                        </p>
                      </Card>
                    </div>
                  )}

                  {/* Art & Culture Section */}
                  {artCultureSection && (
                    <Card className="p-6 md:p-8 bg-white border-none shadow-lg">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center text-[hsl(var(--luxury-navy))]">
                        <Palette className="h-7 w-7 mr-3 text-[hsl(var(--luxury-gold))]" />
                        {artCultureSection.title}
                      </h2>
                      {artCultureSection.content?.subtitle && (
                        <p className="text-xl font-semibold text-[hsl(var(--luxury-gold))] mb-4">
                          {artCultureSection.content.subtitle}
                        </p>
                      )}
                      <p className="text-[hsl(var(--luxury-accent))] leading-relaxed text-base">
                        {artCultureSection.content?.content || artCultureSection.content?.description}
                      </p>
                      {artCultureSection.content?.highlight && (
                        <div className="mt-6 p-5 bg-gradient-to-r from-[hsl(var(--luxury-gold))]/10 to-transparent rounded-lg border-l-4 border-[hsl(var(--luxury-gold))]">
                          <p className="text-base font-medium text-[hsl(var(--luxury-navy))]">{artCultureSection.content.highlight}</p>
                        </div>
                      )}
                      {artCultureSection.content?.points && artCultureSection.content.points.length > 0 && (
                        <ul className="mt-6 space-y-3">
                          {artCultureSection.content.points.map((point: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <Palette className="h-5 w-5 text-[hsl(var(--luxury-gold))] mt-0.5 flex-shrink-0" />
                              <span className="text-base text-[hsl(var(--luxury-accent))]">{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Card>
                  )}
                </TabsContent>
              )}

              {/* Discover More Tab (Fun Facts + About) */}
              {(funFactsSection || aboutSection) && (
                <TabsContent value="discover" className="mt-6 md:mt-8 space-y-6">
                  {/* Fun Facts Section */}
                  {funFactsSection && funFactsSection.content?.facts && (
                    <Card className="p-6 md:p-8 bg-white border-none shadow-lg">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center text-[hsl(var(--luxury-navy))]">
                        <Star className="h-7 w-7 mr-3 text-[hsl(var(--luxury-gold))]" />
                        {funFactsSection.title}
                      </h2>
                      {funFactsSection.content?.description && (
                        <p className="text-[hsl(var(--luxury-accent))] leading-relaxed mb-6 text-base">
                          {funFactsSection.content.description}
                        </p>
                      )}
                      <div className="grid md:grid-cols-2 gap-4">
                        {funFactsSection.content.facts.map((fact: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-5 bg-gradient-to-br from-[hsl(var(--luxury-cream))] to-white rounded-lg border border-[hsl(var(--luxury-gold))]/20 hover:shadow-md transition-all">
                            <CheckCircle className="h-5 w-5 text-[hsl(var(--luxury-gold))] mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-[hsl(var(--luxury-accent))]">{fact}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* About Section */}
                  {aboutSection && (
                    <Card className="p-6 md:p-8 bg-white border-none shadow-lg">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center text-[hsl(var(--luxury-navy))]">
                        <Globe className="h-7 w-7 mr-3 text-[hsl(var(--luxury-gold))]" />
                        {aboutSection.title}
                      </h2>
                      {aboutSection.content?.subtitle && (
                        <p className="text-xl font-semibold text-[hsl(var(--luxury-gold))] mb-4">
                          {aboutSection.content.subtitle}
                        </p>
                      )}
                      <p className="text-[hsl(var(--luxury-accent))] leading-relaxed text-base">
                        {aboutSection.content?.description}
                      </p>
                      {aboutSection.content?.highlight && (
                        <div className="mt-6 p-5 bg-gradient-to-r from-[hsl(var(--luxury-gold))]/10 to-transparent rounded-lg border-l-4 border-[hsl(var(--luxury-gold))]">
                          <p className="text-base font-medium text-[hsl(var(--luxury-navy))]">{aboutSection.content.highlight}</p>
                        </div>
                      )}
                      {aboutSection.content?.points && aboutSection.content.points.length > 0 && (
                        <ul className="mt-6 space-y-3">
                          {aboutSection.content.points.map((point: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-[hsl(var(--luxury-gold))] mt-0.5 flex-shrink-0" />
                              <span className="text-base text-[hsl(var(--luxury-accent))]">{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Card>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </section>
        )}

        {/* Attractions Gallery */}
        <CountryAttractionsGallery countryId={countryData.id} countryName={countryData.name} />

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="my-8 md:my-12">
            <Card className="p-6 md:p-10 bg-white border-none shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-[hsl(var(--luxury-navy))]">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.id} value={`item-${index}`} className="border border-[hsl(var(--luxury-gold))]/20 rounded-lg px-6 py-2 bg-gradient-to-r from-[hsl(var(--luxury-cream))] to-white">
                    <AccordionTrigger className="text-left font-semibold text-[hsl(var(--luxury-navy))] hover:text-[hsl(var(--luxury-gold))] transition-colors">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-[hsl(var(--luxury-accent))] leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </section>
        )}

        {/* Contact & Enquiry */}
        <section id="enquiry" className="my-8 md:my-12">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {/* Contact Information */}
            <Card className="p-6 md:p-8 bg-white border-none shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-[hsl(var(--luxury-navy))]">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4 p-4 bg-[hsl(var(--luxury-cream))] rounded-lg">
                  <Phone className="h-6 w-6 text-[hsl(var(--luxury-gold))]" />
                  <span className="text-[hsl(var(--luxury-accent))] font-medium">{countryData.contact_info?.phone || '+1 (555) 123-4567'}</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[hsl(var(--luxury-cream))] rounded-lg">
                  <Mail className="h-6 w-6 text-[hsl(var(--luxury-gold))]" />
                  <span className="text-[hsl(var(--luxury-accent))] font-medium">{countryData.contact_info?.email || 'hello@nymphettetours.com'}</span>
                </div>
                {countryData.contact_info?.address && (
                  <div className="flex items-start gap-4 p-4 bg-[hsl(var(--luxury-cream))] rounded-lg">
                    <MapPin className="h-6 w-6 text-[hsl(var(--luxury-gold))] mt-1" />
                    <span className="text-[hsl(var(--luxury-accent))] font-medium">{countryData.contact_info.address}</span>
                  </div>
                )}
              </div>
              
              {/* Travel Tips */}
              {countryData.travel_tips && (
                <div className="mt-8 pt-6 border-t border-[hsl(var(--luxury-gold))]/20">
                  <h4 className="font-semibold mb-3 text-[hsl(var(--luxury-navy))] text-lg">Quick Travel Tips</h4>
                  <p className="text-base text-[hsl(var(--luxury-accent))] leading-relaxed">{countryData.travel_tips}</p>
                </div>
              )}
            </Card>

            {/* Enquiry Form */}
            <Card className="p-6 md:p-8 bg-white border-none shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-[hsl(var(--luxury-navy))]">Plan Your {countryData.name} Trip</h3>
              <form onSubmit={handleEnquirySubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-[hsl(var(--luxury-navy))] font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      className="border-[hsl(var(--luxury-gold))]/30 focus:border-[hsl(var(--luxury-gold))] focus:ring-[hsl(var(--luxury-gold))]"
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[hsl(var(--luxury-navy))] font-medium">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      className="border-[hsl(var(--luxury-gold))]/30 focus:border-[hsl(var(--luxury-gold))] focus:ring-[hsl(var(--luxury-gold))]"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-[hsl(var(--luxury-navy))] font-medium">Phone *</Label>
                    <Input
                      id="phone"
                      className="border-[hsl(var(--luxury-gold))]/30 focus:border-[hsl(var(--luxury-gold))] focus:ring-[hsl(var(--luxury-gold))]"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="travelers" className="text-[hsl(var(--luxury-navy))] font-medium">Number of Travelers</Label>
                    <Input
                      id="travelers"
                      type="number"
                      min="1"
                      className="border-[hsl(var(--luxury-gold))]/30 focus:border-[hsl(var(--luxury-gold))] focus:ring-[hsl(var(--luxury-gold))]"
                      value={enquiryForm.travelers}
                      onChange={(e) => setEnquiryForm(prev => ({ ...prev, travelers: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="travel_date" className="text-[hsl(var(--luxury-navy))] font-medium">Preferred Travel Date</Label>
                  <Input
                    id="travel_date"
                    type="date"
                    className="border-[hsl(var(--luxury-gold))]/30 focus:border-[hsl(var(--luxury-gold))] focus:ring-[hsl(var(--luxury-gold))]"
                    value={enquiryForm.travel_date}
                    onChange={(e) => setEnquiryForm(prev => ({ ...prev, travel_date: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-[hsl(var(--luxury-navy))] font-medium">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your travel preferences, special requirements, or any questions..."
                    className="border-[hsl(var(--luxury-gold))]/30 focus:border-[hsl(var(--luxury-gold))] focus:ring-[hsl(var(--luxury-gold))] min-h-[120px]"
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>
                
                <Button type="submit" className="w-full bg-[hsl(var(--luxury-gold))] hover:bg-[hsl(var(--luxury-gold-light))] text-[hsl(var(--luxury-navy))] font-semibold text-base py-6 shadow-lg">
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