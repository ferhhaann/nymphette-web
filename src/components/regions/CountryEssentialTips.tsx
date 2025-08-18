import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Building2, Shield, Wine, Wifi } from 'lucide-react'

interface TipItem {
  icon: React.ElementType
  title: string
  note: string
}

interface CountryEssentialTipsProps {
  tips?: TipItem[]
}

export const CountryEssentialTips = ({ tips }: CountryEssentialTipsProps) => {
  const defaultTips: TipItem[] = [
    {
      icon: Building2,
      title: "ATM Availability",
      note: "Widely available in urban areas"
    },
    {
      icon: CreditCard,
      title: "Credit Cards",
      note: "Accepted at most establishments"
    },
    {
      icon: Shield,
      title: "Safety Level",
      note: "Generally safe for tourists"
    },
    {
      icon: Wine,
      title: "Legal Drinking Age",
      note: "18+ years"
    },
    {
      icon: Wifi,
      title: "Internet Access",
      note: "Good connectivity in cities"
    }
  ]

  const displayTips = tips && tips.length > 0 ? tips : defaultTips

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Essential Travel Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {displayTips.map((tip, index) => (
            <div key={index} className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <tip.icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
              <p className="text-xs text-muted-foreground">{tip.note}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}