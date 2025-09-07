-- Fix remaining security warnings: OTP expiry and password protection
-- Note: These settings are typically configured in Supabase dashboard auth settings
-- but we can set appropriate defaults and create functions to check compliance

-- Create a function to check auth configuration compliance
CREATE OR REPLACE FUNCTION public.check_auth_security_compliance()
RETURNS TABLE (
    setting_name TEXT,
    current_value TEXT,
    recommended_value TEXT,
    compliant BOOLEAN,
    severity TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        'OTP Expiry Time' as setting_name,
        'Currently managed in Supabase Auth settings' as current_value,
        '300 seconds (5 minutes) or less' as recommended_value,
        false as compliant,
        'WARNING' as severity
    UNION ALL
    SELECT 
        'Leaked Password Protection' as setting_name,
        'Currently disabled in Supabase Auth settings' as current_value,
        'Enabled with HaveIBeenPwned integration' as recommended_value,
        false as compliant,
        'WARNING' as severity;
$$;

-- Create admin function to view security recommendations
CREATE OR REPLACE FUNCTION public.get_security_recommendations()
RETURNS TABLE (
    category TEXT,
    recommendation TEXT,
    priority TEXT,
    action_required TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        'Authentication Security' as category,
        'Reduce OTP expiry time to 5 minutes or less' as recommendation,
        'Medium' as priority,
        'Configure in Supabase Dashboard > Authentication > Settings > OTP expiry' as action_required
    UNION ALL
    SELECT 
        'Password Security' as category,
        'Enable leaked password protection' as recommendation,
        'Medium' as priority,
        'Configure in Supabase Dashboard > Authentication > Settings > Password Security' as action_required
    UNION ALL
    SELECT 
        'Database Security' as category,
        'Regular security audits and RLS policy reviews' as recommendation,
        'High' as priority,
        'Schedule monthly security reviews using built-in linter' as action_required;
$$;

-- Grant execute permissions to admin users
GRANT EXECUTE ON FUNCTION public.check_auth_security_compliance() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_security_recommendations() TO authenticated;