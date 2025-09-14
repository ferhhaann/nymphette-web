import { useState, useEffect } from 'react'
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"

type DatabaseContent = Database['public']['Tables']['content']['Row']

export const useContent = (section?: string) => {
  const [content, setContent] = useState<DatabaseContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadContent()
    
    // Set up real-time subscription for instant updates
    if (supabase) {
      const channel = supabase
        .channel(`content-hook-${section || 'all'}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'content',
            ...(section && { filter: `section=eq.${section}` })
          },
          (payload: any) => {
            console.log('Real-time content change detected in useContent:', payload)
            // Reload content immediately when changes are detected
            loadContent()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [section])

  const loadContent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // If Supabase is not configured, return empty content (will use defaults)
      if (!supabase) {
        setContent([])
        setLoading(false)
        return
      }
      
      let query = supabase.from('content').select('*')
      
      if (section) {
        query = query.eq('section', section)
      }
      
      // Multiple retry attempts for different regions
      let lastError;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Attempt ${attempt} to load content for section: ${section || 'all'}`);
          
          // Shorter timeout for each attempt
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Request timeout (attempt ${attempt})`)), 8000)
          )
          
          const queryPromise = query.order('key', { ascending: true })
          
          const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any
          
          if (error) {
            console.error(`Supabase error (attempt ${attempt}):`, error)
            lastError = error;
            
            // If it's a network error, try again
            if (attempt < maxRetries && (error.message?.includes('fetch') || error.message?.includes('network'))) {
              console.log(`Retrying in ${attempt * 1000}ms...`);
              await new Promise(resolve => setTimeout(resolve, attempt * 1000));
              continue;
            }
            throw error;
          }
          
          console.log(`Successfully loaded ${data?.length || 0} content items`);
          setContent(data || [])
          return; // Success - exit retry loop
          
        } catch (err: any) {
          lastError = err;
          console.error(`Attempt ${attempt} failed:`, err);
          
          if (attempt < maxRetries) {
            console.log(`Waiting ${attempt * 2000}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 2000));
          }
        }
      }
      
      // All attempts failed
      throw lastError;
      
    } catch (err: any) {
      console.error('All content loading attempts failed:', err)
      setError(`Failed to load content: ${err.message}. Please check your internet connection and try again.`)
      // In production, use fallback content if available
      setContent([])
    } finally {
      setLoading(false)
    }
  }

  const getContentValue = (key: string, defaultValue: any = '') => {
    const item = content.find(c => c.key === key)
    return item?.value || defaultValue
  }

  return { content, loading, error, getContentValue, refetch: loadContent }
}

export const useContentValue = (section: string, key: string, defaultValue: any = '') => {
  const [value, setValue] = useState(defaultValue)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContentValue()
  }, [section, key])

  const loadContentValue = async () => {
    try {
      setLoading(true)
      
      // If Supabase is not configured, use default value
      if (!supabase) {
        setValue(defaultValue)
        setLoading(false)
        return
      }
      
      const { data, error } = await supabase
        .from('content')
        .select('value')
        .eq('section', section)
        .eq('key', key)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      setValue(data?.value || defaultValue)
      
    } catch (err: any) {
      console.error('Error loading content value:', err)
      setValue(defaultValue)
    } finally {
      setLoading(false)
    }
  }

  return { value, loading, refetch: loadContentValue }
}