import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MapPin } from 'lucide-react'

interface Attraction {
  id: string
  name: string
  description?: string
  image_url?: string
  type: string
  category: string
}

interface CountryAttractionsGalleryProps {
  countryId: string
  countryName: string
}

export const CountryAttractionsGallery = ({ countryId, countryName }: CountryAttractionsGalleryProps) => {
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null)

  useEffect(() => {
    loadAttractions()
  }, [countryId])

  const loadAttractions = async () => {
    try {
      const { data, error } = await supabase
        .from('country_attractions')
        .select('*')
        .eq('country_id', countryId)
        .order('order_index')

      if (error) throw error
      setAttractions(data || [])
    } catch (error) {
      console.error('Error loading attractions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAttractionsByType = (type: string) => {
    return attractions.filter(attraction => attraction.type === type)
  }

  const AttractionCarousel = ({ title, attractionsList }: { title: string, attractionsList: Attraction[] }) => {
    if (!attractionsList.length) return null

    return (
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{title}</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {attractionsList.map((attraction) => (
              <CarouselItem key={attraction.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <Card 
                  className="group cursor-pointer hover:shadow-card-soft transition-all duration-300 border-muted hover:border-primary/20"
                  onClick={() => setSelectedAttraction(attraction)}
                >
                  <CardContent className="p-0">
                    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
                      <img
                        src={attraction.image_url || '/placeholder.svg'}
                        alt={`${attraction.name} in ${countryName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'
                        }}
                      />
                    </AspectRatio>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {attraction.name}
                        </h3>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {attraction.category}
                        </Badge>
                      </div>
                      {attraction.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {attraction.description}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{countryName}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <AttractionCarousel 
        title={`Most Visited Places in ${countryName}`}
        attractionsList={getAttractionsByType('most_visited')}
      />
      <AttractionCarousel 
        title={`Most Attractive Places in ${countryName}`}
        attractionsList={getAttractionsByType('most_attractive')}
      />

      <Dialog open={!!selectedAttraction} onOpenChange={() => setSelectedAttraction(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-foreground">
              {selectedAttraction?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedAttraction && (
            <div className="space-y-4">
              <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
                <img
                  src={selectedAttraction.image_url || '/placeholder.svg'}
                  alt={`${selectedAttraction.name} in ${countryName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'
                  }}
                />
              </AspectRatio>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedAttraction.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{countryName}</span>
                </div>
              </div>
              {selectedAttraction.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {selectedAttraction.description}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}