import { useMemo, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import { useOptimizedQuery, queryCache } from './useOptimizedQuery'

type DatabaseCountry = Database['public']['Tables']['countries']['Row']

export const useOptimizedCountries = (region?: string) => {
  const queryKey = useMemo(() => ['countries', region].filter(Boolean), [region])
  
  const queryFn = async (): Promise<DatabaseCountry[]> => {
    if (!supabase) {
      return []
    }
    
    let query = supabase
      .from('countries')
      .select('*')
      .order('name', { ascending: true })
    
    if (region) {
      query = query.eq('region', region)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  const result = useOptimizedQuery(queryKey, queryFn, {
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for countries
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('countries-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'countries',
        },
        (payload) => {
          console.log('Real-time countries change detected:', payload)
          queryCache.invalidate('countries')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [region])

  return result
}

export const useOptimizedCountryById = (countryId: string) => {
  const queryKey = useMemo(() => ['country', countryId], [countryId])
  
  const queryFn = async (): Promise<DatabaseCountry | null> => {
    if (!supabase) {
      return null
    }
    
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('id', countryId)
      .maybeSingle()
    
    if (error) throw error
    return data
  }

  const result = useOptimizedQuery(queryKey, queryFn, {
    enabled: !!countryId,
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for this specific country
  useEffect(() => {
    if (!supabase || !countryId) return

    const channel = supabase
      .channel(`country-${countryId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'countries',
        },
        (payload) => {
          console.log('Real-time country change detected:', payload)
          queryCache.invalidate('countries')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [countryId])

  return result
}