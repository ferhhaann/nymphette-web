import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://duouhbzwivonyssvtiqo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1b3VoYnp3aXZvbnlzc3Z0aXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjkzNjIsImV4cCI6MjA3MTEwNTM2Mn0.PjAbI-RLQpL8_hFr29bWdkrIUAPcPWTHgqJGV9CYyQ0'

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Only create Supabase client if environment variables are available
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to check if Supabase is available
export const useSupabase = () => isSupabaseConfigured

// Database types
export interface DatabasePackage {
  id: string
  title: string
  country: string
  country_slug?: string
  region: string
  duration: string
  price: string
  original_price?: string
  rating: number
  reviews: number
  image: string
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  category: string
  best_time: string
  group_size: string
  overview_section_title?: string
  overview_description?: string
  overview_highlights_label?: string
  overview_badge_variant?: string
  overview_badge_style?: string
  itinerary: any[]
  featured?: boolean
  created_at?: string
  updated_at?: string
}

export interface DatabaseContent {
  id: string
  section: string
  key: string
  value: any
  created_at?: string
  updated_at?: string
}