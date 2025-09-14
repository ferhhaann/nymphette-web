import { useMemo, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import { useOptimizedQuery, queryCache } from './useOptimizedQuery'

type DatabaseGroupTour = Database['public']['Tables']['group_tours']['Row']
type DatabaseGroupTourCategory = Database['public']['Tables']['group_tour_categories']['Row']

export const useOptimizedGroupTours = () => {
  const queryKey = ['group_tours']
  
  const queryFn = async (): Promise<DatabaseGroupTour[]> => {
    if (!supabase) {
      return []
    }
    
    const { data, error } = await supabase
      .from('group_tours')
      .select('*')
      .order('start_date', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  const result = useOptimizedQuery(queryKey, queryFn, {
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for group tours
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('group-tours-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_tours',
        },
        (payload) => {
          console.log('Real-time group tours change detected:', payload)
          queryCache.invalidate('group_tours')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return result
}

export const useOptimizedGroupTourCategories = () => {
  const queryKey = ['group_tour_categories']
  
  const queryFn = async (): Promise<DatabaseGroupTourCategory[]> => {
    if (!supabase) {
      return []
    }
    
    const { data, error } = await supabase
      .from('group_tour_categories')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  const result = useOptimizedQuery(queryKey, queryFn, {
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for group tour categories
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('group-tour-categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_tour_categories',
        },
        (payload) => {
          console.log('Real-time group tour categories change detected:', payload)
          queryCache.invalidate('group_tour_categories')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return result
}