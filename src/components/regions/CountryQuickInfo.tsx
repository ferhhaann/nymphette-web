import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Car, Phone, DollarSign, Thermometer, Calendar, Languages } from 'lucide-react'

interface CountryQuickInfoProps {
  timeZone?: string
  drivingSide?: string
  callingCode?: string
  currency?: string
  climate?: string
  bestSeason?: string
  languages?: string[]
}

export const CountryQuickInfo = ({ 
  timeZone = "UTC+8",
  drivingSide = "Right",
  callingCode = "+86",
  currency,
  climate,
  bestSeason,
  languages = []
}: CountryQuickInfoProps) => {
  // Focus on essential travel info
  const essentialInfo = [
    { icon: DollarSign, label: "Currency", value: currency || "Local Currency" },
    { icon: Calendar, label: "Best Season", value: bestSeason || "Year round" },
    { icon: Languages, label: "Languages", value: languages.length > 0 ? languages.slice(0, 2).join(", ") : "Local languages" },
    { icon: Thermometer, label: "Climate", value: climate || "Varies by region" }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Clock className="h-4 w-4 mr-2" />
          Essential Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {essentialInfo.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <item.icon className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
                <div className="font-medium">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}