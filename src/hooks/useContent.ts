import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured, type DatabaseContent } from '@/lib/supabase'

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
      if (!isSupabaseConfigured || !supabase) {
        setContent([])
        setLoading(false)
        return
      }
      
      let query = supabase.from('content').select('*')
      
      if (section) {
        query = query.eq('section', section)
      }
      
      const { data, error } = await query.order('key', { ascending: true })
      
      if (error) throw error
      setContent(data || [])
      
    } catch (err: any) {
      setError(err.message)
      console.error('Error loading content:', err)
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
      if (!isSupabaseConfigured || !supabase) {
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