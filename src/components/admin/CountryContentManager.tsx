import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CountryAttractionsManager } from './CountryAttractionsManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Edit, Plus, Trash2 } from 'lucide-react'

interface Country {
  id: string
  name: string
  slug: string
}

interface ContentSection {
  id: string
  country_id: string
  section_type: string
  title?: string
  content: any
  order_index: number
}

export const CountryContentManager = () => {
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountryId, setSelectedCountryId] = useState<string>('')
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null)
  const [newSection, setNewSection] = useState({
    section_type: '',
    title: '',
    content: { text: '' },
    order_index: 0
  })

  const sectionTypes = [
    'introduction',
    'table_of_contents', 
    'about_destination',
    'interesting_tidbits',
    'seasonal_guide',
    'food_culture',
    'shopping',
    'dos_donts',
    'art_culture'
  ]

  useEffect(() => {
    loadCountries()
  }, [])

  useEffect(() => {
    if (selectedCountryId) {
      loadContentSections()
    }
  }, [selectedCountryId])

  const loadCountries = async () => {
    const { data } = await supabase
      .from('countries')
      .select('id, name, slug')
      .order('name')
    
    setCountries(data || [])
  }

  const loadContentSections = async () => {
    const { data } = await supabase
      .from('country_content')
      .select('*')
      .eq('country_id', selectedCountryId)
      .order('order_index')
    
    setContentSections(data || [])
  }

  const saveSection = async (section: Partial<ContentSection>) => {
    try {
      if (section.id) {
        await supabase
          .from('country_content')
          .update(section)
          .eq('id', section.id)
      } else {
        if (!section.section_type) {
          toast.error('Section type is required')
          return
        }
        
        await supabase
          .from('country_content')
          .insert({
            country_id: selectedCountryId,
            section_type: section.section_type,
            title: section.title || '',
            content: section.content || {},
            order_index: section.order_index || 0
          })
      }
      
      toast.success('Content section saved successfully')
      loadContentSections()
      setEditingSection(null)
      setNewSection({ section_type: '', title: '', content: { text: '' }, order_index: 0 })
    } catch (error) {
      toast.error('Failed to save content section')
    }
  }

  const deleteSection = async (id: string) => {
    try {
      await supabase
        .from('country_content')
        .delete()
        .eq('id', id)
      
      toast.success('Content section deleted')
      loadContentSections()
    } catch (error) {
      toast.error('Failed to delete content section')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Country Content Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Select Country</Label>
              <Select value={selectedCountryId} onValueChange={setSelectedCountryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCountryId && (
              <Tabs defaultValue="attractions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="attractions">Attractions & Places</TabsTrigger>
                  <TabsTrigger value="content">Page Content</TabsTrigger>
                </TabsList>
                
                <TabsContent value="attractions" className="space-y-6">
                  <CountryAttractionsManager 
                    countryId={selectedCountryId} 
                    countryName={countries.find(c => c.id === selectedCountryId)?.name || ''} 
                  />
                </TabsContent>
                
                <TabsContent value="content" className="space-y-6">
                   <div className="text-center py-8">
                     <h3 className="text-lg font-semibold mb-2">Content Management</h3>
                     <p className="text-muted-foreground">
                       Content management has been simplified. Use the Attractions & Places tab to manage country-specific content.
                     </p>
                   </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
