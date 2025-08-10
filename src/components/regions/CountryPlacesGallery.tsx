import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Props {
  countryName: string;
  countrySlug: string;
  famousPlaces?: string[];
  mustVisit?: string[];
}

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

const ImageStrip: React.FC<{ title: string; places: string[]; countryName: string; countrySlug: string }> = ({ title, places, countryName, countrySlug }) => {
  if (!places?.length) return null;
  return (
    <section className="mt-8" aria-label={title}>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <Carousel>
        <CarouselContent>
          {places.map((place, idx) => {
            const pslug = slugify(place);
            const src = `/places/${countrySlug}/${pslug}.jpg`;
            return (
              <CarouselItem key={idx} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={src}
                      alt={`${place} in ${countryName} - top attraction photo`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                        (e.currentTarget as HTMLImageElement).alt = `${place} in ${countryName} (image placeholder)`;
                      }}
                    />
                  </AspectRatio>
                  <div className="p-3">
                    <div className="font-medium">{place}</div>
                    <p className="text-sm text-muted-foreground">{countryName}</p>
                  </div>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious aria-label="Previous attractions" />
        <CarouselNext aria-label="Next attractions" />
      </Carousel>
    </section>
  );
};

const CountryPlacesGallery: React.FC<Props> = ({ countryName, countrySlug, famousPlaces = [], mustVisit = [] }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <ImageStrip
        title={`Most visited places in ${countryName}`}
        places={famousPlaces}
        countryName={countryName}
        countrySlug={countrySlug}
      />
      <ImageStrip
        title={`Most attractive places in ${countryName}`}
        places={mustVisit}
        countryName={countryName}
        countrySlug={countrySlug}
      />
    </div>
  );
};

export default CountryPlacesGallery;
