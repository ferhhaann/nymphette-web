import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "./ImageUpload"
import { Trash2, Plus, Image as ImageIcon } from "lucide-react"
import { allCountries } from "@/data/countries"

interface HeroImage {
  id: string
  country_id: string
  image_url: string
  alt_text?: string
  caption?: string
  order_index: number
}

export const CountryImageManager = () => {
  const [selectedCountrySlug, setSelectedCountrySlug] = useState<string>("")
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (selectedCountrySlug) {
      loadHeroImages()
    }
  }, [selectedCountrySlug])

  const loadHeroImages = async () => {
    try {
      setLoading(true)
      // Find country from JSON data
      const selectedCountry = allCountries.find(c => c.slug === selectedCountrySlug)
      if (!selectedCountry) return

      // Fetch from database (images are stored here)
      const { data: dbCountry } = await supabase
        .from('countries')
        .select('id')
        .eq('slug', selectedCountrySlug)
        .single()

      if (dbCountry) {
        const { data, error } = await supabase
          .from('country_hero_images')
          .select('*')
          .eq('country_id', dbCountry.id)
          .order('order_index')

        if (error) throw error
        setHeroImages(data || [])
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load hero images: " + error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addHeroImage = async (imageUrl: string, altText: string, caption: string) => {
    try {
      // Get or create country in DB
      const selectedCountry = allCountries.find(c => c.slug === selectedCountrySlug)
      if (!selectedCountry) return

      let countryId: string

      const { data: existingCountry } = await supabase
        .from('countries')
        .select('id')
        .eq('slug', selectedCountrySlug)
        .single()

      if (existingCountry) {
        countryId = existingCountry.id
      } else {
        // Create minimal country record for image storage
        const { data: newCountry, error: createError } = await supabase
          .from('countries')
          .insert([{
            name: selectedCountry.name,
            slug: selectedCountry.slug,
            region: selectedCountry.region
          }])
          .select('id')
          .single()

        if (createError) throw createError
        countryId = newCountry.id
      }

      const { error } = await supabase
        .from('country_hero_images')
        .insert([{
          country_id: countryId,
          image_url: imageUrl,
          alt_text: altText,
          caption: caption,
          order_index: heroImages.length + 1
        }])

      if (error) throw error

      toast({
        title: "Success",
        description: "Hero image added successfully"
      })
      loadHeroImages()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const deleteHeroImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero image?")) return

    try {
      const { error } = await supabase
        .from('country_hero_images')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Hero image deleted"
      })
      loadHeroImages()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const selectedCountry = allCountries.find(c => c.slug === selectedCountrySlug)
  const fallbackImage = selectedCountry?.fallback_image || '/placeholder.svg'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Country Images Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Country Selection */}
          <div>
            <Label>Select Country</Label>
            <Select value={selectedCountrySlug} onValueChange={setSelectedCountrySlug}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a country" />
              </SelectTrigger>
              <SelectContent>
                {allCountries.map(country => (
                  <SelectItem key={country.slug} value={country.slug}>
                    {country.name} - {country.region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCountrySlug && (
            <>
              {/* Fallback Image Info */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Fallback Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <img 
                      src={fallbackImage} 
                      alt="Fallback" 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="text-sm text-muted-foreground">
                      <p>This image is used when no hero images are uploaded.</p>
                      <p className="mt-1 font-mono">{fallbackImage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add New Hero Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Add New Hero Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <HeroImageUploadForm onSubmit={addHeroImage} />
                </CardContent>
              </Card>

              {/* Existing Hero Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Hero Images ({heroImages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4 text-muted-foreground">Loading...</div>
                  ) : heroImages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No hero images uploaded yet</p>
                      <p className="text-sm">Fallback image will be used</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {heroImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img 
                            src={image.image_url} 
                            alt={image.alt_text || "Hero image"}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteHeroImage(image.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {image.caption || `Image ${image.order_index}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface HeroImageUploadFormProps {
  onSubmit: (imageUrl: string, altText: string, caption: string) => void
}

const HeroImageUploadForm = ({ onSubmit }: HeroImageUploadFormProps) => {
  const [imageUrl, setImageUrl] = useState("")
  const [altText, setAltText] = useState("")
  const [caption, setCaption] = useState("")

  const handleSubmit = () => {
    if (!imageUrl) return
    onSubmit(imageUrl, altText, caption)
    setImageUrl("")
    setAltText("")
    setCaption("")
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Upload Image</Label>
        <ImageUpload onImageUploaded={setImageUrl} />
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
        )}
      </div>
      <div>
        <Label>Alt Text</Label>
        <Input 
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe the image for accessibility"
        />
      </div>
      <div>
        <Label>Caption</Label>
        <Input 
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Image caption to display"
        />
      </div>
      <Button onClick={handleSubmit} disabled={!imageUrl} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Hero Image
      </Button>
    </div>
  )
}
