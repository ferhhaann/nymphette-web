import { useMemo, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import { useOptimizedQuery, queryCache } from './useOptimizedQuery'

type DatabaseBlogPost = Database['public']['Tables']['blog_posts']['Row']
type DatabaseBlogCategory = Database['public']['Tables']['blog_categories']['Row']
type DatabaseAuthor = Database['public']['Tables']['authors']['Row']

export const useOptimizedBlogPosts = () => {
  const queryKey = ['blog_posts']
  
  const queryFn = async (): Promise<DatabaseBlogPost[]> => {
    if (!supabase) {
      return []
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  const result = useOptimizedQuery(queryKey, queryFn, {
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for blog posts
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('blog-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_posts',
        },
        (payload) => {
          console.log('Real-time blog posts change detected:', payload)
          queryCache.invalidate('blog_posts')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return result
}

export const useOptimizedBlogCategories = () => {
  const queryKey = ['blog_categories']
  
  const queryFn = async (): Promise<DatabaseBlogCategory[]> => {
    if (!supabase) {
      return []
    }
    
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  const result = useOptimizedQuery(queryKey, queryFn, {
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for blog categories
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('blog-categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_categories',
        },
        (payload) => {
          console.log('Real-time blog categories change detected:', payload)
          queryCache.invalidate('blog_categories')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return result
}

export const useOptimizedAuthors = () => {
  const queryKey = ['authors']
  
  const queryFn = async (): Promise<DatabaseAuthor[]> => {
    if (!supabase) {
      return []
    }
    
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  const result = useOptimizedQuery(queryKey, queryFn, {
    staleTime: 0, // Always fresh for admin changes
    cacheTime: 1000, // Very short cache time for instant updates
  })

  // Set up real-time subscription for authors
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('authors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'authors',
        },
        (payload) => {
          console.log('Real-time authors change detected:', payload)
          queryCache.invalidate('authors')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return result
}