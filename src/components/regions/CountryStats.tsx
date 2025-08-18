import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Heart, Plane } from 'lucide-react'

interface CountryStatsProps {
  annualVisitors?: number
  genderMalePercentage?: number
  genderFemalePercentage?: number
  travelPurposes?: Array<{ name: string; percentage: number }>
  topOriginCities?: string[]
}

export const CountryStats = ({ 
  annualVisitors,
  genderMalePercentage,
  genderFemalePercentage,
  travelPurposes = [],
  topOriginCities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"]
}: CountryStatsProps) => {
  const formatVisitors = (visitors?: number) => {
    if (!visitors) return 'Data not available'
    if (visitors >= 1000000) {
      return `${(visitors / 1000000).toFixed(1)}M visitors annually`
    }
    return `${(visitors / 1000).toFixed(0)}K visitors annually`
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Visitor Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Annual Visitors */}
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <div className="text-3xl font-bold text-primary mb-2">
            {annualVisitors ? `${(annualVisitors / 1000000).toFixed(1)}M` : 'N/A'}
          </div>
          <div className="text-sm text-muted-foreground">{formatVisitors(annualVisitors)}</div>
        </div>

        {/* Gender Split */}
        {(genderMalePercentage || genderFemalePercentage) && (
          <div>
            <h4 className="font-semibold mb-3">Gender Distribution</h4>
            <div className="flex gap-4">
              {genderMalePercentage && (
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{genderMalePercentage}%</div>
                  <div className="text-sm text-muted-foreground">Male</div>
                </div>
              )}
              {genderFemalePercentage && (
                <div className="flex-1 text-center p-3 bg-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">{genderFemalePercentage}%</div>
                  <div className="text-sm text-muted-foreground">Female</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Travel Purposes */}
        {travelPurposes.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Travel Purposes
            </h4>
            <div className="flex flex-wrap gap-2">
              {travelPurposes.map((purpose, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {purpose.name}: {purpose.percentage}%
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Top Origin Cities */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center">
            <Plane className="h-4 w-4 mr-2" />
            Top Origin Cities
          </h4>
          <div className="flex flex-wrap gap-2">
            {topOriginCities.map((city, index) => (
              <Badge key={index} variant="secondary">
                {city}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}