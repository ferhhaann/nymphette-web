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
  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <Users className="h-4 w-4 mr-2" />
          Visitor Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Annual Visitors */}
        <div className="text-center p-3 bg-primary/10 rounded-lg">
          <div className="text-xl font-bold text-primary mb-1">
            {annualVisitors ? `${(annualVisitors / 1000000).toFixed(1)}M` : 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground">Annual visitors</div>
        </div>

        {/* Gender Split */}
        {(genderMalePercentage || genderFemalePercentage) && (
          <div>
            <h4 className="font-medium mb-2 text-sm">Gender Distribution</h4>
            <div className="flex gap-2">
              {genderMalePercentage && (
                <div className="flex-1 text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-sm font-semibold text-blue-600">{genderMalePercentage}%</div>
                  <div className="text-xs text-muted-foreground">Male</div>
                </div>
              )}
              {genderFemalePercentage && (
                <div className="flex-1 text-center p-2 bg-pink-50 rounded-lg">
                  <div className="text-sm font-semibold text-pink-600">{genderFemalePercentage}%</div>
                  <div className="text-xs text-muted-foreground">Female</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Travel Purposes */}
        {travelPurposes.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 text-sm flex items-center">
              <Heart className="h-3 w-3 mr-1" />
              Travel Purposes
            </h4>
            <div className="flex flex-wrap gap-1">
              {travelPurposes.slice(0, 3).map((purpose, index) => (
                <Badge key={index} variant="outline" className="text-xs py-0 px-2">
                  {purpose.name}: {purpose.percentage}%
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Top Origin Cities */}
        <div>
          <h4 className="font-medium mb-2 text-sm flex items-center">
            <Plane className="h-3 w-3 mr-1" />
            Top Origin Cities
          </h4>
          <div className="flex flex-wrap gap-1">
            {topOriginCities.slice(0, 5).map((city, index) => (
              <Badge key={index} variant="secondary" className="text-xs py-0 px-2">
                {city}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}