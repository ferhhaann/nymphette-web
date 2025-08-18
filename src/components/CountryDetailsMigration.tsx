import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Database, Download, CheckCircle, Globe } from "lucide-react"

// Import country details
import africaDetails from "@/data/countryDetails/africa.json"
import americasDetails from "@/data/countryDetails/americas.json"
import asiaDetails from "@/data/countryDetails/asia.json"
import europeDetails from "@/data/countryDetails/europe.json"
import middleEastDetails from "@/data/countryDetails/middle-east.json"
import pacificIslandsDetails from "@/data/countryDetails/pacific-islands.json"

export const CountryDetailsMigration = () => {
  const [migrating, setMigrating] = useState(false)
  const [migrated, setMigrated] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTask, setCurrentTask] = useState("")
  const { toast } = useToast()

  const updateProgress = (value: number, task: string) => {
    setProgress(value)
    setCurrentTask(task)
  }

  const migrateCountryDetails = async () => {
    if (!supabase) return
    
    setMigrating(true)
    setProgress(0)
    
    try {
      console.log("Starting country details migration...")
      
      updateProgress(10, "Preparing migration...")

      // Combine all country details
      const allCountryDetails = [
        { region: "Africa", details: africaDetails },
        { region: "Americas", details: americasDetails },
        { region: "Asia", details: asiaDetails },
        { region: "Europe", details: europeDetails },
        { region: "Middle East", details: middleEastDetails },
        { region: "Pacific Islands", details: pacificIslandsDetails },
      ]

      let totalCountries = 0
      let processedCountries = 0

      // Count total countries
      allCountryDetails.forEach(({ details }) => {
        totalCountries += Object.keys(details).length
      })

      updateProgress(20, "Migrating countries...")

      // Process each region
      for (const { region, details } of allCountryDetails) {
        console.log(`Processing ${region}...`)
        
        for (const [slug, countryDataRaw] of Object.entries(details as any)) {
          const countryData = countryDataRaw as any
          updateProgress(20 + (processedCountries / totalCountries) * 60, `Migrating ${countryData.name}...`)

          // Insert country
          const { data: countryResult, error: countryError } = await supabase
            .from('countries')
            .upsert({
              name: countryData.name,
              slug: slug,
              region: region,
              capital: countryData.capital,
              currency: countryData.currency,
              climate: countryData.climate,
              best_season: countryData.bestSeason,
              languages: countryData.languages || [],
              speciality: countryData.speciality,
              culture: countryData.culture,
              annual_visitors: countryData.visitors?.annual || null,
              gender_male_percentage: countryData.visitors?.gender?.male || null,
              gender_female_percentage: countryData.visitors?.gender?.female || null,
            }, { onConflict: 'slug' })
            .select()
            .single()

          if (countryError) {
            console.error(`Error inserting country ${countryData.name}:`, countryError)
            continue
          }

          const countryId = countryResult.id

          // Insert famous places
          if (countryData.famousPlaces) {
            for (const place of countryData.famousPlaces) {
              await supabase
                .from('famous_places')
                .upsert({
                  country_id: countryId,
                  name: place.name,
                  image_url: place.image,
                  type: 'famous'
                }, { onConflict: 'country_id,name' })
            }
          }

          // Insert must visit places
          if (countryData.mustVisit) {
            for (const place of countryData.mustVisit) {
              await supabase
                .from('famous_places')
                .upsert({
                  country_id: countryId,
                  name: place.name,
                  image_url: place.image,
                  type: 'must_visit'
                }, { onConflict: 'country_id,name' })
            }
          }

          // Insert essential tips
          if (countryData.essentialTips) {
            for (const tip of countryData.essentialTips) {
              await supabase
                .from('essential_tips')
                .upsert({
                  country_id: countryId,
                  icon: tip.icon,
                  title: tip.title,
                  note: tip.note
                }, { onConflict: 'country_id,title' })
            }
          }

          // Insert travel purposes
          if (countryData.visitors?.purposes) {
            for (const purpose of countryData.visitors.purposes) {
              await supabase
                .from('travel_purposes')
                .upsert({
                  country_id: countryId,
                  name: purpose.name,
                  percentage: purpose.value
                }, { onConflict: 'country_id,name' })
            }
          }

          // Insert FAQs
          if (countryData.faqs) {
            for (const faq of countryData.faqs) {
              await supabase
                .from('country_faqs')
                .upsert({
                  country_id: countryId,
                  question: faq.q,
                  answer: faq.a
                }, { onConflict: 'country_id,question' })
            }
          }

          processedCountries++
          console.log(`✓ Migrated: ${countryData.name}`)
        }
      }

      updateProgress(100, "Migration complete!")
      
      console.log(`Country details migration completed! Migrated ${totalCountries} countries`)
      
      toast({
        title: "Country Details Migration Successful!",
        description: `Migrated ${totalCountries} countries with all their details to database.`
      })
      
      setMigrated(true)
      
    } catch (error: any) {
      console.error("Country details migration failed:", error)
      toast({
        title: "Migration Failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setMigrating(false)
    }
  }

  if (migrated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Country Details Migrated!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All country details have been successfully migrated to the database tables.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Country Details Migration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Migrate country details from JSON files to structured database tables.
        </p>
        
        {migrating && (
          <div className="mb-4">
            <Progress value={progress} className="mb-2" />
            <p className="text-xs text-muted-foreground">{currentTask}</p>
          </div>
        )}
        
        <Button 
          onClick={migrateCountryDetails} 
          disabled={migrating}
          className="w-full"
        >
          {migrating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Migrating Country Details...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Migrate Country Details
            </>
          )}
        </Button>
        
        <div className="mt-3 text-xs text-muted-foreground">
          <p>This will migrate:</p>
          <ul className="list-disc list-inside ml-2 mt-1">
            <li>Country information to structured tables</li>
            <li>Famous places and must-visit locations</li>
            <li>Essential travel tips</li>
            <li>Travel purposes and visitor statistics</li>
            <li>Frequently asked questions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}