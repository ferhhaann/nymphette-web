import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

interface AICountryGeneratorProps {
  onDataGenerated: (data: any) => void
}

export const AICountryGenerator = ({ onDataGenerated }: AICountryGeneratorProps) => {
  const [countryName, setCountryName] = useState("")
  const [region, setRegion] = useState("")
  const [loading, setLoading] = useState(false)
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

      // Pass the generated data to parent component to populate the form
      onDataGenerated(data.data)
      
      toast({
        title: "Success! 🎉",
        description: "AI-generated content populated in the form. Review and click Save to create the country.",
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
                Generate Content with AI
              </>
            )}
          </Button>

          {loading && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Generating comprehensive country data...
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    This may take 15-30 seconds. AI is populating all form fields with content.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">
              💡 How it works:
            </p>
            <ol className="text-sm text-amber-700 dark:text-amber-300 mt-2 space-y-1 list-decimal list-inside">
              <li>Enter country name and select region</li>
              <li>Click "Generate Content with AI" to populate all form fields</li>
              <li>Review the generated content in the form below</li>
              <li>Upload images manually if needed</li>
              <li>Click "Save Country" to create the country entry</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
