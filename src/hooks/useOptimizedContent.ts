import { useMemo, useEffect } from 'react'
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"
import { useOptimizedQuery, queryCache } from './useOptimizedQuery'

type DatabaseContent = Database['public']['Tables']['content']['Row']

export const useOptimizedContent = (section?: string) => {
  const queryKey = useMemo(() => ['content', section].filter(Boolean), [section])
  
  const queryFn = async (): Promise<DatabaseContent[]> => {
    // If Supabase is not configured, return empty content
    if (!supabase) {
      return []
    }
    
    let query = supabase.from('content').select('*').order('key', { ascending: true })
    
    if (section) {
      query = query.eq('section', section)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  const result = useOptimizedQuery(queryKey, queryFn, {
    staleTime: 0, // Always fresh - no stale time
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for instant updates
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('content-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'content',
          ...(section && { filter: `section=eq.${section}` })
        },
        (payload) => {
          console.log('Real-time content change detected:', payload)
          // Invalidate cache immediately when content changes
          queryCache.invalidate('content')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [section])

  const getContentValue = (key: string, defaultValue: any = '') => {
    if (!result.data) return defaultValue
    const item = result.data.find(c => c.key === key)
    return item?.value || defaultValue
  }

  return {
    ...result,
    content: result.data || [],
    getContentValue
  }
}

export const useOptimizedContentValue = (section: string, key: string, defaultValue: any = '') => {
  const queryKey = useMemo(() => ['content', section, key], [section, key])
  
  const queryFn = async (): Promise<any> => {
    // If Supabase is not configured, use default value
    if (!supabase) {
      return defaultValue
    }
    
    const { data, error } = await supabase
      .from('content')
      .select('value')
      .eq('section', section)
      .eq('key', key)
      .maybeSingle()
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    return data?.value || defaultValue
  }

  const result = useOptimizedQuery(queryKey, queryFn, {
    enabled: !!(section && key),
    staleTime: 0, // Always fresh
    cacheTime: 1000, // Very short cache time
  })

  // Set up real-time subscription for this specific content value
  useEffect(() => {
    if (!supabase || !section || !key) return

    const channel = supabase
      .channel(`content-${section}-${key}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public', 
          table: 'content',
          filter: `section=eq.${section}`
        },
        (payload: any) => {
          console.log('Real-time content value change detected:', payload)
          // Check if this specific key was affected
          const newKey = payload.new?.key
          const oldKey = payload.old?.key
          if (newKey === key || oldKey === key) {
            queryCache.invalidate('content')
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [section, key])

  return result
}