import { useMemo, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import { useOptimizedQuery, queryCache } from './useOptimizedQuery'

type DatabaseEnquiry = Database['public']['Tables']['enquiries']['Row']
type DatabaseContactSubmission = Database['public']['Tables']['contact_submissions']['Row']

export const useOptimizedEnquiries = () => {
  const queryKey = ['enquiries']
  
  const queryFn = async (): Promise<DatabaseEnquiry[]> => {
    if (!supabase) {
      return []
    }
    
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  const result = useOptimizedQuery(queryKey, queryFn, {
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for enquiries
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('enquiries-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'enquiries',
        },
        (payload) => {
          console.log('Real-time enquiries change detected:', payload)
          queryCache.invalidate('enquiries')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return result
}

export const useOptimizedContactSubmissions = () => {
  const queryKey = ['contact_submissions']
  
  const queryFn = async (): Promise<DatabaseContactSubmission[]> => {
    if (!supabase) {
      return []
    }
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  const result = useOptimizedQuery(queryKey, queryFn, {
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for contact submissions
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('contact-submissions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_submissions',
        },
        (payload) => {
          console.log('Real-time contact submissions change detected:', payload)
          queryCache.invalidate('contact_submissions')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return result
}