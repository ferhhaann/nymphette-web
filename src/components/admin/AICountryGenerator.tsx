import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, Download, Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

interface CountryData {
  name: string
  slug: string
  capital: string
  currency: string
  climate: string
  best_season: string
  languages: string[]
  speciality: string
  culture: string
  hero_image: string
  fallback_image: string
  sections: Array<{ title: string; content: string }>
  tips: Array<{ category: string; title: string; description: string }>
  attractions: Array<{ name: string; description: string; location: string; image: string }>
  faqs: Array<{ question: string; answer: string }>
}

export const AICountryGenerator = () => {
  const [countryName, setCountryName] = useState("")
  const [region, setRegion] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatedData, setGeneratedData] = useState<CountryData | null>(null)
  const { toast } = useToast()

  const regions = ["Asia", "Europe", "Africa", "Americas", "Pacific Islands", "Middle East"]

  const generateCountryData = async () => {
    if (!countryName || !region) {
      toast({
        title: "Missing Information",
        description: "Please provide both country name and region",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    setGeneratedData(null)

    try {
      // Use direct fetch with longer timeout for AI generation (90 seconds)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 90000)

      const session = (await supabase.auth.getSession()).data.session

      const response = await fetch(
        `https://duouhbzwivonyssvtiqo.supabase.co/functions/v1/generate-country-data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`,
          },
          body: JSON.stringify({ countryName, region }),
          signal: controller.signal,
        }
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate country data')
      }

      const data = await response.json()

      if (data.error) {
        toast({
          title: "Generation Failed",
          description: data.error,
          variant: "destructive",
          duration: 5000
        })
        return
      }

      setGeneratedData(data.data)
      toast({
        title: "Success! 🎉",
        description: "Country data generated successfully. Review and download the JSON.",
        duration: 5000
      })
    } catch (error: any) {
      console.error("Error generating country data:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate country data",
        variant: "destructive",
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadJSON = () => {
    if (!generatedData) return

    const jsonString = JSON.stringify(generatedData, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${generatedData.slug}-data.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Country data JSON file downloaded successfully",
      duration: 3000
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Country Data Generator</CardTitle>
              <CardDescription>
                Use AI to automatically generate comprehensive country information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country-name">Country Name *</Label>
              <Input
                id="country-name"
                placeholder="e.g., Japan, Brazil, Morocco"
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select value={region} onValueChange={setRegion} disabled={loading}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={generateCountryData}
              disabled={loading || !countryName || !region}
              className="flex items-center gap-2"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate with AI
                </>
              )}
            </Button>

            {generatedData && (
              <Button
                onClick={downloadJSON}
                variant="outline"
                className="flex items-center gap-2"
                size="lg"
              >
                <Download className="h-4 w-4" />
                Download JSON
              </Button>
            )}
          </div>

          {loading && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Generating comprehensive country data...
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    This may take 15-30 seconds. AI is creating sections, tips, attractions, and FAQs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {generatedData && (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generated Data Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div>
                    <span className="font-semibold text-green-900 dark:text-green-100">Country:</span>
                    <span className="ml-2 text-green-700 dark:text-green-300">{generatedData.name}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-green-900 dark:text-green-100">Capital:</span>
                    <span className="ml-2 text-green-700 dark:text-green-300">{generatedData.capital}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-green-900 dark:text-green-100">Currency:</span>
                    <span className="ml-2 text-green-700 dark:text-green-300">{generatedData.currency}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-green-900 dark:text-green-100">Best Season:</span>
                    <span className="ml-2 text-green-700 dark:text-green-300">{generatedData.best_season}</span>
                  </div>
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-semibold text-green-900 dark:text-green-100">Content Sections:</span>
                    <span className="text-green-700 dark:text-green-300">{generatedData.sections.length}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-green-900 dark:text-green-100">Essential Tips:</span>
                    <span className="text-green-700 dark:text-green-300">{generatedData.tips.length}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-green-900 dark:text-green-100">Attractions:</span>
                    <span className="text-green-700 dark:text-green-300">{generatedData.attractions.length}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-green-900 dark:text-green-100">FAQs:</span>
                    <span className="text-green-700 dark:text-green-300">{generatedData.faqs.length}</span>
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-black/20 rounded p-3 max-h-60 overflow-auto">
                  <pre className="text-xs text-green-800 dark:text-green-200 whitespace-pre-wrap">
                    {JSON.stringify(generatedData, null, 2)}
                  </pre>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">
                    📝 Next Steps:
                  </p>
                  <ol className="text-sm text-amber-700 dark:text-amber-300 mt-2 space-y-1 list-decimal list-inside">
                    <li>Download the JSON file using the button above</li>
                    <li>Add this data to the appropriate region JSON file (e.g., asia.json, middleEast.json)</li>
                    <li>Upload country hero image via the "Images & Media" tab if needed</li>
                    <li>Review and adjust the content as needed</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
