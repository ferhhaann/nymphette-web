import { supabase } from "@/integrations/supabase/client"
import { packagesData } from "@/data/packagesData"
import type { TravelPackage } from "@/data/packagesData"

// Migration script to move JSON data to Supabase
export const migratePackagesToDatabase = async () => {
  console.log("Starting package migration...")
  
  try {
    // Clear existing packages
    const { error: deleteError } = await supabase
      .from('packages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (deleteError) {
      console.error("Error clearing packages:", deleteError)
      return
    }

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
          itinerary: JSON.stringify(pkg.itinerary),
          slug: `${pkg.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${pkg.id.slice(0, 8)}`,
          featured: false // Set default featured status
        }

        const { error } = await supabase
          .from('packages')
          .insert([dbPackage])

        if (error) {
          console.error(`Error inserting package ${pkg.title}:`, error)
        } else {
          console.log(`✓ Migrated: ${pkg.title}`)
        }
      }
    }

    console.log("Package migration completed!")
    
    // Also migrate some default content
    await migrateDefaultContent()
    
  } catch (error) {
    console.error("Migration failed:", error)
  }
}

const migrateDefaultContent = async () => {
  console.log("Migrating default content...")
  
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
      section: "hero",
      key: "cta_text",
      value: "Explore Packages"
    },
    {
      section: "why-choose-us",
      key: "title",
      value: "Why Choose Us"
    },
    {
      section: "why-choose-us", 
      key: "description",
      value: "We provide exceptional travel experiences with expert guidance, competitive prices, and 24/7 support."
    },
    {
      section: "promo-banner",
      key: "title",
      value: "Special Offer"
    },
    {
      section: "promo-banner",
      key: "discount", 
      value: "20% OFF"
    },
    {
      section: "promo-banner",
      key: "description",
      value: "Book your dream vacation today and save on selected packages. Limited time offer!"
    }
  ]

  for (const content of defaultContent) {
    const { error } = await supabase
      .from('content')
      .upsert([content], { onConflict: 'section,key' })

    if (error) {
      console.error(`Error inserting content ${content.section}.${content.key}:`, error)
    } else {
      console.log(`✓ Migrated content: ${content.section}.${content.key}`)
    }
  }

  console.log("Content migration completed!")
}

// Helper function to run migration from browser console
// Call this in browser: window.migrateData()
if (typeof window !== 'undefined') {
  (window as any).migrateData = migratePackagesToDatabase
}