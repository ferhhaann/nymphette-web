import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Database, Download, CheckCircle, Globe, MapPin } from "lucide-react"

// Import all region data
import africaRegion from "@/data/regions/africa.json"
import americasRegion from "@/data/regions/americas.json"
import asiaRegion from "@/data/regions/asia.json"
import europeRegion from "@/data/regions/europe.json"
import middleEastRegion from "@/data/regions/middleEast.json"
import pacificIslandsRegion from "@/data/regions/pacificIslands.json"

// Import all country details
import africaDetails from "@/data/countryDetails/africa.json"
import americasDetails from "@/data/countryDetails/americas.json"
import asiaDetails from "@/data/countryDetails/asia.json"
import europeDetails from "@/data/countryDetails/europe.json"
import middleEastDetails from "@/data/countryDetails/middle-east.json"
import pacificIslandsDetails from "@/data/countryDetails/pacific-islands.json"

// Import unified region data
import africaData from "@/data/regions/africa.data"
import americasData from "@/data/regions/americas.data"
import asiaData from "@/data/regions/asia.data"
import europeData from "@/data/regions/europe.data"
import middleEastData from "@/data/regions/middleEast.data"
import pacificIslandsData from "@/data/regions/pacificIslands.data"

export const RegionCountryMigration = () => {
  const [migrating, setMigrating] = useState(false)
  const [migrated, setMigrated] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTask, setCurrentTask] = useState("")
  const { toast } = useToast()

  const updateProgress = (value: number, task: string) => {
    setProgress(value)
    setCurrentTask(task)
  }

  const migrateRegionCountryData = async () => {
    if (!supabase) return
    
    setMigrating(true)
    setProgress(0)
    
    try {
      console.log("Starting region and country data migration...")
      
      updateProgress(10, "Preparing migration...")

      // Prepare region data for migration
      const regionData = [
        { section: "regions", key: "africa_raw", value: JSON.stringify(africaRegion) },
        { section: "regions", key: "americas_raw", value: JSON.stringify(americasRegion) },
        { section: "regions", key: "asia_raw", value: JSON.stringify(asiaRegion) },
        { section: "regions", key: "europe_raw", value: JSON.stringify(europeRegion) },
        { section: "regions", key: "middleEast_raw", value: JSON.stringify(middleEastRegion) },
        { section: "regions", key: "pacificIslands_raw", value: JSON.stringify(pacificIslandsRegion) },
      ]

      // Prepare country details data for migration
      const countryDetailsData = [
        { section: "countryDetails", key: "africa", value: JSON.stringify(africaDetails) },
        { section: "countryDetails", key: "americas", value: JSON.stringify(americasDetails) },
        { section: "countryDetails", key: "asia", value: JSON.stringify(asiaDetails) },
        { section: "countryDetails", key: "europe", value: JSON.stringify(europeDetails) },
        { section: "countryDetails", key: "middleEast", value: JSON.stringify(middleEastDetails) },
        { section: "countryDetails", key: "pacificIslands", value: JSON.stringify(pacificIslandsDetails) },
      ]

      // Prepare unified region data for migration
      const unifiedRegionData = [
        { section: "unifiedRegions", key: "africa", value: JSON.stringify(africaData) },
        { section: "unifiedRegions", key: "americas", value: JSON.stringify(americasData) },
        { section: "unifiedRegions", key: "asia", value: JSON.stringify(asiaData) },
        { section: "unifiedRegions", key: "europe", value: JSON.stringify(europeData) },
        { section: "unifiedRegions", key: "middleEast", value: JSON.stringify(middleEastData) },
        { section: "unifiedRegions", key: "pacificIslands", value: JSON.stringify(pacificIslandsData) },
      ]

      const allData = [...regionData, ...countryDetailsData, ...unifiedRegionData]

      updateProgress(25, "Migrating region data...")
      
      // Migrate region data
      for (let i = 0; i < regionData.length; i++) {
        const data = regionData[i]
        const { error } = await supabase
          .from('content')
          .upsert([data], { onConflict: 'section,key' })

        if (error) {
          console.error(`Error inserting region data ${data.key}:`, error)
        } else {
          console.log(`✓ Migrated region: ${data.key}`)
        }
        updateProgress(25 + (i + 1) * 8, `Migrating region: ${data.key}`)
      }

      updateProgress(50, "Migrating country details...")
      
      // Migrate country details
      for (let i = 0; i < countryDetailsData.length; i++) {
        const data = countryDetailsData[i]
        const { error } = await supabase
          .from('content')
          .upsert([data], { onConflict: 'section,key' })

        if (error) {
          console.error(`Error inserting country details ${data.key}:`, error)
        } else {
          console.log(`✓ Migrated country details: ${data.key}`)
        }
        updateProgress(50 + (i + 1) * 8, `Migrating country details: ${data.key}`)
      }

      updateProgress(75, "Migrating unified region data...")
      
      // Migrate unified region data
      for (let i = 0; i < unifiedRegionData.length; i++) {
        const data = unifiedRegionData[i]
        const { error } = await supabase
          .from('content')
          .upsert([data], { onConflict: 'section,key' })

        if (error) {
          console.error(`Error inserting unified region data ${data.key}:`, error)
        } else {
          console.log(`✓ Migrated unified region: ${data.key}`)
        }
        updateProgress(75 + (i + 1) * 4, `Migrating unified region: ${data.key}`)
      }

      updateProgress(100, "Migration complete!")
      
      console.log(`Region and Country migration completed! Migrated ${allData.length} datasets`)
      
      toast({
        title: "Region & Country Migration Successful!",
        description: `Migrated ${allData.length} region and country datasets to database.`
      })
      
      setMigrated(true)
      
    } catch (error: any) {
      console.error("Region/Country migration failed:", error)
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
            Region & Country Data Migrated!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All region and country data has been successfully migrated to the database.
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
          Region & Country Data Migration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Migrate all region packages, country details, and unified region data to the database.
        </p>
        
        {migrating && (
          <div className="mb-4">
            <Progress value={progress} className="mb-2" />
            <p className="text-xs text-muted-foreground">{currentTask}</p>
          </div>
        )}
        
        <Button 
          onClick={migrateRegionCountryData} 
          disabled={migrating}
          className="w-full"
        >
          {migrating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Migrating Region & Country Data...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 mr-2" />
              Migrate Region & Country Data
            </>
          )}
        </Button>
        
        <div className="mt-3 text-xs text-muted-foreground">
          <p>This will migrate:</p>
          <ul className="list-disc list-inside ml-2 mt-1">
            <li>Raw region data (6 regions)</li>
            <li>Country details for all countries</li>
            <li>Unified region data with merged packages and details</li>
            <li>Africa, Americas, Asia, Europe, Middle East, Pacific Islands</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}