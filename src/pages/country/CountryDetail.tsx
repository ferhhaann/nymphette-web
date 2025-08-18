import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client'
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, Globe, Currency, Thermometer, CreditCard } from "lucide-react";

interface Country {
  id: string
  name: string
  slug: string
  region: string
  capital?: string
  currency?: string
  climate?: string
  best_season?: string
  culture?: string
  speciality?: string
  languages?: string[]
  annual_visitors?: number
  gender_male_percentage?: number
  gender_female_percentage?: number
}

interface FamousPlace {
  id: string
  name: string
  description?: string
  image_url?: string
  type: string
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

const CountryDetail = () => {
  const { region, country } = useParams<{ region: string; country: string }>();
  const navigate = useNavigate();
  const [countryData, setCountryData] = useState<Country | null>(null);
  const [famousPlaces, setFamousPlaces] = useState<FamousPlace[]>([]);
  const [essentialTips, setEssentialTips] = useState<EssentialTip[]>([]);
  const [travelPurposes, setTravelPurposes] = useState<TravelPurpose[]>([]);
  const [faqs, setFaqs] = useState<CountryFAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (country) {
      loadCountryData();
    }
  }, [country]);

  const loadCountryData = async () => {
    try {
      setLoading(true);
      
      // Load country basic info
      const { data: countryInfo, error: countryError } = await supabase
        .from('countries')
        .select('*')
        .eq('slug', country)
        .single();

      if (countryError) throw countryError;
      setCountryData(countryInfo);

      // Load related data
      const [placesResult, tipsResult, purposesResult, faqsResult] = await Promise.all([
        supabase.from('famous_places').select('*').eq('country_id', countryInfo.id),
        supabase.from('essential_tips').select('*').eq('country_id', countryInfo.id),
        supabase.from('travel_purposes').select('*').eq('country_id', countryInfo.id),
        supabase.from('country_faqs').select('*').eq('country_id', countryInfo.id)
      ]);

      setFamousPlaces(placesResult.data || []);
      setEssentialTips(tipsResult.data || []);
      setTravelPurposes(purposesResult.data || []);
      setFaqs(faqsResult.data || []);

    } catch (error) {
      console.error('Error loading country data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!countryData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Country not found</h1>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Back to {region}
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-4xl font-bold">{countryData.name}</h1>
            <Badge variant="secondary">{countryData.region}</Badge>
          </div>
        </div>

        {/* Country Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {countryData.capital && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Capital
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">{countryData.capital}</p>
              </CardContent>
            </Card>
          )}
          
          {countryData.currency && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Currency className="h-4 w-4" />
                  Currency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">{countryData.currency}</p>
              </CardContent>
            </Card>
          )}
          
          {countryData.climate && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Thermometer className="h-4 w-4" />
                  Climate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">{countryData.climate}</p>
              </CardContent>
            </Card>
          )}
          
          {countryData.best_season && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Best Season
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">{countryData.best_season}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Famous Places */}
        {famousPlaces.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Famous Places</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {famousPlaces.map((place) => (
                <Card key={place.id}>
                  <CardHeader>
                    <CardTitle>{place.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {place.description && (
                      <p className="text-muted-foreground">{place.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Essential Tips */}
        {essentialTips.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Essential Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {essentialTips.map((tip) => (
                <Card key={tip.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>{tip.icon}</span>
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{tip.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CountryDetail;