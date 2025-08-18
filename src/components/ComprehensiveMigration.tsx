import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/integrations/supabase/client"
import { packagesData } from "@/data/packagesData"
import { useToast } from "@/hooks/use-toast"
import { Database, Download, CheckCircle } from "lucide-react"
import siteContent from "@/data/siteContent.json"
import aboutContent from "@/data/aboutContent.json"
import blogContent from "@/data/blogContent.json"
import groupToursContent from "@/data/groupToursContent.json"
import packagesContent from "@/data/packagesContent.json"
import packageDetailContent from "@/data/packageDetailContent.json"
import africaRegion from "@/data/regions/africa.json"
import americasRegion from "@/data/regions/americas.json"
import asiaRegion from "@/data/regions/asia.json"
import europeRegion from "@/data/regions/europe.json"
import middleEastRegion from "@/data/regions/middleEast.json"
import pacificIslandsRegion from "@/data/regions/pacificIslands.json"
import africaDetails from "@/data/countryDetails/africa.json"
import americasDetails from "@/data/countryDetails/americas.json"
import asiaDetails from "@/data/countryDetails/asia.json"
import europeDetails from "@/data/countryDetails/europe.json"
import middleEastDetails from "@/data/countryDetails/middle-east.json"
import pacificIslandsDetails from "@/data/countryDetails/pacific-islands.json"

// Generate a valid UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const ComprehensiveMigration = () => {
  const [migrating, setMigrating] = useState(false)
  const [migrated, setMigrated] = useState(false)
  const [hasData, setHasData] = useState(false)
  const [checking, setChecking] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentTask, setCurrentTask] = useState("")
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

  const updateProgress = (value: number, task: string) => {
    setProgress(value)
    setCurrentTask(task)
  }

  const migrateAllData = async () => {
    if (!supabase) return
    
    setMigrating(true)
    setProgress(0)
    
    try {
      console.log("Starting comprehensive data migration...")
      
      // 1. Clear existing data
      updateProgress(5, "Clearing existing data...")
      const { error: deletePackagesError } = await supabase
        .from('packages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
      
      const { error: deleteContentError } = await supabase
        .from('content')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

      if (deletePackagesError) throw deletePackagesError
      if (deleteContentError) throw deleteContentError

      let totalMigrated = 0

      // 2. Migrate travel packages
      updateProgress(10, "Migrating travel packages...")
      for (const [region, packages] of Object.entries(packagesData)) {
        console.log(`Migrating ${packages.length} packages from ${region}...`)
        
        for (const pkg of packages) {
          const dbPackage = {
            id: generateUUID(),
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
            totalMigrated++
          }
        }
      }

      // 3. Migrate site content
      updateProgress(30, "Migrating site content...")
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
        { section: "hero", key: "searchPlaceholders", value: JSON.stringify(siteContent.hero.searchPlaceholders) },
        { section: "hero", key: "travelerOptions", value: JSON.stringify(siteContent.hero.travelerOptions) },
        { section: "hero", key: "stats", value: JSON.stringify(siteContent.hero.stats) },
        
        // Navigation
        { section: "navigation", key: "items", value: JSON.stringify(siteContent.navigation) },
        
        // Why Choose Us
        { section: "whyChooseUs", key: "title", value: siteContent.whyChooseUs.title },
        { section: "whyChooseUs", key: "subtitle", value: siteContent.whyChooseUs.subtitle },
        { section: "whyChooseUs", key: "features", value: JSON.stringify(siteContent.whyChooseUs.features) },
        { section: "whyChooseUs", key: "stats", value: JSON.stringify(siteContent.whyChooseUs.stats) },
        
        // Footer
        { section: "footer", key: "description", value: siteContent.footer.description },
        { section: "footer", key: "quickLinks", value: JSON.stringify(siteContent.footer.quickLinks) },
        { section: "footer", key: "destinations", value: JSON.stringify(siteContent.footer.destinations) },
        { section: "footer", key: "contact", value: JSON.stringify(siteContent.footer.contact) },
        { section: "footer", key: "newsletter", value: JSON.stringify(siteContent.footer.newsletter) },
        { section: "footer", key: "legal", value: JSON.stringify(siteContent.footer.legal) },
        { section: "footer", key: "copyright", value: siteContent.footer.copyright },
      ]

      // 4. Migrate about content
      updateProgress(45, "Migrating about content...")
      contentSections.push(
        { section: "about", key: "hero", value: JSON.stringify(aboutContent.aboutUs.hero) },
        { section: "about", key: "values", value: JSON.stringify(aboutContent.aboutUs.values) },
        { section: "about", key: "story", value: JSON.stringify(aboutContent.aboutUs.story) },
        { section: "about", key: "milestones", value: JSON.stringify(aboutContent.aboutUs.milestones) },
        { section: "about", key: "team", value: JSON.stringify(aboutContent.aboutUs.team) },
        { section: "about", key: "achievements", value: JSON.stringify(aboutContent.aboutUs.achievements) }
      )

      // 5. Migrate other content
      updateProgress(55, "Migrating blog and other content...")
      contentSections.push(
        { section: "blog", key: "content", value: JSON.stringify(blogContent) },
        { section: "groupTours", key: "content", value: JSON.stringify(groupToursContent) },
        { section: "packages", key: "content", value: JSON.stringify(packagesContent) },
        { section: "packageDetail", key: "content", value: JSON.stringify(packageDetailContent) }
      )

      // 6. Migrate region data
      updateProgress(70, "Migrating region data...")
      const regionData = [
        { section: "regions", key: "africa", value: JSON.stringify(africaRegion) },
        { section: "regions", key: "americas", value: JSON.stringify(americasRegion) },
        { section: "regions", key: "asia", value: JSON.stringify(asiaRegion) },
        { section: "regions", key: "europe", value: JSON.stringify(europeRegion) },
        { section: "regions", key: "middleEast", value: JSON.stringify(middleEastRegion) },
        { section: "regions", key: "pacificIslands", value: JSON.stringify(pacificIslandsRegion) }
      ]
      contentSections.push(...regionData)

      // 7. Migrate country details
      updateProgress(85, "Migrating country details...")
      const countryDetailsData = [
        { section: "countryDetails", key: "africa", value: JSON.stringify(africaDetails) },
        { section: "countryDetails", key: "americas", value: JSON.stringify(americasDetails) },
        { section: "countryDetails", key: "asia", value: JSON.stringify(asiaDetails) },
        { section: "countryDetails", key: "europe", value: JSON.stringify(europeDetails) },
        { section: "countryDetails", key: "middleEast", value: JSON.stringify(middleEastDetails) },
        { section: "countryDetails", key: "pacificIslands", value: JSON.stringify(pacificIslandsDetails) }
      ]
      contentSections.push(...countryDetailsData)

      // Insert all content
      updateProgress(90, "Saving content to database...")
      for (const content of contentSections) {
        const { error } = await supabase
          .from('content')
          .upsert([content], { onConflict: 'section,key' })

        if (error) {
          console.error(`Error inserting content ${content.section}.${content.key}:`, error)
        }
      }

      updateProgress(100, "Migration complete!")
      
      console.log(`Migration completed! Migrated ${totalMigrated} packages and ${contentSections.length} content sections`)
      
      toast({
        title: "Complete Migration Successful!",
        description: `Migrated ${totalMigrated} packages, ${contentSections.length} content sections, region data, and country details to database.`
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

  if (migrated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            All Data Migrated!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your complete data has been successfully migrated to the database. You can now refresh the page.
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
          Complete Data Migration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Migrate ALL data from your data folder including travel packages, site content, region data, country details, blog posts, and more.
        </p>
        
        {migrating && (
          <div className="mb-4">
            <Progress value={progress} className="mb-2" />
            <p className="text-xs text-muted-foreground">{currentTask}</p>
          </div>
        )}
        
        <Button 
          onClick={migrateAllData} 
          disabled={migrating}
          className="w-full"
        >
          {migrating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Migrating All Data...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Migrate All Data to Database
            </>
          )}
        </Button>
        
        <div className="mt-3 text-xs text-muted-foreground">
          <p>This will migrate:</p>
          <ul className="list-disc list-inside ml-2 mt-1">
            <li>All travel packages from all regions</li>
            <li>Site content (hero, navigation, footer)</li>
            <li>About page content</li>
            <li>Blog posts and content</li>
            <li>Region and country data</li>
            <li>Package detail templates</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}