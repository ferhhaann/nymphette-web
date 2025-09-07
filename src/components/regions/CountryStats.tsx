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
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
      <div className="flex items-center mb-3">
        <Users className="h-4 w-4 mr-2 text-primary" />
        <h3 className="font-semibold text-sm text-primary">Visitor Stats</h3>
      </div>
      
      <div className="space-y-3">
        {/* Annual Visitors - Compact */}
        <div className="text-center p-2 bg-background/60 rounded-lg backdrop-blur-sm border border-primary/10">
          <div className="text-lg font-bold text-primary">
            {annualVisitors ? `${(annualVisitors / 1000000).toFixed(1)}M` : 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground">Annual visitors</div>
        </div>

        {/* Gender Split - Very Compact */}
        {(genderMalePercentage || genderFemalePercentage) && (
          <div className="flex gap-2">
            {genderMalePercentage && (
              <div className="flex-1 text-center p-1.5 bg-blue-50 rounded-md">
                <div className="text-sm font-semibold text-blue-600">{genderMalePercentage}%</div>
                <div className="text-xs text-muted-foreground">Male</div>
              </div>
            )}
            {genderFemalePercentage && (
              <div className="flex-1 text-center p-1.5 bg-pink-50 rounded-md">
                <div className="text-sm font-semibold text-pink-600">{genderFemalePercentage}%</div>
                <div className="text-xs text-muted-foreground">Female</div>
              </div>
            )}
          </div>
        )}

        {/* Travel Purposes - Minimal */}
        {travelPurposes.length > 0 && (
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Top purposes</div>
            <div className="flex flex-wrap gap-1">
              {travelPurposes.slice(0, 3).map((purpose, index) => (
                <span key={index} className="text-xs px-2 py-0.5 bg-accent/50 rounded-full">
                  {purpose.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}