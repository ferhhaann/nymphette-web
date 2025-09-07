import { supabase } from '@/integrations/supabase/client'

/**
 * Get author public information without exposing email addresses
 */
export const getAuthorPublicInfo = async (authorId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_author_public_info', { author_id: authorId })
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching author public info:', error)
    return { data: null, error }
  }
}

/**
 * Get all authors with public information only (no emails)
 */
export const getAllAuthorsPublic = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_authors_public')

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching authors:', error)
    return { data: null, error }
  }
}

/**
 * Get essential contact information that's safe for public access
 */
export const getPublicContactInfo = async () => {
  try {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .eq('section', 'public')
      .in('key', ['phone', 'email', 'address', 'hours', 'social_media'])

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching public contact info:', error)
    return { data: null, error }
  }
}

/**
 * Create enquiry with audit logging
 */
export const createSecureEnquiry = async (enquiryData: any) => {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .insert([enquiryData])
      .select()
      .single()

    if (error) throw error

    // Log the enquiry creation for audit purposes
    try {
      await supabase.rpc('log_admin_action', {
        _action: 'enquiry_created',
        _table_name: 'enquiries',
        _record_id: data.id
      })
    } catch (logError) {
      console.warn('Failed to log enquiry creation:', logError)
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error creating enquiry:', error)
    return { data: null, error }
  }
}