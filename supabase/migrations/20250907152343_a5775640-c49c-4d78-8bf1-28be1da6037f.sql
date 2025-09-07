-- FINAL SECURITY VERIFICATION AND ENFORCEMENT
-- Ensure RLS is properly enforced on all sensitive tables

-- Force RLS to be enabled and disable any bypass mechanisms
ALTER TABLE public.contact_submissions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries FORCE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.authors FORCE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log FORCE ROW LEVEL SECURITY;

-- Remove any default grants that might bypass RLS
REVOKE ALL ON public.contact_submissions FROM public;
REVOKE ALL ON public.enquiries FROM public;
REVOKE ALL ON public.blog_comments FROM public;
REVOKE ALL ON public.authors FROM public;
REVOKE ALL ON public.admin_audit_log FROM public;

-- Grant only specific permissions needed for the policies to work
GRANT INSERT ON public.contact_submissions TO public;
GRANT INSERT ON public.enquiries TO public;
GRANT INSERT ON public.blog_comments TO public;

-- Ensure authenticated role has necessary permissions
GRANT ALL ON public.contact_submissions TO authenticated;
GRANT ALL ON public.enquiries TO authenticated;
GRANT ALL ON public.blog_comments TO authenticated;
GRANT ALL ON public.authors TO authenticated;
GRANT ALL ON public.admin_audit_log TO authenticated;

-- Add additional security measures
GRANT USAGE ON SCHEMA public TO public;
GRANT USAGE ON SCHEMA public TO authenticated;