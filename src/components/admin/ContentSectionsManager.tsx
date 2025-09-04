import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Edit, Trash2, GripVertical } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type Country = Database['public']['Tables']['countries']['Row']
type CountrySection = Database['public']['Tables']['country_sections']['Row']

interface ContentSectionsManagerProps {
  countries: Country[]
}

interface SectionWithCountry extends CountrySection {
  country_name: string
  country_region: string
}

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'overview', label: 'Overview' },
  { value: 'about', label: 'About' },
  { value: 'fun_facts', label: 'Fun Facts' },
  { value: 'before_you_go', label: 'Before You Go' },
  { value: 'best_time', label: 'Best Time to Visit' },
  { value: 'reasons_to_visit', label: 'Reasons to Visit' },
  { value: 'food_shopping', label: 'Food & Shopping' },
  { value: 'dos_donts', label: 'Dos and Don\'ts' },
  { value: 'art_culture', label: 'Art & Culture' }
]

export const ContentSectionsManager = ({ countries }: ContentSectionsManagerProps) => {
  const [sections, setSections] = useState<SectionWithCountry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedCountry, setSelectedCountry] = useState<string>("all")
  const [selectedSectionType, setSelectedSectionType] = useState<string>("all")
  const [showEnabledOnly, setShowEnabledOnly] = useState(false)
  const { toast } = useToast()

  const regions = ["Asia", "Europe", "Africa", "Americas", "Pacific Islands", "Middle East"]

  useEffect(() => {
    loadSections()
  }, [countries])

  const loadSections = async () => {
    if (countries.length === 0) return
    
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('country_sections')
        .select('*')
        .order('country_id')
        .order('order_index')

      if (error) throw error

      // Combine sections with country data
      const sectionsWithCountry: SectionWithCountry[] = (data || []).map(section => {
        const country = countries.find(c => c.id === section.country_id)
        return {
          ...section,
          country_name: country?.name || 'Unknown Country',
          country_region: country?.region || 'Unknown Region'
        }
      })

      setSections(sectionsWithCountry)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load sections: " + error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSectionStatus = async (sectionId: string, isEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from('country_sections')
        .update({ is_enabled: isEnabled })
        .eq('id', sectionId)

      if (error) throw error

      // Update local state
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, is_enabled: isEnabled }
          : section
      ))

      toast({
        title: "Success",
        description: `Section ${isEnabled ? 'enabled' : 'disabled'}`
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const deleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return

    try {
      const { error } = await supabase
        .from('country_sections')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadSections()
      toast({
        title: "Success",
        description: "Section deleted"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Filter sections based on all criteria
  const filteredSections = sections.filter(section => {
    const matchesSearch = section.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.section_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.country_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === "all" || section.country_region === selectedRegion
    const matchesCountry = selectedCountry === "all" || section.country_id === selectedCountry
    const matchesType = selectedSectionType === "all" || section.section_name === selectedSectionType
    const matchesEnabled = !showEnabledOnly || section.is_enabled
    return matchesSearch && matchesRegion && matchesCountry && matchesType && matchesEnabled
  })

  // Group sections by country and region
  const sectionsByCountry = countries.reduce((acc, country) => {
    const countrySections = filteredSections.filter(section => section.country_id === country.id)
    if (countrySections.length > 0) {
      acc[country.id] = {
        country,
        sections: countrySections
      }
    }
    return acc
  }, {} as Record<string, { country: Country, sections: SectionWithCountry[] }>)

  // Get filtered countries for country dropdown
  const filteredCountries = selectedRegion === "all" 
    ? countries 
    : countries.filter(country => country.region === selectedRegion)

  if (loading) {
    return <div className="text-center p-8">Loading content sections...</div>
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">🔍 Search & Filter Content Sections</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <Label htmlFor="search-content">Search sections</Label>
            <Input
              id="search-content"
              placeholder="Search by title, type, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="region-filter">Filter by Region</Label>
            <Select value={selectedRegion} onValueChange={(value) => {
              setSelectedRegion(value)
              setSelectedCountry("all") // Reset country when region changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="country-filter">Filter by Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {filteredCountries.map(country => (
                  <SelectItem key={country.id} value={country.id}>{country.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="section-type-filter">Filter by Type</Label>
            <Select value={selectedSectionType} onValueChange={setSelectedSectionType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {SECTION_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Switch
              id="enabled-only"
              checked={showEnabledOnly}
              onCheckedChange={setShowEnabledOnly}
            />
            <Label htmlFor="enabled-only">Enabled only</Label>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedRegion("all")
                setSelectedCountry("all")
                setSelectedSectionType("all")
                setShowEnabledOnly(false)
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredSections.length} of {sections.length} content sections across {Object.keys(sectionsByCountry).length} countries
        </div>
      </div>

      {/* Content Sections organized by Country */}
      <div className="space-y-8">
        {Object.entries(sectionsByCountry).map(([countryId, { country, sections: countrySections }]) => (
          <div key={countryId} className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold">{country.name}</h4>
              <Badge variant="outline">{country.region}</Badge>
              <Badge variant="secondary">{countrySections.length} sections</Badge>
            </div>
            
            <div className="grid gap-4">
              {countrySections.map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-lg">{section.title || 'Untitled Section'}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {SECTION_TYPES.find(t => t.value === section.section_name)?.label || section.section_name} • 
                            Order: {section.order_index} • 
                            {section.country_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={section.is_enabled}
                          onCheckedChange={(checked) => updateSectionStatus(section.id, checked)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Navigate to individual country section manager
                            window.location.hash = `#country-${section.country_id}-sections`
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteSection(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground line-clamp-3">
                      {section.content && typeof section.content === 'object' 
                        ? Object.entries(section.content).map(([key, value]) => 
                            `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`
                          ).join(' • ')
                        : String(section.content || 'No content')
                      }
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredSections.length === 0 && sections.length > 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">No content sections match your current filters.</p>
            <Button className="mt-4" variant="outline" onClick={() => {
              setSearchTerm("")
              setSelectedRegion("all")
              setSelectedCountry("all")
              setSelectedSectionType("all")
              setShowEnabledOnly(false)
            }}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {sections.length === 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">No content sections found. Add countries first, then create content sections for them.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}