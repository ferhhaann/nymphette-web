import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseAutoLogoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onLogout?: () => void;
}

export const useAutoLogout = ({ 
  timeoutMinutes = 7, 
  warningMinutes = 1,
  onLogout 
}: UseAutoLogoutOptions = {}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      onLogout?.();
      toast.error('You have been logged out due to inactivity for security reasons.');
    } catch (error) {
      console.error('Auto logout error:', error);
    }
  }, [onLogout]);

  const showWarning = useCallback(() => {
    toast.warning(`You will be logged out in ${warningMinutes} minute(s) due to inactivity.`, {
      duration: warningMinutes * 60 * 1000, // Show warning for the remaining time
    });
  }, [warningMinutes]);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Set warning timer (shows warning before logout)
    const warningTime = (timeoutMinutes - warningMinutes) * 60 * 1000;
    if (warningTime > 0) {
      warningTimeoutRef.current = setTimeout(showWarning, warningTime);
    }

    // Set logout timer
    timeoutRef.current = setTimeout(logout, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes, warningMinutes, logout, showWarning]);

  const handleActivity = useCallback(() => {
    // Only reset if significant time has passed to avoid too frequent resets
    const now = Date.now();
    if (now - lastActivityRef.current > 10000) { // 10 seconds threshold
      resetTimer();
    }
  }, [resetTimer]);

  useEffect(() => {
    // Check if user is authenticated before setting up auto logout
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        resetTimer();
      }
    };

    checkAuth();

    // Activity event listeners
    const events = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        resetTimer();
      } else if (event === 'SIGNED_OUT') {
        // Clear timers when user signs out
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      }
    });

    return () => {
      // Cleanup
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      subscription.unsubscribe();
    };
  }, [handleActivity, resetTimer]);

  return {
    resetTimer,
    lastActivity: lastActivityRef.current
  };
};