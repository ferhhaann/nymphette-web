import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Sparkles, Clock, Landmark } from "lucide-react";

export type CountryInfo = {
  name: string;
  speciality: string;
  famousPlaces: string[];
  mustVisits: string[];
  bestTime: string;
  culturalExperiences: string[];
  image?: string;
};

interface Props {
  title?: string;
  countries: CountryInfo[];
}

const CountryExplorer: React.FC<Props> = ({ title = "Explore by country", countries }) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>(countries[0]?.name || "");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return countries.filter(c => !q || c.name.toLowerCase().includes(q));
  }, [countries, query]);

  const active = countries.find(c => c.name === selected) || list[0] || countries[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <header className="mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">Find each country's speciality, famous places, must‑visits, best time and cultural experiences.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Country list */}
        <aside className="lg:col-span-4">
          <Input placeholder="Search countries" value={query} onChange={(e)=>setQuery(e.target.value)} className="mb-3" aria-label="Search countries" />
          <div className="max-h-[22rem] overflow-auto rounded border divide-y">
            {list.map((c) => (
              <button
                key={c.name}
                onClick={()=>setSelected(c.name)}
                className={`w-full text-left px-3 py-2 hover:bg-accent transition ${c.name===active?.name? 'bg-accent/50':''}`}
                aria-label={`Show details for ${c.name}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.name}</span>
                  <Badge variant="outline" className="text-xs">{c.bestTime}</Badge>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Details */}
        <article className="lg:col-span-8">
          {active && (
            <Card className="overflow-hidden">
              {active.image && (
                <div className="h-48 w-full overflow-hidden">
                  <img src={active.image} alt={`${active.name} travel highlights`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="size-5"/>{active.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="size-4 mt-1"/>
                  <div>
                    <h4 className="font-medium">Speciality</h4>
                    <p className="text-sm text-muted-foreground">{active.speciality}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium flex items-center gap-2"><Landmark className="size-4"/> Famous places</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {active.famousPlaces.map((p, i) => (<Badge key={i} variant="outline">{p}</Badge>))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Must‑visit</h4>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    {active.mustVisits.map((p, i) => (<li key={i}>{p}</li>))}
                  </ul>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4"/>
                  <div>
                    <h4 className="font-medium">Best time to visit</h4>
                    <p className="text-sm text-muted-foreground">{active.bestTime}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Cultural experiences</h4>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    {active.culturalExperiences.map((p, i) => (<li key={i}>{p}</li>))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </article>
      </div>
    </section>
  );
};

export default CountryExplorer;
