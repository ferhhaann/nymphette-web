import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOptimizedPackages } from "@/hooks/useOptimizedPackages";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import { TravelPackage } from "@/data/packagesData";
import { supabase } from '@/integrations/supabase/client';
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
  CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, CheckCircle2, CircleDollarSign, MapPinned, ShieldCheck, Star, Utensils, Users, Home, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { InquiryBookingForm } from "./InquiryBookingForm";
import ChatbotWidget from "./ChatbotWidget";
import MapWidget from "./MapWidget";
import { CountryList } from "./CountryList";
import { OptimizedImage } from "@/components/ui/optimized-image";

export interface RegionLandingProps {
  region: string;
}

const setMeta = (title: string, description: string, canonicalPath: string) => {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
  meta.setAttribute("content", description);
  let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!link) { link = document.createElement("link"); link.setAttribute("rel", "canonical"); document.head.appendChild(link); }
  const url = new URL(canonicalPath, window.location.origin).toString();
  link.setAttribute("href", url);
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
  const [budgetMax, setBudgetMax] = useState<number>(100000);
  const [openFormFor, setOpenFormFor] = useState<any | null>(null);
  const [stickyOpen, setStickyOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  
  // Use optimized packages hook for better performance
  const { data: packages, loading } = useOptimizedPackages(region);
  
  // Mobile optimization settings
  const { isMobile, optimizedSettings } = useMobileOptimization();
  
  // Get region-specific images from public folder for production compatibility
  const getRegionImages = (regionName: string) => {
    const normalizedRegion = regionName.toLowerCase();
    
    if (normalizedRegion === 'asia') {
      return [
        '/regions/asia-1.jpg',
        '/regions/asia-2.jpg', 
        '/regions/asia-3.jpg'
      ];
    }
    if (normalizedRegion === 'europe') {
      return [
        '/regions/europe-1.jpg',
        '/regions/europe-2.jpg',
        '/regions/europe-3.jpg'
      ];
    }
    if (normalizedRegion === 'africa') {
      return [
        '/regions/africa-1.jpg',
        '/regions/africa-2.jpg',
        '/regions/africa-3.jpg'
      ];
    }
    if (normalizedRegion === 'americas') {
      return [
        '/regions/americas-1.jpg',
        '/regions/americas-2.jpg',
        '/regions/americas-3.jpg'
      ];
    }
    if (normalizedRegion === 'pacific islands') {
      return [
        '/regions/pacific-1.jpg',
        '/regions/pacific-2.jpg',
        '/regions/pacific-3.jpg'
      ];
    }
    if (normalizedRegion === 'middle east') {
      return [
        '/regions/middle-east-1.jpg',
        '/regions/middle-east-2.jpg',
        '/regions/middle-east-3.jpg'
      ];
    }
    
    // Fallback to Asia images
    return [
      '/regions/asia-1.jpg',
      '/regions/asia-2.jpg',
      '/regions/asia-3.jpg'
    ];
  };

  // Derive values from the region prop
  const regionKey = region.toLowerCase().replace(/\s+/g, '-');
  const title = `Discover ${region}`;
  const description = `Explore amazing destinations and travel packages in ${region}`;
  const canonical = `/regions/${regionKey}`;
  const heroImages = getRegionImages(region);

  // Check if we're coming from packages page
  const isFromPackagesPage = window.location.pathname.includes('/packages/region/');

  // Remove the manual loading logic since we're using optimized hooks
  // The useOptimizedPackages hook handles all the loading, caching, and optimization

  // Automatic slideshow effect
  useEffect(() => {
    if (!carouselApi) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [carouselApi]);

  useEffect(() => { 
    // TODO: Implement meta tag setting if needed
    // const actualCanonical = isFromPackagesPage ? `/packages/region/${regionKey}` : canonical;
    // setMeta(title, description, actualCanonical); 
  }, [title, description, canonical, regionKey, isFromPackagesPage]);

  const filtered = useMemo(() => {
    if (!packages) return [];
    const q = query.trim().toLowerCase();
    return packages.filter(p => {
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.highlights.some(h => h.toLowerCase().includes(q));
      return matchesQuery;
    });
  }, [packages, query]);

  // JSON-LD basic
  useEffect(() => {
    const ld = {
      '@context': 'https://schema.org', '@type': 'ItemList',
      itemListElement: filtered.slice(0, 10).map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title }))
    } as const;
    const el = document.createElement('script'); el.type = 'application/ld+json'; el.text = JSON.stringify(ld);
    document.head.appendChild(el); return () => { document.head.removeChild(el); };
  }, [filtered]);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mt-2 md:mt-5" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors flex items-center h-6">
            <Home className="h-4 w-4 mr-1" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <Link to="/packages" className="hover:text-primary transition-colors flex items-center h-6">
            <span>Packages</span>
          </Link>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <span className="text-foreground font-medium flex items-center h-6">{region}</span>
        </nav>
      </div>
      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-64 sm:h-[50vh] md:h-[60vh] lg:h-[68vh] mb-2 sm:mb-4 lg:mb-6 mt-2 rounded-lg overflow-hidden">
          {/* Background Image Carousel */}
          <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="absolute inset-0 h-full w-full">
            <CarouselContent className="h-full">
              {heroImages.map((img, idx) => (
                <CarouselItem key={idx} className="h-full">
                  <div className="relative h-full w-full">
                    <OptimizedImage 
                      src={img} 
                      alt={`${title} hero ${idx+1}`} 
                      priority={idx===0} 
                      preloadSources={heroImages.slice(idx + 1, idx + 3)}
                      className="h-full w-full object-cover rounded-lg" 
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Static Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent rounded-lg z-10" />
          <div className="relative z-20 h-full flex items-end px-3 sm:px-6 lg:px-8 pb-16 sm:pb-8">
            <div className="space-y-2 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-primary">{title}</h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">{description}</p>
              {/* Search/Filter - Hidden on mobile, shown on larger screens as overlay */}
              <div className="hidden sm:grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3 bg-card/90 backdrop-blur rounded-lg p-3 sm:p-4 shadow">
                <div className="col-span-1 sm:col-span-3 mb-2 sm:mb-0"><Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search city, country or highlight" aria-label="Search" className="text-sm sm:text-base"/></div>
                <div className="col-span-1 sm:col-span-1 bg-card rounded-lg p-2 border mb-2 sm:mb-0">
                  <div className="flex items-center justify-between text-xs mb-1"><span className="text-muted-foreground flex items-center gap-1"><CircleDollarSign className="size-3"/>Budget</span><span>₹{budgetMax}</span></div>
                  <Slider max={200000} min={0} step={5000} value={[budgetMax]} onValueChange={(v)=>setBudgetMax(v[0])} />
                </div>
                <Button className="col-span-1 sm:col-span-1 text-sm sm:text-base" onClick={()=>setStickyOpen(true)}>Find Packages</Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search/Filter - Shown below image on mobile only */}
        <div className="sm:hidden px-4">
          <div className="grid grid-cols-1 gap-3 bg-card/90 backdrop-blur rounded-lg p-4 shadow">
            <div><Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search city, country or highlight" aria-label="Search" className="text-sm"/></div>
            <div className="bg-card rounded-lg p-3 border">
              <div className="flex items-center justify-between text-xs mb-2"><span className="text-muted-foreground flex items-center gap-1"><CircleDollarSign className="size-3"/>Budget</span><span>₹{budgetMax}</span></div>
              <Slider max={200000} min={0} step={5000} value={[budgetMax]} onValueChange={(v)=>setBudgetMax(v[0])} />
            </div>
            <Button className="text-sm" onClick={()=>setStickyOpen(true)}>Find Packages</Button>
          </div>
        </div>
      </section>

      <CountryList region={region} onCountrySelect={(slug) => navigate(`/regions/${regionKey}/country/${slug}`)} />

      {/* PACKAGES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">All-inclusive packages</h2>
          <Badge variant="secondary" className="gap-1"><ShieldCheck className="size-4"/> No hidden charges</Badge>
        </header>

        <div className={`grid ${optimizedSettings.gridCols} lg:grid-cols-3 ${optimizedSettings.gap} mb-8`}>
          {loading ? (
            // Loading skeleton with mobile optimization
            Array.from({ length: optimizedSettings.skeletonCount }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className={`bg-muted ${optimizedSettings.cardHeight}`}></div>
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))
          ) : (
          filtered.map((pkg, index)=>{
            const price = toUSD(pkg);
            const packageImage = pkg.image || getPackageImage(pkg.countrySlug, pkg.title);
            
            return (
              <Card key={pkg.id} className="group overflow-hidden animate-fade-in cursor-pointer hover:shadow-card-soft transition-all duration-300" 
                    style={{animationDelay:`${index*60}ms`}}
                     onClick={() => navigate(`/package/${pkg.id}`)}>
                 <div className={`relative overflow-hidden rounded-lg ${optimizedSettings.cardHeight}`}>
                   <OptimizedImage 
                     src={packageImage} 
                     alt={pkg.title} 
                     priority={index < optimizedSettings.priorityImageCount} 
                     preloadSources={optimizedSettings.shouldPreload ? filtered.slice(index + 1, index + optimizedSettings.preloadCount).map(p => p.image || getPackageImage(p.countrySlug, p.title)) : []}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                     fallback="/placeholder.svg"
                   />
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className="bg-background/90 backdrop-blur text-xs">{pkg.category}</Badge>
                  </div>
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur rounded-full px-2 py-1">
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
                      <span>{pkg.groupSize || 'Flexible group size'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-primary">
                        {typeof pkg.price === 'string' ? 
                          pkg.price.replace(/\$/g, '₹') : 
                          `₹${pkg.price}`}
                      </div>
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
           }))
         }
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur border-t md:hidden z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium">Live pricing in INR</div>
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
  );
};

export default RegionLanding;
