import { useMemo, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import { useOptimizedQuery, queryCache } from './useOptimizedQuery'

type DatabaseSEOSettings = Database['public']['Tables']['seo_settings']['Row']

export const useOptimizedSEOSettings = () => {
  const queryKey = ['seo_settings']
  
  const queryFn = async (): Promise<DatabaseSEOSettings[]> => {
    if (!supabase) {
      return []
    }
    
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .order('page_url', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  const result = useOptimizedQuery(queryKey, queryFn, {
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for SEO settings
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('seo-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'seo_settings',
        },
        (payload) => {
          console.log('Real-time SEO settings change detected:', payload)
          queryCache.invalidate('seo_settings')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return result
}

export const useOptimizedSEOSettingsByPageUrl = (pageUrl: string) => {
  const queryKey = useMemo(() => ['seo_settings', pageUrl], [pageUrl])
  
  const queryFn = async (): Promise<DatabaseSEOSettings | null> => {
    if (!supabase) {
      return null
    }
    
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_url', pageUrl)
      .eq('is_active', true)
      .maybeSingle()
    
    if (error) throw error
    return data
  }

  const result = useOptimizedQuery(queryKey, queryFn, {
    enabled: !!pageUrl,
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for this specific page's SEO settings
  useEffect(() => {
    if (!supabase || !pageUrl) return

    const channel = supabase
      .channel(`seo-settings-${pageUrl}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'seo_settings',
        },
        (payload) => {
          console.log('Real-time SEO settings change detected:', payload)
          queryCache.invalidate('seo_settings')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [pageUrl])

  return result
}