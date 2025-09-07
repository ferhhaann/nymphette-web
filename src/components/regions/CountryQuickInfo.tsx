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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Clock className="h-4 w-4 mr-2 text-primary" />
        Essential Information
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {essentialInfo.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-colors">
            <div className="p-2 rounded-lg bg-primary/10">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
              <div className="font-semibold text-foreground truncate">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}