import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { packagesData } from "@/data/packagesData"
import { useToast } from "@/hooks/use-toast"
import { Database, Download } from "lucide-react"
import siteContent from "@/data/siteContent.json"
import aboutContent from "@/data/aboutContent.json"
import blogContent from "@/data/blogContent.json"
import groupToursContent from "@/data/groupToursContent.json"
import packagesContent from "@/data/packagesContent.json"

// Generate a valid UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const MigrationButton = () => {
  const [migrating, setMigrating] = useState(false)
  const [migrated, setMigrated] = useState(false)
  const [hasData, setHasData] = useState(false)
  const [checking, setChecking] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    checkExistingData()
  }, [])

  const checkExistingData = async () => {
    if (!supabase) {
      setChecking(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('packages')
        .select('id')
        .limit(1)

      if (error) throw error
      
      setHasData((data?.length || 0) > 0)
    } catch (error) {
      console.error('Error checking existing data:', error)
      setHasData(false)
    } finally {
      setChecking(false)
    }
  }

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

  // Don't show anything if data already exists
  if (checking) {
    return null
  }

  if (hasData && !migrated) {
    return null
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
            id: generateUUID(), // Generate proper UUID instead of using string ID
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

      // Migrate all JSON content
      const contentSections = [
        // Site content
        { section: "site", key: "name", value: siteContent.site.name },
        { section: "site", key: "tagline", value: siteContent.site.tagline },
        { section: "site", key: "description", value: siteContent.site.description },
        
        // Hero content
        { section: "hero", key: "title", value: siteContent.hero.title },
        { section: "hero", key: "titleHighlight", value: siteContent.hero.titleHighlight },
        { section: "hero", key: "subtitle", value: siteContent.hero.subtitle },
        { section: "hero", key: "primaryButton", value: siteContent.hero.primaryButton },
        { section: "hero", key: "secondaryButton", value: siteContent.hero.secondaryButton },
        { section: "hero", key: "searchPlaceholders", value: siteContent.hero.searchPlaceholders },
        { section: "hero", key: "travelerOptions", value: siteContent.hero.travelerOptions },
        { section: "hero", key: "stats", value: siteContent.hero.stats },
        
        // Navigation
        { section: "navigation", key: "items", value: siteContent.navigation },
        
        // Why Choose Us
        { section: "whyChooseUs", key: "title", value: siteContent.whyChooseUs.title },
        { section: "whyChooseUs", key: "subtitle", value: siteContent.whyChooseUs.subtitle },
        { section: "whyChooseUs", key: "features", value: siteContent.whyChooseUs.features },
        { section: "whyChooseUs", key: "stats", value: siteContent.whyChooseUs.stats },
        
        // Footer
        { section: "footer", key: "description", value: siteContent.footer.description },
        { section: "footer", key: "quickLinks", value: siteContent.footer.quickLinks },
        { section: "footer", key: "destinations", value: siteContent.footer.destinations },
        { section: "footer", key: "contact", value: siteContent.footer.contact },
        { section: "footer", key: "newsletter", value: siteContent.footer.newsletter },
        { section: "footer", key: "legal", value: siteContent.footer.legal },
        { section: "footer", key: "copyright", value: siteContent.footer.copyright },
        
        // About content
        { section: "about", key: "hero", value: aboutContent.aboutUs.hero },
        { section: "about", key: "values", value: aboutContent.aboutUs.values },
        { section: "about", key: "story", value: aboutContent.aboutUs.story },
        { section: "about", key: "milestones", value: aboutContent.aboutUs.milestones },
        { section: "about", key: "team", value: aboutContent.aboutUs.team },
        { section: "about", key: "achievements", value: aboutContent.aboutUs.achievements },
        
        // Blog content
        { section: "blog", key: "content", value: blogContent },
        
        // Group tours content
        { section: "groupTours", key: "content", value: groupToursContent },
        
        // Packages content
        { section: "packages", key: "content", value: packagesContent },
        
        // Featured packages section
        { section: "featured-packages", key: "title", value: "Featured Travel Packages" },
        { section: "featured-packages", key: "subtitle", value: "Handpicked destinations and experiences crafted for unforgettable journeys" }
      ]

      console.log(`Migrating ${contentSections.length} content sections...`)
      
      for (const content of contentSections) {
        const { error } = await supabase
          .from('content')
          .upsert([content], { onConflict: 'section,key' })

        if (error) {
          console.error(`Error inserting content ${content.section}.${content.key}:`, error)
        } else {
          console.log(`✓ Migrated content: ${content.section}.${content.key}`)
        }
      }

      console.log(`Migration completed! Migrated ${totalMigrated} packages and ${contentSections.length} content sections`)
      
      toast({
        title: "Migration Successful!",
        description: `Migrated ${totalMigrated} packages and ${contentSections.length} content sections to database.`
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