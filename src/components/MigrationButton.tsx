import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { packagesData } from "@/data/packagesData"
import { useToast } from "@/hooks/use-toast"
import { Database, Download } from "lucide-react"

export const MigrationButton = () => {
  const [migrating, setMigrating] = useState(false)
  const [migrated, setMigrated] = useState(false)
  const { toast } = useToast()

  // Don't show migration button if Supabase is not configured
  if (!supabase) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <Database className="h-5 w-5" />
            Supabase Not Connected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click the green Supabase button in the top-right corner to connect your database for the admin panel feature.
          </p>
        </CardContent>
      </Card>
    )
  }

  const migrateData = async () => {
    if (!supabase) return
    
    setMigrating(true)
    
    try {
      console.log("Starting package migration...")
      
      // Clear existing packages
      const { error: deleteError } = await supabase
        .from('packages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
      
      if (deleteError) {
        console.error("Error clearing packages:", deleteError)
        throw deleteError
      }

      let totalMigrated = 0

      // Migrate packages from each region
      for (const [region, packages] of Object.entries(packagesData)) {
        console.log(`Migrating ${packages.length} packages from ${region}...`)
        
        for (const pkg of packages) {
          const dbPackage = {
            id: pkg.id,
            title: pkg.title,
            country: pkg.country,
            country_slug: pkg.countrySlug,
            region: pkg.region,
            duration: pkg.duration,
            price: pkg.price,
            original_price: pkg.originalPrice,
            rating: pkg.rating,
            reviews: pkg.reviews,
            image: pkg.image,
            highlights: pkg.highlights,
            inclusions: pkg.inclusions,
            exclusions: pkg.exclusions,
            category: pkg.category,
            best_time: pkg.bestTime,
            group_size: pkg.groupSize,
            overview_section_title: pkg.overview?.sectionTitle,
            overview_description: pkg.overview?.description,
            overview_highlights_label: pkg.overview?.highlightsLabel,
            overview_badge_variant: pkg.overview?.highlightsBadgeVariant,
            overview_badge_style: pkg.overview?.highlightsBadgeStyle,
            itinerary: JSON.stringify(pkg.itinerary)
          }

          const { error } = await supabase
            .from('packages')
            .insert([dbPackage])

          if (error) {
            console.error(`Error inserting package ${pkg.title}:`, error)
          } else {
            console.log(`✓ Migrated: ${pkg.title}`)
            totalMigrated++
          }
        }
      }

      // Migrate default content
      const defaultContent = [
        {
          section: "hero",
          key: "title",
          value: "Discover Your Next Adventure"
        },
        {
          section: "hero",
          key: "subtitle", 
          value: "Explore amazing destinations across the globe with our carefully curated travel packages designed to create unforgettable memories."
        },
        {
          section: "featured-packages",
          key: "title",
          value: "Featured Travel Packages"
        },
        {
          section: "featured-packages",
          key: "subtitle",
          value: "Handpicked destinations and experiences crafted for unforgettable journeys"
        }
      ]

      for (const content of defaultContent) {
        const { error } = await supabase
          .from('content')
          .upsert([content], { onConflict: 'section,key' })

        if (error) {
          console.error(`Error inserting content ${content.section}.${content.key}:`, error)
        }
      }

      console.log(`Migration completed! Migrated ${totalMigrated} packages`)
      
      toast({
        title: "Migration Successful!",
        description: `Migrated ${totalMigrated} packages and default content to database.`
      })
      
      setMigrated(true)
      
    } catch (error: any) {
      console.error("Migration failed:", error)
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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Database className="h-5 w-5" />
            Migration Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your data has been successfully migrated to the database. You can now refresh the page.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Migration Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Your database is connected but empty. Click below to migrate your existing travel packages to the database.
        </p>
        <Button 
          onClick={migrateData} 
          disabled={migrating}
          className="w-full"
        >
          {migrating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Migrating Data...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Migrate Data to Database
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}