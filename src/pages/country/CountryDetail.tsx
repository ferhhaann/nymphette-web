import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, DollarSign, Thermometer, Calendar, HelpCircle, BookOpen, Globe, Camera, Utensils, ShoppingBag, Users, Palette } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CountryBreadcrumb } from '@/components/regions/CountryBreadcrumb'
import { CountryHero } from '@/components/regions/CountryHero'
import { CountryQuickInfo } from '@/components/regions/CountryQuickInfo'
import { CountryEssentialTips } from '@/components/regions/CountryEssentialTips'
import { CountryStats } from '@/components/regions/CountryStats'
import { CountryContentSection } from '@/components/regions/CountryContentSection'
import { InquiryBookingForm } from '@/components/regions/InquiryBookingForm'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

interface ContentSection {
  id: string
  section_type: string
  title?: string
  content: any
  order_index: number
}

interface CountryAttraction {
  id: string
  name: string
  description?: string
  category: string
  image_url?: string
}

interface CountryCity {
  id: string
  name: string
  description?: string
  highlights?: string[]
  image_url?: string
  is_capital: boolean
}

const CountryDetail = () => {
  const { country } = useParams<{ country: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [countryData, setCountryData] = useState<Country | null>(null)
  const [famousPlaces, setFamousPlaces] = useState<FamousPlace[]>([])
  const [essentialTips, setEssentialTips] = useState<EssentialTip[]>([])
  const [travelPurposes, setTravelPurposes] = useState<TravelPurpose[]>([])
  const [faqs, setFaqs] = useState<CountryFAQ[]>([])
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [attractions, setAttractions] = useState<CountryAttraction[]>([])
  const [cities, setCities] = useState<CountryCity[]>([])
  const [packageCount, setPackageCount] = useState(0)

  useEffect(() => {
    if (country) {
      loadCountryData(country)
    }
  }, [country])

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
        // Load package count
        const { count } = await supabase
          .from('packages')
          .select('*', { count: 'exact', head: true })
          .eq('country_slug', countrySlug)
        
        setPackageCount(count || 0)

        // Load all related data in parallel
        const [placesResult, tipsResult, purposesResult, faqResult, contentResult, attractionsResult, citiesResult] = await Promise.all([
          supabase.from('famous_places').select('*').eq('country_id', countryInfo.id).order('name'),
          supabase.from('essential_tips').select('*').eq('country_id', countryInfo.id).order('title'),
          supabase.from('travel_purposes').select('*').eq('country_id', countryInfo.id).order('percentage', { ascending: false }),
          supabase.from('country_faqs').select('*').eq('country_id', countryInfo.id),
          supabase.from('country_content').select('*').eq('country_id', countryInfo.id).order('order_index'),
          supabase.from('country_attractions').select('*').eq('country_id', countryInfo.id).order('order_index'),
          supabase.from('country_cities').select('*').eq('country_id', countryInfo.id).order('order_index')
        ])

        setFamousPlaces(placesResult.data || [])
        setEssentialTips(tipsResult.data || [])
        setTravelPurposes(purposesResult.data || [])
        setFaqs(faqResult.data || [])
        setContentSections(contentResult.data || [])
        setAttractions(attractionsResult.data || [])
        setCities(citiesResult.data || [])
      }
    } catch (error) {
      console.error('Error loading country data:', error)
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {countryData ? (
          <div className="space-y-8">
            {/* Breadcrumb */}
            <CountryBreadcrumb 
              region={countryData.region} 
              countryName={countryData.name} 
            />

            {/* Hero Section */}
            <CountryHero
              countryName={countryData.name}
              capital={countryData.capital}
              packageCount={packageCount}
            />

            {/* Quick Information Panel */}
            <CountryQuickInfo
              currency={countryData.currency}
              climate={countryData.climate}
              bestSeason={countryData.best_season}
              languages={countryData.languages}
            />

            {/* Essential Travel Tips */}
            <CountryEssentialTips />

            {/* Visitor Statistics */}
            <CountryStats
              annualVisitors={countryData.annual_visitors}
              genderMalePercentage={countryData.gender_male_percentage}
              genderFemalePercentage={countryData.gender_female_percentage}
              travelPurposes={travelPurposes}
            />

            {/* Content Sections */}
            <CountryContentSection
              sections={contentSections}
              sectionType="introduction"
              title="About the Destination"
              icon={<BookOpen className="h-5 w-5" />}
            />

            {/* Famous Places */}
            {famousPlaces.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Famous Places
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {famousPlaces.map((place) => (
                      <div key={place.id} className="space-y-3">
                        {place.image_url && (
                          <img 
                            src={place.image_url} 
                            alt={place.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        )}
                        <h3 className="font-semibold">{place.name}</h3>
                        {place.description && (
                          <p className="text-sm text-muted-foreground">{place.description}</p>
                        )}
                        {place.type && (
                          <Badge variant="outline">{place.type}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={faq.id} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {/* Contact & Enquiry Form */}
            <InquiryBookingForm />
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Country not found
            </h2>
            <p className="text-muted-foreground">
              The country you're looking for doesn't exist or has been removed.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default CountryDetail