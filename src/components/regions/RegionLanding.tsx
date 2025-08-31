import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { TravelPackage } from "@/data/packagesData";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, CheckCircle2, CircleDollarSign, MapPinned, ShieldCheck, Star, Utensils, Users, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { InquiryBookingForm } from "./InquiryBookingForm";
import ChatbotWidget from "./ChatbotWidget";
import MapWidget from "./MapWidget";
import { CountryList } from "./CountryList";
import { RegionBreadcrumb } from "./RegionBreadcrumb";

export interface RegionLandingProps {
  region: string;
}

// Utility function to update meta tags (not using hooks)
const updateMetaTags = (title: string, description: string, canonicalPath: string) => {
  if (typeof window === 'undefined') return;
  
  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) { 
    meta = document.createElement("meta"); 
    meta.name = "description"; 
    document.head.appendChild(meta); 
  }
  meta.content = description;
  
  let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!link) { 
    link = document.createElement("link"); 
    link.setAttribute("rel", "canonical"); 
    document.head.appendChild(link); 
  }
  const url = new URL(canonicalPath, window.location.origin).toString();
  link.href = url;
};

const toUSD = (pkg: TravelPackage): number => {
  // Prefer explicit USD in price string
  if (pkg as any && typeof (pkg as any).priceUSD === 'number') return (pkg as any).priceUSD as number;
  const p = pkg.price || "";
  if (p.startsWith("$")) {
    const n = parseFloat(p.replace(/[$,]/g, ""));
    return isNaN(n) ? 0 : n;
  }
  if (p.includes("₹")) {
    const n = parseFloat(p.replace(/[^0-9.]/g, ""));
    const rate = 83; // indicative
    return Math.round((n / rate) * 1) // per person
  }
  return 0;
};

const includesTag = (arr: string[], key: string) => arr.some(i => i.toLowerCase().includes(key));

// Get individual images for each package based on country (WebP optimized)
const getPackageImage = (countrySlug?: string, title?: string) => {
  if (countrySlug === "thailand") return "/places/thailand/bangkok.webp";
  if (countrySlug === "japan") return "/places/japan/tokyo.webp";
  if (countrySlug === "indonesia") return "/places/indonesia/bali.webp";
  if (countrySlug === "china") return "/places/china/beijing.webp";
  if (countrySlug === "kazakhstan") return "/places/kazakhstan/almaty.webp";
  if (countrySlug === "malaysia") return "/places/malaysia/kuala-lumpur.jpg";
  if (countrySlug === "philippines") return "/places/philippines/manila.jpg";
  if (countrySlug === "south-korea") return "/places/south-korea/seoul.jpg";
  if (countrySlug === "vietnam") return "/places/vietnam/ho-chi-minh.jpg";
  if (countrySlug === "maldives") return "/places/maldives/male-city.jpg";
  if (countrySlug === "uae") return "/places/uae/dubai-marina.jpg";
  if (countrySlug === "usa") return "/places/usa/times-square.jpg";
  if (countrySlug === "kenya") return "/places/kenya/masai-mara.jpg";
  
  // Fallback based on title keywords
  if (title?.toLowerCase().includes("maldives")) return "/places/maldives/overwater-villas.jpg";
  if (title?.toLowerCase().includes("dubai")) return "/places/uae/burj-khalifa.jpg";
  if (title?.toLowerCase().includes("japan")) return "/places/japan/mount-fuji.webp";
  
  return "/places/thailand/bangkok.webp"; // Default fallback
};

const RegionLanding: React.FC<RegionLandingProps> = ({ region }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [budgetMax, setBudgetMax] = useState<number>(6000);
  const [openFormFor, setOpenFormFor] = useState<TravelPackage | null>(null);
  const [stickyOpen, setStickyOpen] = useState(false);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Derive values from the region prop
  const regionKey = region.toLowerCase().replace(/\s+/g, '-');
  const title = `Discover ${region}`;
  const description = `Explore amazing destinations and travel packages in ${region}`;
  const canonical = `/regions/${regionKey}`;
  const heroImages = ["/places/thailand/bangkok.webp"]; // TODO: Load region-specific images

  // Check if we're coming from packages page (guard for SSR)
  const isFromPackagesPage = typeof window !== 'undefined' ? window.location.pathname.includes('/packages/region/') : false;

  // Load packages from database
  useEffect(() => {
    loadRegionPackages();
  }, [region]);

  const loadRegionPackages = async () => {
    try {
      setLoading(true);
      console.log('Loading packages for region:', region); // Debug log
      
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('region', region as any)
        .order('rating', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Received packages:', data); // Debug log
      
      // Transform database packages to TravelPackage format
      const transformedPackages: TravelPackage[] = (data || []).map((pkg: any) => ({
        id: pkg.id,
        title: pkg.title,
        country: pkg.country,
        countrySlug: pkg.country_slug,
        region: pkg.region,
        duration: pkg.duration,
        price: pkg.price,
        originalPrice: pkg.original_price,
        rating: pkg.rating,
        reviews: pkg.reviews,
        image: pkg.image || getPackageImage(pkg.country_slug, pkg.title),
        highlights: pkg.highlights || [],
        inclusions: pkg.inclusions || [],
        exclusions: pkg.exclusions || [],
        category: pkg.category,
        bestTime: pkg.best_time,
        groupSize: pkg.group_size,
        featured: pkg.featured,
        itinerary: (Array.isArray(pkg.itinerary) ? pkg.itinerary : []) as any,
        overview: pkg.overview_section_title ? {
          sectionTitle: pkg.overview_section_title,
          description: pkg.overview_description || '',
          highlightsLabel: pkg.overview_highlights_label || 'Package Highlights',
          highlightsBadgeVariant: pkg.overview_badge_variant || 'outline',
          highlightsBadgeStyle: pkg.overview_badge_style || 'border-primary text-primary'
        } : undefined
      }));
      
      setPackages(transformedPackages);
    } catch (error) {
      console.error('Error loading region packages:', error);
      setError(error instanceof Error ? error.message : 'Failed to load packages');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    // Update meta tags on client-side only
    const actualCanonical = isFromPackagesPage ? `/packages/region/${regionKey}` : canonical;
    updateMetaTags(title, description, actualCanonical);
  }, [title, description, canonical, regionKey, isFromPackagesPage]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return packages.filter(p => {
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.highlights.some(h => h.toLowerCase().includes(q));
      return matchesQuery;
    });
  }, [packages, query]);

  // JSON-LD basic
  useEffect(() => {
    if (typeof document === 'undefined') return
    const ld = {
      '@context': 'https://schema.org', '@type': 'ItemList',
      itemListElement: filtered.slice(0, 10).map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title }))
    } as const;
    if (typeof window === 'undefined') return;
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.text = JSON.stringify(ld);
    document.head.appendChild(el);
    return () => {
      if (document.head.contains(el)) {
        document.head.removeChild(el);
      }
    };
  }, [filtered]);

  // Add error state
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h2 className="text-xl font-semibold text-red-500">Error loading packages</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RegionBreadcrumb region={region} isFromPackagesPage={isFromPackagesPage} />
        </div>

      {loading && (
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Back Button - Only show when coming from packages page */}
      {/* Back button removed; breadcrumb provides navigation */}
      
      {/* HERO */}
      <section className={`relative ${isFromPackagesPage ? 'mt-0' : 'mt-4 sm:mt-6 lg:mt-8'}`}>
        <Carousel>
          <CarouselContent>
            {heroImages.map((img, idx) => (
              <CarouselItem key={idx}>
                <div className="relative h-[50vh] sm:h-[60vh] lg:h-[68vh] m-2 sm:m-4 lg:m-6 rounded-lg overflow-hidden">
                  <img src={img} alt={`${title} hero ${idx+1}`} loading={idx===0?"eager":"lazy"} className="absolute inset-0 h-full w-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent rounded-lg" />
                  <div className="relative z-10 max-w-7xl mx-auto h-full flex items-end px-3 sm:px-6 lg:px-8 pb-4 sm:pb-8">
                    <div className="space-y-2 sm:space-y-4">
                      <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-primary">{title}</h1>
                      <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">{description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3 bg-card/90 backdrop-blur rounded-lg p-3 sm:p-4 shadow">
                        <div className="col-span-1 sm:col-span-3 mb-2 sm:mb-0"><Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search city, country or highlight" aria-label="Search" className="text-sm sm:text-base"/></div>
                        <div className="col-span-1 sm:col-span-1 bg-card rounded-lg p-2 border mb-2 sm:mb-0">
                          <div className="flex items-center justify-between text-xs mb-1"><span className="text-muted-foreground flex items-center gap-1"><CircleDollarSign className="size-3"/>Budget</span><span>${budgetMax}</span></div>
                          <Slider max={8000} min={500} step={100} value={[budgetMax]} onValueChange={(v)=>setBudgetMax(v[0])} />
                        </div>
                        <Button className="col-span-1 sm:col-span-1 text-sm sm:text-base" onClick={()=>setStickyOpen(true)}>Find Packages</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <CountryList region={regionKey} onCountrySelect={(slug) => navigate(`/regions/${regionKey}/country/${slug}`)} />

      {/* PACKAGES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">All-inclusive packages</h2>
          <Badge variant="secondary" className="gap-1"><ShieldCheck className="size-4"/> No hidden charges</Badge>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg, index)=>{
            const price = toUSD(pkg);
            const packageImage = pkg.image || getPackageImage(pkg.countrySlug, pkg.title);
            return (
              <Card key={pkg.id} className="group overflow-hidden animate-fade-in cursor-pointer hover:shadow-card-soft transition-all duration-300" 
                    style={{animationDelay:`${index*60}ms`}}
                    onClick={() => navigate(`/package/${pkg.id}`)}>
                <div className="relative h-48 overflow-hidden">
                  <img src={packageImage} alt={pkg.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="bg-background/90 backdrop-blur">{pkg.category}</Badge>
                  </div>
                  <div className="absolute top-3 right-3 bg-background/90 backdrop-blur rounded-full px-2 py-1">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{pkg.rating}</span>
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{pkg.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPinned className="h-3 w-3 mr-1" />
                    <span>{pkg.country}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{pkg.groupSize}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-primary">{price ? `$${price}` : pkg.price}</div>
                      <p className="text-xs text-muted-foreground">per person</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/package/${pkg.id}`);
                    }}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur border-t md:hidden z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium">Live pricing in USD</div>
            <div className="text-muted-foreground">No hidden charges • Free customization</div>
          </div>
          <Button onClick={()=>setStickyOpen(true)}>Check Availability</Button>
        </div>
      </div>

      {/* Booking / Inquiry Dialog */}
      <Dialog open={!!openFormFor || stickyOpen} onOpenChange={(o)=>{ if(!o){ setOpenFormFor(null); setStickyOpen(false);} }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request a quote / Book instantly</DialogTitle>
          </DialogHeader>
          <InquiryBookingForm />
        </DialogContent>
      </Dialog>

      <ChatbotWidget regionKey={regionKey} />
      
      <Footer />
      </div>
    </div>
  );
};

export default RegionLanding;
