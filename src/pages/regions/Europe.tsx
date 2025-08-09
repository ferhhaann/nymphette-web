import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PackageCard from "@/components/PackageCard";
import regionsImage from "@/assets/regions-world.jpg";
import europeDataRaw from "@/data/regions/europe.json";
import { TravelPackage, PackageItinerary } from "@/data/packagesData";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Filter, Globe2, MessageCircle, Plane, Search, Star, Users, Wallet } from "lucide-react";
import hero1 from "@/assets/europe/eiffel.jpg";
import hero2 from "@/assets/europe/santorini.jpg";
import hero3 from "@/assets/europe/alps.jpg";

// --- SEO Helpers
const setMeta = (title: string, description: string, canonicalPath: string) => {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", description);
  let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  const url = new URL(canonicalPath, window.location.origin).toString();
  link.setAttribute("href", url);
};

// --- Types extending base package for Europe-specific data
type Addon = { id: string; name: string; priceUSD: number; description?: string };
interface ExtendedItinerary extends PackageItinerary { image?: string }
interface ExtendedPackage extends TravelPackage {
  styles?: string[]; // Family, Couple, Adventure, Luxury, Budget
  themes?: string[];
  budgetTier?: "Budget" | "Midrange" | "Luxury";
  priceUSD?: number;
  departureCities?: string[];
  addons?: Addon[];
  itinerary: ExtendedItinerary[];
}

const EUROPE_COUNTRIES = [
  "Albania","Andorra","Armenia","Austria","Azerbaijan","Belarus","Belgium","Bosnia and Herzegovina","Bulgaria","Croatia","Cyprus","Czech Republic (Czechia)","Denmark","Estonia","Finland","France","Georgia","Germany","Greece","Hungary","Iceland","Ireland","Italy","Kazakhstan","Kosovo","Latvia","Liechtenstein","Lithuania","Luxembourg","Malta","Moldova","Monaco","Montenegro","Netherlands","North Macedonia","Norway","Poland","Portugal","Romania","Russia","San Marino","Serbia","Slovakia","Slovenia","Spain","Sweden","Switzerland","Turkey","Ukraine","United Kingdom","Vatican City",
];

// Utility: parse "10 Days / 9 Nights" => 10
const getDurationDays = (pkg: TravelPackage) => {
  const m = pkg.duration.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
};

const Europe = () => {
  // --- Page SEO
  useEffect(() => {
    setMeta(
      "Europe Tour Packages | Luxury Europe Holidays",
      "Explore luxury Europe tour packages with maps, filters, itineraries, and live USD pricing.",
      "/regions/europe"
    );
  }, []);

  // --- Data setup
  const allPackages: ExtendedPackage[] = useMemo(
    () => (europeDataRaw as unknown as ExtendedPackage[]).map((p) => ({
      ...p,
      image: regionsImage,
    })),
    []
  );

  // --- Quick search
  const [query, setQuery] = useState("");
  const [travelMonth, setTravelMonth] = useState<string>("");
  const [travelers, setTravelers] = useState<number>(2);

  // --- Filters
  const [theme, setTheme] = useState<string>("");
  const [budgetMax, setBudgetMax] = useState<number>(4000);
  const [season, setSeason] = useState<string>("");
  const [departure, setDeparture] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<string>("");

  // --- Selection / UI state
  const [selectedPackage, setSelectedPackage] = useState<ExtendedPackage | null>(null);
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [showCustomize, setShowCustomize] = useState(false);

  // --- Derived data
  const filtered = useMemo(() => {
    return allPackages.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.highlights.some(h => h.toLowerCase().includes(q));
      const matchesTheme = !theme || (p.themes?.includes(theme) || p.category?.toLowerCase().includes(theme.toLowerCase()));
      const matchesSeason = !season || (p.bestTime?.toLowerCase().includes(season.toLowerCase()));
      const matchesDeparture = !departure || (p.departureCities?.includes(departure));
      const matchesCountry = !countryFilter || p.country.toLowerCase().includes(countryFilter.toLowerCase());
      const price = p.priceUSD ?? 2000; // fallback
      const matchesBudget = price <= budgetMax;
      return matchesQuery && matchesTheme && matchesSeason && matchesDeparture && matchesCountry && matchesBudget;
    });
  }, [allPackages, query, theme, season, departure, countryFilter, budgetMax]);

  const groupsByDuration = useMemo(() => {
    const short: ExtendedPackage[] = [];
    const week: ExtendedPackage[] = [];
    const extended: ExtendedPackage[] = [];
    filtered.forEach((p) => {
      const d = getDurationDays(p);
      if (d <= 4) short.push(p);
      else if (d <= 8) week.push(p);
      else extended.push(p);
    });
    return { short, week, extended };
  }, [filtered]);

  const styles = ["Family", "Couple", "Adventure", "Luxury", "Budget"] as const;
  const groupsByStyle = useMemo(() => {
    const map: Record<string, ExtendedPackage[]> = {};
    styles.forEach((s) => (map[s] = []));
    filtered.forEach((p) => {
      const list = p.styles ?? [];
      styles.forEach((s) => {
        if (list.includes(s)) map[s].push(p);
      });
    });
    return map;
  }, [filtered]);

  // --- Handlers
  const handleViewDetails = (packageId: string) => {
    const pkg = allPackages.find((p) => p.id === packageId) || null;
    setSelectedPackage(pkg);
    setShowCustomize(false);
  };

  const toggleAddon = (id: string) => setAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  const selectedAddonsTotal = useMemo(() => {
    if (!selectedPackage?.addons) return 0;
    return selectedPackage.addons.reduce((sum, a) => sum + (addons[a.id] ? a.priceUSD : 0), 0);
  }, [addons, selectedPackage]);

  const basePrice = selectedPackage?.priceUSD ?? 0;
  const totalPrice = basePrice + selectedAddonsTotal;

  // --- JSON-LD (basic product list)
  useEffect(() => {
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: allPackages.slice(0, 10).map((p, i) => ({
        '@type': 'ListItem', position: i + 1, name: p.title, url: window.location.href + `#pkg-${p.id}`
      })),
    } as const;
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.text = JSON.stringify(ld);
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, [allPackages]);

  // --- AI Assistant (local mock)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hi! I\'m your Europe travel assistant. Ask me about tours, budget, or best seasons.' }
  ]);
  const askAI = () => {
    const q = chatInput.trim();
    if (!q) return;
    const reply = (() => {
      // Tiny heuristic: recommend cheapest matching package
      const match = filtered.sort((a,b) => (a.priceUSD??99999) - (b.priceUSD??99999))[0];
      if (match) {
        return `Based on your query, a great option is “${match.title}” in ${match.country}. It\'s ${match.duration} around $${match.priceUSD ?? '—'}. Want me to open details?`;
      }
      return 'I\'d love to help, but I need a bit more detail (destination, budget, or month).';
    })();
    setMessages((m) => [...m, { role: 'user', content: q }, { role: 'assistant', content: reply }]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16 sm:pt-20">
        {/* HERO */}
        <section className="relative">
          <Carousel>
            <CarouselContent>
              {[hero1, hero2, hero3].map((img, idx) => (
                <CarouselItem key={idx}>
                  <div className="relative h-[56vh] sm:h-[60vh] lg:h-[68vh]">
                    <img src={img} alt="Europe scenic" loading="eager" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    <div className="relative z-10 max-w-7xl mx-auto h-full flex items-end px-4 sm:px-6 lg:px-8 pb-8">
                      <div className="space-y-3 sm:space-y-4">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">Europe Tour Packages</h1>
                        <p className="text-muted-foreground max-w-2xl">Multi-country and single-country itineraries with luxurious stays, scenic trains, and curated experiences—priced in USD.</p>
                        {/* Quick search */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 bg-card/90 backdrop-blur rounded-lg p-2 sm:p-3 shadow">
                          <div className="col-span-2 sm:col-span-2">
                            <Input placeholder="Search destination or highlight" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search" />
                          </div>
                          <div className="hidden sm:block">
                            <Select value={travelMonth} onValueChange={setTravelMonth}>
                              <SelectTrigger aria-label="Month"><SelectValue placeholder="Month" /></SelectTrigger>
                              <SelectContent>
                                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => (
                                  <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="hidden sm:flex items-center gap-2">
                            <Users className="size-4" />
                            <Input type="number" min={1} value={travelers} onChange={(e) => setTravelers(parseInt(e.target.value || '1'))} aria-label="Travelers" />
                          </div>
                          <Button className="col-span-2 sm:col-span-1" aria-label="Find packages"><Search className="mr-2 size-4" />Find My Package</Button>
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

        {/* FILTERS + COUNTRY SELECTOR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Refine your search</h2>
            <Badge variant="secondary" className="gap-1"><Filter className="size-4" /> Filters</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger><SelectValue placeholder="Theme" /></SelectTrigger>
              <SelectContent>
                {["Romance","Scenic","Cultural","Family","Adventure","Luxury","Budget"].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger><SelectValue placeholder="Season" /></SelectTrigger>
              <SelectContent>
                {["Spring","Summer","Autumn","Winter"].map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={departure} onValueChange={setDeparture}>
              <SelectTrigger><SelectValue placeholder="Departure city" /></SelectTrigger>
              <SelectContent>
                {["New York","Los Angeles","London","Dubai","Mumbai"].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="col-span-1 lg:col-span-2 bg-card rounded-lg p-3 border">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground flex items-center gap-2"><Wallet className="size-4" /> Budget (USD)</span>
                <span className="font-medium">Up to ${budgetMax}</span>
              </div>
              <Slider max={6000} min={1000} step={100} value={[budgetMax]} onValueChange={(v) => setBudgetMax(v[0])} />
            </div>

            <Button variant="secondary" className="w-full"><Plane className="mr-2 size-4" /> Show Flights & Deals</Button>
          </div>

          {/* Country selector chips */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Globe2 className="size-4" />
              <span className="text-sm text-muted-foreground">Browse by country</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {EUROPE_COUNTRIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountryFilter(c === countryFilter ? "" : c)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${c === countryFilter ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}
                  aria-label={`Filter by ${c}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* GROUPS BY DURATION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
          <header className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">By Duration</h3>
            <span className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="size-4" /> Plan the perfect trip length</span>
          </header>

          {([['Short Breaks (<=4 days)', groupsByDuration.short], ['Week-long (5-8 days)', groupsByDuration.week], ['Extended (9+ days)', groupsByDuration.extended]] as const).map(([title, list]) => (
            <article key={title} className="space-y-3">
              <h4 className="text-lg font-medium">{title}</h4>
              {list.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (<Skeleton key={i} className="h-72" />))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list.map((pkg, index) => (
                    <div key={pkg.id} id={`pkg-${pkg.id}`} style={{ animationDelay: `${index * 60}ms` }} className="animate-fade-in">
                      <PackageCard package={pkg as unknown as TravelPackage} onViewDetails={handleViewDetails} />
                      {/* Inline itinerary preview */}
                      <Accordion type="single" collapsible className="mt-2">
                        <AccordionItem value="itinerary">
                          <AccordionTrigger className="text-sm">Itinerary preview</AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2">
                              {(pkg.itinerary || []).slice(0, 3).map((day, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                  <img src={(day as ExtendedItinerary).image || hero1} alt={`Day ${day.day}`} loading="lazy" className="w-16 h-16 object-cover rounded" />
                                  <div>
                                    <p className="text-sm font-medium">Day {day.day}: {day.title}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{day.description}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      {/* Customize/Add-ons */}
                      {pkg.addons && pkg.addons.length > 0 && (
                        <Sheet open={showCustomize && selectedPackage?.id === pkg.id} onOpenChange={(o) => { setShowCustomize(o); setSelectedPackage(o ? pkg : null); }}>
                          <SheetTrigger asChild>
                            <Button variant="outline" className="mt-2 w-full">Customize with Add‑ons</Button>
                          </SheetTrigger>
                          <SheetContent className="w-full sm:max-w-md">
                            <SheetHeader>
                              <SheetTitle>Customize: {pkg.title}</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 space-y-3">
                              {pkg.addons.map((a) => (
                                <label key={a.id} className="flex items-start gap-3 border rounded p-3">
                                  <input type="checkbox" className="mt-1" checked={!!addons[a.id]} onChange={() => toggleAddon(a.id)} />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium">{a.name}</p>
                                      <span className="text-sm">${a.priceUSD}</span>
                                    </div>
                                    {a.description && <p className="text-sm text-muted-foreground">{a.description}</p>}
                                  </div>
                                </label>
                              ))}
                              <Separator />
                              <div className="flex items-center justify-between font-medium">
                                <span>Base price</span>
                                <span>${pkg.priceUSD ?? '—'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Add‑ons total</span>
                                <span>${selectedPackage?.id === pkg.id ? selectedAddonsTotal : 0}</span>
                              </div>
                              <div className="flex items-center justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span>${selectedPackage?.id === pkg.id ? (pkg.priceUSD ?? 0) + selectedAddonsTotal : (pkg.priceUSD ?? 0)}</span>
                              </div>
                              <Button className="w-full">Book with Add‑ons</Button>
                            </div>
                          </SheetContent>
                        </Sheet>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </section>

        {/* GROUPS BY STYLE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-6">
          <h3 className="text-xl font-semibold">By Travel Style</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {styles.map((s) => (
              <Card key={s}>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-lg">{s}</CardTitle>
                  <Badge variant="secondary">{groupsByStyle[s].length} trips</Badge>
                </CardHeader>
                <CardContent>
                  {groupsByStyle[s].length === 0 ? (
                    <p className="text-sm text-muted-foreground">No trips currently match this style.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupsByStyle[s].slice(0, 3).map((pkg) => (
                        <PackageCard key={pkg.id} package={pkg as unknown as TravelPackage} onViewDetails={handleViewDetails} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Loved by travelers</h3>
            <div className="flex items-center gap-1 text-muted-foreground"><Star className="size-4 fill-current" /> 4.8/5 average</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[hero1, hero2, hero3, hero2, hero1, hero3].map((img, i) => (
              <img key={i} src={img} alt="Traveler moment in Europe" loading="lazy" className="rounded-md object-cover h-28 w-full hover-scale" />
            ))}
          </div>
        </section>

        {/* TRAVEL INFO WIDGETS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Weather (sample)</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Live forecast coming soon. Typical summer highs: 20–28°C across Western Europe.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Best season</CardTitle></CardHeader>
            <CardContent className="text-sm">May–September for sunshine and alpine vistas. December for festive markets and snow.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Visa info</CardTitle></CardHeader>
            <CardContent className="text-sm">Most EU Schengen countries require prior visa for non‑EU passports. Always check the latest embassy guidance.</CardContent>
          </Card>
        </section>

        {/* PERSISTENT BOOKING CTA */}
        {selectedPackage && (
          <aside className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 max-w-2xl bg-card border rounded-xl shadow-lg p-4 flex flex-col sm:flex-row items-center gap-3 animate-enter">
            <div className="flex-1">
              <p className="font-medium">{selectedPackage.title}</p>
              <p className="text-sm text-muted-foreground">Live price in USD</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">${totalPrice.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Incl. selected add‑ons</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => { setAddons({}); setShowCustomize(true); }}>Customize</Button>
              <Button>Check Availability</Button>
            </div>
          </aside>
        )}

        {/* COUNTRY LIST + TIPS (Footer section for the page) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 mb-16">
          <h3 className="text-xl font-semibold mb-3">All Europe Destinations</h3>
          <div className="flex flex-wrap gap-2">
            {EUROPE_COUNTRIES.map((c) => (
              <Badge key={c} variant={c === countryFilter ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => setCountryFilter(c === countryFilter ? '' : c)}>{c}</Badge>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">FAQ</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p><strong>What\'s included?</strong> Hotels, transport, guided tours per package inclusions.</p>
                <p><strong>Can I customize?</strong> Yes—add cruises, trains, or festival entries.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Tips</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">Pack layers, prebook popular attractions, and validate your train tickets.</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Support</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">24/7 concierge for emergencies, rebookings, and visa letters.</CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Floating AI Assistant */}
      <button
        aria-label="Travel assistant"
        onClick={() => setChatOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 rounded-full p-4 bg-primary text-primary-foreground shadow-lg hover:opacity-90"
      >
        <MessageCircle className="size-5" />
      </button>

      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-card border rounded-xl shadow-xl overflow-hidden animate-enter">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <div className="flex items-center gap-2"><MessageCircle className="size-4" /><span className="text-sm font-medium">AI Trip Assistant</span></div>
            <button aria-label="Close chat" onClick={() => setChatOpen(false)}><span className="sr-only">Close</span>✕</button>
          </div>
          <div className="max-h-72 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm ${m.role === 'assistant' ? 'text-foreground' : 'text-primary'}`}>{m.content}</div>
            ))}
          </div>
          <div className="p-3 border-t flex items-center gap-2">
            <Input placeholder="Ask about Europe trips…" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && askAI()} />
            <Button onClick={askAI} size="sm">Send</Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Europe;
