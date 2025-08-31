import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Clock, Users, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface TourPackage {
  id: string
  title: string
  duration: string
  price: string
  original_price?: string
  rating: number
  reviews: number
  image: string
  highlights: string[]
  category: string
  group_size: string
  best_time: string
}

interface CountryPackagesListProps {
  countrySlug: string
  countryName: string
}

export const CountryPackagesList = ({ countrySlug, countryName }: CountryPackagesListProps) => {
  const [packages, setPackages] = useState<TourPackage[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadPackages()
  }, [countrySlug])

  const loadPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('country_slug', countrySlug as any)
        .order('featured', { ascending: false })
        .order('rating', { ascending: false })

      if (error) throw error
      setPackages((data || []) as any)
    } catch (error) {
      console.error('Error loading packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewPackage = (packageId: string) => {
    navigate(`/package/${packageId}`)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (packages.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">Tour Packages for {countryName}</h2>
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">No tour packages available for {countryName} at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back soon for exciting travel packages!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-foreground">Tour Packages for {countryName}</h2>
        <Badge variant="outline" className="text-sm">
          {packages.length} packages available
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="group cursor-pointer hover:shadow-card-soft transition-all duration-300 border-muted hover:border-primary/20">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'
                  }}
                />
                {pkg.original_price && (
                  <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                    Save {Math.round(((parseFloat(pkg.original_price.replace(/[^\d]/g, '')) - parseFloat(pkg.price.replace(/[^\d]/g, ''))) / parseFloat(pkg.original_price.replace(/[^\d]/g, ''))) * 100)}%
                  </Badge>
                )}
                <Badge variant="outline" className="absolute top-3 right-3 bg-background/80">
                  {pkg.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                {pkg.title}
              </CardTitle>
              
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{countryName}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{pkg.group_size}</span>
                </div>
              </div>

              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-semibold">{pkg.rating}</span>
                  <span className="text-muted-foreground ml-1">({pkg.reviews} reviews)</span>
                </div>
              </div>

              {pkg.highlights && pkg.highlights.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {pkg.highlights.slice(0, 3).map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                    {pkg.highlights.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{pkg.highlights.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {pkg.original_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {pkg.original_price}
                    </span>
                  )}
                  <span className="text-xl font-bold text-primary">{pkg.price}</span>
                  <span className="text-xs text-muted-foreground">per person</span>
                </div>
                <Button 
                  onClick={() => handleViewPackage(pkg.id)}
                  className="ml-2"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}