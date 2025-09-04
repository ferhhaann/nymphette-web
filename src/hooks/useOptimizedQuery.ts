import { useState, useEffect, useRef, useCallback } from 'react'

interface QueryOptions {
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
  refetchOnWindowFocus?: boolean
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class QueryCache {
  private cache = new Map<string, CacheEntry<any>>()
  private storageKey = 'lovable-query-cache'
  
  constructor() {
    // Load cache from localStorage on initialization
    this.loadFromStorage()
  }
  
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const parsedCache = JSON.parse(stored)
        const now = Date.now()
        
        // Filter out expired entries
        Object.entries(parsedCache).forEach(([key, entry]: [string, any]) => {
          if (entry.expiresAt > now) {
            this.cache.set(key, entry)
          }
        })
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error)
    }
  }
  
  private saveToStorage() {
    try {
      const cacheObj: Record<string, CacheEntry<any>> = {}
      this.cache.forEach((value, key) => {
        cacheObj[key] = value
      })
      localStorage.setItem(this.storageKey, JSON.stringify(cacheObj))
    } catch (error) {
      console.warn('Failed to save cache to storage:', error)
    }
  }
  
  get<T>(key: string, staleTime: number = 5 * 60 * 1000): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    const now = Date.now()
    if (now > entry.expiresAt) {
      this.cache.delete(key)
      this.saveToStorage()
      return null
    }
    
    return entry.data
  }
  
  set<T>(key: string, data: T, cacheTime: number = 10 * 60 * 1000): void {
    const now = Date.now()
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + cacheTime
    })
    this.saveToStorage()
  }
  
  invalidate(keyPattern?: string): void {
    if (!keyPattern) {
      this.cache.clear()
      localStorage.removeItem(this.storageKey)
      return
    }
    
    for (const key of this.cache.keys()) {
      if (key.includes(keyPattern)) {
        this.cache.delete(key)
      }
    }
    this.saveToStorage()
  }
}

const queryCache = new QueryCache()

export function useOptimizedQuery<T>(
  key: string | string[],
  queryFn: () => Promise<T>,
  options: QueryOptions = {}
) {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  const queryKey = Array.isArray(key) ? key.join('|') : key

  const executeQuery = useCallback(async (force = false) => {
    if (!enabled) return

    // Check cache first
    if (!force) {
      const cachedData = queryCache.get<T>(queryKey, staleTime)
      if (cachedData) {
        setData(cachedData)
        setLoading(false)
        return
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    
    try {
      setLoading(true)
      setError(null)
      
      const result = await queryFn()
      
      if (!abortControllerRef.current.signal.aborted) {
        setData(result)
        queryCache.set(queryKey, result, cacheTime)
      }
    } catch (err: any) {
      if (!abortControllerRef.current.signal.aborted) {
        setError(err.message)
        console.error('Query error:', err)
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setLoading(false)
      }
    }
  }, [enabled, queryKey, staleTime, cacheTime, queryFn])

  const refetch = useCallback(() => executeQuery(true), [executeQuery])

  useEffect(() => {
    executeQuery()
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [executeQuery])

  useEffect(() => {
    if (!refetchOnWindowFocus) return

    const handleFocus = () => executeQuery()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [executeQuery, refetchOnWindowFocus])

  return { data, loading, error, refetch }
}

export { queryCache }