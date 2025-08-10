import { Airplane, CalendarCheck, BadgePercent, Map } from "lucide-react";

const items = [
  {
    icon: Airplane,
    title: "Airport pickup",
    desc: "Seamless transfers on arrival",
  },
  {
    icon: CalendarCheck,
    title: "Easy booking",
    desc: "Flexible dates and payments",
  },
  {
    icon: BadgePercent,
    title: "Exclusive deals",
    desc: "Best value packages",
  },
  {
    icon: Map,
    title: "Expert guides",
    desc: "Curated local experiences",
  },
];

const TopValues = () => {
  return (
    <section aria-label="Top values for you" className="border-y border-border bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start space-x-3">
              <div className="h-10 w-10 rounded-lg grid place-items-center border border-border text-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-muted-foreground">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopValues;
