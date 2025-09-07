import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export const useAdminAccess = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const { data: isAdminResult, error } = await supabase
          .rpc('is_admin')
        
        if (error) {
          console.error('Admin check error:', error)
          setIsAdmin(false)
        } else {
          setIsAdmin(isAdminResult || false)
        }
      } catch (rpcError) {
        console.error('RPC call failed:', rpcError)
        // Fallback: if RPC fails completely, assume non-admin for security
        setIsAdmin(false)
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Admin access check error:', error)
      setIsAdmin(false)
      setLoading(false)
    }
  }

  const logAdminAction = async (action: string, tableName: string, recordId?: string) => {
    try {
      await supabase.rpc('log_admin_action', {
        _action: action,
        _table_name: tableName,
        _record_id: recordId
      })
    } catch (error) {
      console.error('Audit logging error:', error)
    }
  }

  const requireAdmin = (callback: () => void) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to perform this action.",
        variant: "destructive"
      })
      return
    }
    callback()
  }

  return {
    isAdmin,
    loading,
    checkAdminAccess,
    logAdminAction,
    requireAdmin
  }
}