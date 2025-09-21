import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { MapPin, Star } from 'lucide-react'

interface CountryHeroProps {
  countryName: string
  capital?: string
  startingPrice?: string
  heroImage?: string
  packageCount: number
}

export const CountryHero = ({ 
  countryName, 
  capital, 
  startingPrice = "₹25,000", 
  heroImage,
  packageCount 
}: CountryHeroProps) => {
  return (
    <section className="relative">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
        {heroImage ? (
          <OptimizedImage
            src={heroImage} 
            alt={`${countryName} tour packages`}
            priority={true}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-primary"></div>
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="max-w-2xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {countryName} Tour Packages
            </h1>
            {capital && (
              <div className="flex items-center justify-center mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">Capital: {capital}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Star className="h-4 w-4 mr-1" />
            Super Deal
          </Badge>
          <div className="text-lg">
            <span className="text-muted-foreground">Starts From</span>
            <span className="text-2xl font-bold text-primary ml-2">{startingPrice}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button size="lg" className="bg-gradient-primary">
            Book Now
          </Button>
          <Button variant="outline" size="lg">
            View All {packageCount} Packages
          </Button>
        </div>
      </div>
    </section>
  )
}