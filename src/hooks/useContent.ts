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
      
      // Add timeout and retry logic for production
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const queryPromise = query.order('key', { ascending: true })
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      setContent(data || [])
      
    } catch (err: any) {
      console.error('Error loading content:', err)
      setError(err.message)
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