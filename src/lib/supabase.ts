import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://duouhbzwivonyssvtiqo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1b3VoYnp3aXZvbnlzc3Z0aXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjkzNjIsImV4cCI6MjA3MTEwNTM2Mn0.PjAbI-RLQpL8_hFr29bWdkrIUAPcPWTHgqJGV9CYyQ0'

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create a backup client for production with better error handling
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-client-info': 'travel-agency-app/1.0.0',
    },
  },
  db: {
    schema: 'public',
  },
})

// Remove duplicate client creation - use the official integration client instead

// Helper function to check if Supabase is available
export const useSupabase = () => isSupabaseConfigured

// Re-export types from the official Supabase integration
export type { Database } from '@/integrations/supabase/types'
import type { Database } from '@/integrations/supabase/types'

// Create type aliases for easier use
export type DatabasePackage = Database['public']['Tables']['packages']['Row']

export interface DatabaseContent {
  id: string
  section: string
  key: string
  value: any
  created_at?: string
  updated_at?: string
}