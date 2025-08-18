import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ContentSection {
  id: string
  section_type: string
  title?: string
  content: any
  order_index: number
}

interface CountryContentSectionProps {
  sections: ContentSection[]
  sectionType: string
  title: string
  icon?: React.ReactNode
}

export const CountryContentSection = ({ 
  sections, 
  sectionType, 
  title, 
  icon 
}: CountryContentSectionProps) => {
  const sectionData = sections.find(s => s.section_type === sectionType)
  
  if (!sectionData) return null

  const renderContent = () => {
    const { content } = sectionData
    
    if (sectionType === 'table_of_contents') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {content.items?.map((item: string, index: number) => (
            <div key={index} className="p-2 text-sm hover:bg-muted rounded cursor-pointer transition-colors">
              {item}
            </div>
          ))}
        </div>
      )
    }
    
    if (sectionType === 'interesting_tidbits') {
      return (
        <ul className="space-y-2">
          {content.items?.map((item: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    }
    
    if (sectionType === 'seasonal_guide') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(content.seasons || {}).map(([season, info]: [string, any]) => (
            <div key={season} className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold capitalize mb-2">{season}</h4>
              <p className="text-sm text-muted-foreground mb-2">{info.description}</p>
              <div className="flex flex-wrap gap-1">
                {info.activities?.map((activity: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }
    
    if (sectionType === 'dos_donts') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-600 mb-3">✓ Do's</h4>
            <ul className="space-y-2">
              {content.dos?.map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-600 mb-3">✗ Don'ts</h4>
            <ul className="space-y-2">
              {content.donts?.map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }
    
    // Default text content
    if (typeof content.text === 'string') {
      return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.text }} />
    }
    
    return <p>{content.description || 'Content not available'}</p>
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          {icon}
          <h2 className="text-2xl font-bold ml-2">{sectionData.title || title}</h2>
        </div>
        {renderContent()}
      </CardContent>
    </Card>
  )
}