import { useMemo } from 'react'
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"
import { useOptimizedQuery } from './useOptimizedQuery'

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
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  })

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

  return useOptimizedQuery(queryKey, queryFn, {
    enabled: !!(section && key),
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  })
}