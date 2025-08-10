import React, { useEffect, useMemo, useRef, useState } from "react";
import { TravelPackage } from "@/data/packagesData";
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
import { Calendar, CheckCircle2, CircleDollarSign, MapPinned, ShieldCheck, Utensils, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import InquiryBookingForm from "./InquiryBookingForm";
import ChatbotWidget from "./ChatbotWidget";
import MapWidget from "./MapWidget";
import CountryList from "./CountryList";

export interface RegionLandingProps {
  regionKey: string;
  title: string;
  description: string;
  canonical: string;
  data: TravelPackage[];
  heroImages: string[];
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

const RegionLanding: React.FC<RegionLandingProps> = ({ regionKey, title, description, canonical, data, heroImages }) => {
  const [query, setQuery] = useState("");
  const [budgetMax, setBudgetMax] = useState<number>(6000);
  const [openFormFor, setOpenFormFor] = useState<TravelPackage | null>(null);
  const [stickyOpen, setStickyOpen] = useState(false);

  useEffect(() => { setMeta(title, description, canonical); }, [title, description, canonical]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter(p => {
      const price = toUSD(p) || 0;
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.highlights.some(h => h.toLowerCase().includes(q));
      return matchesQuery && (price === 0 || price <= budgetMax);
    });
  }, [data, query, budgetMax]);

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
      {/* HERO */}
      <section className="relative">
        <Carousel>
          <CarouselContent>
            {heroImages.map((img, idx) => (
              <CarouselItem key={idx}>
                <div className="relative h-[50vh] sm:h-[60vh] lg:h-[68vh]">
                  <img src={img} alt={`${title} hero ${idx+1}`} loading={idx===0?"eager":"lazy"} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  <div className="relative z-10 max-w-7xl mx-auto h-full flex items-end px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="space-y-3 sm:space-y-4">
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">{title}</h1>
                      <p className="text-muted-foreground max-w-2xl">{description}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 bg-card/90 backdrop-blur rounded-lg p-2 sm:p-3 shadow">
                        <div className="col-span-2 sm:col-span-3"><Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search city, country or highlight" aria-label="Search"/></div>
                        <div className="col-span-2 sm:col-span-1 bg-card rounded-lg p-2 border">
                          <div className="flex items-center justify-between text-xs mb-1"><span className="text-muted-foreground flex items-center gap-1"><CircleDollarSign className="size-3"/>Budget</span><span>${budgetMax}</span></div>
                          <Slider max={8000} min={500} step={100} value={[budgetMax]} onValueChange={(v)=>setBudgetMax(v[0])} />
                        </div>
                        <Button className="col-span-2 sm:col-span-1" onClick={()=>setStickyOpen(true)}>Find Packages</Button>
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

      <CountryList regionKey={regionKey} data={data} />

      {/* PACKAGES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">All-inclusive packages</h2>
          <Badge variant="secondary" className="gap-1"><ShieldCheck className="size-4"/> No hidden charges</Badge>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg, index)=>{
            const price = toUSD(pkg);
            const allInc = [
              includesTag(pkg.inclusions, 'hotel') || includesTag(pkg.inclusions, 'stay'),
              includesTag(pkg.inclusions, 'transfer') || includesTag(pkg.inclusions, 'airport'),
              includesTag(pkg.inclusions, 'sight') || includesTag(pkg.inclusions, 'tour'),
              includesTag(pkg.inclusions, 'activity') || includesTag(pkg.inclusions, 'game drive')
            ];
            return (
              <Card key={pkg.id} className="overflow-hidden animate-fade-in" style={{animationDelay:`${index*60}ms`}}>
                <div className="relative h-48 overflow-hidden">
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover"/>
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    <Badge variant="outline">{pkg.category}</Badge>
                    <Badge variant="secondary" className="gap-1"><CheckCircle2 className="size-4"/> All-inclusive</Badge>
                    <Badge variant="secondary">Guides & Drivers included</Badge>
                    <Badge variant="secondary"><Utensils className="size-4 mr-1"/> Indian meals on request</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{pkg.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{pkg.country} • {pkg.duration}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {pkg.highlights.slice(0,3).map((h,i)=>(<Badge key={i} variant="outline">{h}</Badge>))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{price?`$${price}`: 'Price on request'}</div>
                      <p className="text-xs text-muted-foreground">per person • Transparent pricing</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Best time: {pkg.bestTime}</p>
                      <p className="text-sm text-muted-foreground">Group: {pkg.groupSize}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="itinerary">
                      <AccordionTrigger className="text-sm">Interactive itinerary preview</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {pkg.itinerary.slice(0,3).map((d,i)=> (
                            <li key={i} className="flex gap-3 items-start">
                              <div className="w-16 h-16 bg-accent/10 rounded grid place-items-center text-sm">Day {d.day}</div>
                              <div>
                                <p className="text-sm font-medium">{d.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2">{d.description}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3">
                          <MapWidget regionKey={regionKey} compact />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="flex w-full gap-2">
                    <Button variant="outline" className="flex-1" onClick={()=>setOpenFormFor(pkg)}>Customize</Button>
                    <Button className="flex-1" onClick={()=>setOpenFormFor(pkg)}>Book / Enquire</Button>
                  </div>
                </CardFooter>
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
          <InquiryBookingForm pkg={openFormFor || null} regionKey={regionKey} />
        </DialogContent>
      </Dialog>

      <ChatbotWidget regionKey={regionKey} />
    </div>
  );
};

export default RegionLanding;
