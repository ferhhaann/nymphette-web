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
import type { TravelPackage } from "@/data/packagesData";
import asiaMerged from "@/data/regions/asia.data";
import europeMerged from "@/data/regions/europe.data";
import africaMerged from "@/data/regions/africa.data";
import americasMerged from "@/data/regions/americas.data";
import middleEastMerged from "@/data/regions/middleEast.data";
import pacificIslandsMerged from "@/data/regions/pacificIslands.data";
import type { UnifiedRegionData } from "@/data/regions/types";
import CountryPlacesGallery from "@/components/regions/CountryPlacesGallery";

// Unified region data (packages + country details)
const pickRegionUnified = (region: string): UnifiedRegionData => {
  switch (region) {
    case "asia": return asiaMerged as UnifiedRegionData;
    case "europe": return europeMerged as UnifiedRegionData;
    case "africa": return africaMerged as UnifiedRegionData;
    case "americas": return americasMerged as UnifiedRegionData;
    case "middle-east": return middleEastMerged as UnifiedRegionData;
    case "pacific-islands": return pacificIslandsMerged as UnifiedRegionData;
    default: return { countries: {} };
  }
};

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

// Helpers
const deslug = (slug: string) => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
// (deprecated) pickRegionPackages removed in favor of pickRegionUnified

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

const CountryDetail: React.FC = () => {
  const { region, country } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const countryName = useMemo(() => deslug(country || ""), [country]);
  const regionKey = (region || "").toLowerCase();

  const unified = useMemo(() => pickRegionUnified(regionKey), [regionKey]);
  const cslug = useMemo(() => (country || "").toLowerCase(), [country]);

  const packages = useMemo(() => {
    return (unified.countries?.[cslug]?.packages || []) as TravelPackage[];
  }, [unified, cslug]);

  const details = useMemo(() => {
    const raw = (unified.countries?.[cslug]?.details as any) || {};
    return raw ? { ...raw, name: raw.name ?? countryName } : { name: countryName };
  }, [unified, cslug, countryName]);

  // SEO
  useEffect(() => {
    const displayName = details.name || countryName;
    const pageTitle = `${displayName} Tour Packages | ${details.bestSeason ? details.bestSeason + " • " : ""}Travel Guide`;
    document.title = pageTitle;

    const descParts: string[] = [`Plan your ${displayName} trip: packages`];
    if (details.bestSeason) descParts.push(`best time (${details.bestSeason})`);
    if (details.currency) descParts.push(`currency (${details.currency})`);
    descParts.push("tips, FAQs and enquiry.");
    const desc = descParts.join(", ");

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.setAttribute("content", desc);
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) { link = document.createElement("link"); link.setAttribute("rel", "canonical"); document.head.appendChild(link); }
    link.setAttribute("href", new URL(`/regions/${regionKey}/country/${(country || '').toLowerCase()}`, window.location.origin).toString());

    // FAQ structured data
    if (details.faqs?.length) {
      const ld = {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: details.faqs.slice(0, 8).map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
      } as const;
      const el = document.createElement('script'); el.type = 'application/ld+json'; el.text = JSON.stringify(ld);
      document.head.appendChild(el); return () => { document.head.removeChild(el); };
    }
  }, [country, details, regionKey, countryName]);

  // Enquiry form
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  useEffect(() => {
    setA(2 + Math.floor(Math.random() * 8));
    setB(1 + Math.floor(Math.random() * 7));
  }, [country]);

  const [formData, setFormData] = useState<EnquiryData>({
    name: "",
    city: "",
    email: "",
    phone: "",
    whatsapp: "",
    destination: details.name,
    date: undefined,
    travellers: 2,
    vacationType: "Leisure",
    captcha: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
      destination: details.name,
      date: undefined,
      travellers: 2,
      vacationType: "Leisure",
      captcha: "",
    });
  };

  const PurposeChart = () => (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={details.visitors?.purposes || []}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip cursor={{ fill: "hsl(var(--muted)/0.2)" }} />
          <Bar dataKey="value" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const pkgCount = packages.length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="animate-fade-in">
        {/* Hero Section */}
        <section className="relative overflow-hidden mt-6">
          <div
            className="bg-gradient-to-br from-secondary to-background"
            style={{ backgroundImage: "radial-gradient(40rem 40rem at 120% -10%, hsl(var(--accent)/0.15), transparent)" }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
              <div className="grid lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-3">
                  <h1 className="text-3xl sm:text-4xl font-bold text-primary">Explore {details.name} Tour Packages</h1>
                  <p className="text-muted-foreground flex items-center gap-2"><Flag className="size-4" /> {details.speciality || `Discover ${details.name}'s highlights`}</p>
                  <div className="flex flex-wrap gap-2">
                    {details.capital && (
                      <Badge variant="outline" className="gap-1"><MapPin className="size-4" /> Capital: {details.capital}</Badge>
                    )}
                    {details.currency && (
                      <Badge variant="outline" className="gap-1"><HandCoins className="size-4" /> {details.currency}</Badge>
                    )}
                    {details.bestSeason && (
                      <Badge variant="outline" className="gap-1"><Clock className="size-4" /> Best season: {details.bestSeason}</Badge>
                    )}
                    {Array.isArray(details.languages) && details.languages.length > 0 && (
                      <Badge variant="outline" className="gap-1"><Globe2 className="size-4" /> {details.languages.join(", ")}</Badge>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={() => document.getElementById("enquiry")?.scrollIntoView({ behavior: 'smooth' })}>Book Now</Button>
                    <Button variant="outline" asChild>
                      <Link to={`/regions/${regionKey}`}>View All Packages</Link>
                    </Button>
                  </div>
                </div>

                {((details.currency) || (details.climate) || (details.bestSeason) || (Array.isArray(details.languages) && details.languages.length > 0)) && (
                  <Card className="bg-card/80 backdrop-blur">
                    <CardContent className="p-4 space-y-3">
                      <div className="text-sm text-muted-foreground">Essential facts</div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {details.currency && (
                          <div>
                            <div className="text-muted-foreground">Currency</div>
                            <div className="font-medium">{details.currency}</div>
                          </div>
                        )}
                        {details.climate && (
                          <div>
                            <div className="text-muted-foreground">Climate</div>
                            <div className="font-medium">{details.climate}</div>
                          </div>
                        )}
                        {details.bestSeason && (
                          <div>
                            <div className="text-muted-foreground">Best Season</div>
                            <div className="font-medium">{details.bestSeason}</div>
                          </div>
                        )}
                        {Array.isArray(details.languages) && details.languages.length > 0 && (
                          <div>
                            <div className="text-muted-foreground">Languages</div>
                            <div className="font-medium">{details.languages.join(', ')}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Essential Tips */}
        {details.essentialTips?.length ? (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Essential Tips</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {details.essentialTips.map((tip, idx) => {
                const Icon = (iconMap as any)[tip.icon as keyof typeof iconMap] || Info;
                return (
                  <Card key={idx} className="p-4">
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
        ) : null}

        {(details as any).visitors ? (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <h2 className="text-2xl font-semibold mb-4">Visitor Statistics</h2>
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-2">Annual Visitors</div>
                <div className="text-3xl font-bold">{details.visitors?.annual?.toLocaleString?.() || '—'}</div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  {details.visitors?.gender?.male !== undefined && (
                    <div className="flex items-center gap-2"><Users className="size-4" /> Male: {details.visitors.gender.male}%</div>
                  )}
                  {details.visitors?.gender?.female !== undefined && (
                    <div className="flex items-center gap-2"><Users className="size-4" /> Female: {details.visitors.gender.female}%</div>
                  )}
                </div>
              </Card>

              <Card className="p-4 lg:col-span-2">
                <div className="text-sm text-muted-foreground mb-2">Travel Purposes</div>
                <PurposeChart />
              </Card>

              {details.visitors?.topOrigins?.length ? (
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-2">Top Origins</div>
                  <ul className="space-y-2">
                    {details.visitors.topOrigins.map((o, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm"><MapPin className="size-4" /> {o}</li>
                    ))}
                  </ul>
                </Card>
              ) : null}

              <Card className="p-4 lg:col-span-2">
                <div className="text-sm text-muted-foreground mb-2">Map Outline</div>
                <div className="h-48 rounded-md border grid place-items-center text-muted-foreground bg-secondary/40">
                  <Map className="size-8" /> Map outline placeholder for {details.name}
                </div>
              </Card>
            </div>
          </section>
        ) : null}

        {/* Informational Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <h2 className="text-2xl font-semibold">Everything You Need to Know About {details.name}</h2>
          {details.culture && (
            <>
              <p className="text-muted-foreground mt-2 max-w-3xl">{details.culture}</p>
              <Button variant="link" className="mt-2 px-0" asChild>
                <a href="#more-info" onClick={(e) => e.preventDefault()}>Read More</a>
              </Button>
            </>
          )}
        </section>

        {(Array.isArray(details.famousPlaces) && details.famousPlaces.length) || (Array.isArray(details.mustVisit) && details.mustVisit.length) ? (
          <CountryPlacesGallery
            countryName={details.name}
            countrySlug={cslug}
            famousPlaces={details.famousPlaces}
            mustVisit={details.mustVisit}
          />
        ) : null}

        {/* Tour Packages Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <h2 className="text-2xl font-semibold mb-4">{details.name} Tour Packages</h2>
          {packages.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((p) => (
                <Card key={p.id} className="overflow-hidden animate-fade-in">
                  <div className="h-40 relative">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    <Badge className="absolute top-3 left-3" variant="secondary">{p.category}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <MapPin className="size-4" /> {p.highlights.slice(0, 3).join(' • ')}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{p.duration}</div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => document.getElementById("enquiry")?.scrollIntoView({ behavior: 'smooth' })}>Enquire</Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/regions/${regionKey}`}>View Region</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">No packages found for this destination yet. Contact us for a custom itinerary.</div>
          )}
        </section>

        {/* Travel Tips Icons */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 flex items-start gap-3"><Landmark className="size-5 text-accent" /><div><div className="font-medium">Visa Requirements</div><div className="text-sm text-muted-foreground">Check eligibility, processing times and required documents.</div></div></Card>
            <Card className="p-4 flex items-start gap-3"><ShieldCheck className="size-5 text-accent" /><div><div className="font-medium">Health & Safety</div><div className="text-sm text-muted-foreground">Follow local advisories; consider travel insurance.</div></div></Card>
            <Card className="p-4 flex items-start gap-3"><HandCoins className="size-5 text-accent" /><div><div className="font-medium">Currency & Tipping</div><div className="text-sm text-muted-foreground">Use local currency; tipping norms vary by service.</div></div></Card>
          </div>
        </section>

        {/* FAQs */}
        {details.faqs?.length ? (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <h2 className="text-2xl font-semibold mb-4">FAQs about travelling to {details.name}</h2>
            <Accordion type="single" collapsible className="w-full">
              {details.faqs.map((f, i) => (
                <AccordionItem key={i} value={`q${i}`}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ) : null}

        {/* Enquiry / Contact */}
        <section id="enquiry" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Contact us</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2"><Phone className="size-4" /> +1 (555) 123-4567</div>
                <div className="flex items-center gap-2"><Mail className="size-4" /> hello@nymphettetours.com</div>
              </div>
            </Card>

            <Card className="p-6">
              <form
                onSubmit={onSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                aria-label="Destination enquiry form"
              >
                <div className="sm:col-span-2 text-lg font-semibold mb-1">Enquire about {details.name}</div>
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
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
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
                        className={cn("p-3 pointer-events-auto")}
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
                  <Button type="submit" className="w-full">Submit</Button>
                </div>
              </form>
            </Card>
          </div>
        </section>

        {/* Newsletter */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="font-medium">Subscribe for {details.name} updates</div>
            <div className="flex w-full sm:w-auto gap-2">
              <Input type="email" placeholder="Your email" aria-label="Email" />
              <Button>Subscribe</Button>
            </div>
          </Card>
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
};

export default CountryDetail;
