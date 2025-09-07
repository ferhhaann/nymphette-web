import DOMPurify from 'dompurify'
import { supabase } from '@/integrations/supabase/client'

// Input validation and sanitization utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  if (!phone) return true // Phone is optional
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

export const sanitizeInput = (input: string): string => {
  if (!input) return ''
  // Remove potentially harmful content
  return DOMPurify.sanitize(input.trim(), { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
}

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`
  }
  return null
}

export const validateLength = (value: string, min: number, max: number, fieldName: string): string | null => {
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`
  }
  if (value.length > max) {
    return `${fieldName} must not exceed ${max} characters`
  }
  return null
}

// Rate limiting check (client-side helper)
const rateLimitStorage: { [key: string]: { count: number; lastReset: number } } = {}

export const checkClientRateLimit = (formType: string, maxRequests = 3, windowMinutes = 60): boolean => {
  const now = Date.now()
  const windowMs = windowMinutes * 60 * 1000
  const key = `${formType}_rate_limit`
  
  if (!rateLimitStorage[key]) {
    rateLimitStorage[key] = { count: 1, lastReset: now }
    return true
  }
  
  const limit = rateLimitStorage[key]
  
  // Reset if window expired
  if (now - limit.lastReset > windowMs) {
    limit.count = 1
    limit.lastReset = now
    return true
  }
  
  // Check if under limit
  if (limit.count >= maxRequests) {
    return false
  }
  
  limit.count++
  return true
}

// Secure contact form submission
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export const submitSecureContactForm = async (formData: ContactFormData): Promise<{ success: boolean; error?: string }> => {
  // Client-side rate limiting
  if (!checkClientRateLimit('contact', 3, 60)) {
    return { success: false, error: 'Too many requests. Please wait before submitting again.' }
  }
  
  // Validate required fields
  const requiredError = validateRequired(formData.name, 'Name') || 
                       validateRequired(formData.email, 'Email') ||
                       validateRequired(formData.message, 'Message')
  if (requiredError) {
    return { success: false, error: requiredError }
  }
  
  // Validate email format
  if (!validateEmail(formData.email)) {
    return { success: false, error: 'Invalid email format' }
  }
  
  // Validate phone if provided
  if (formData.phone && !validatePhone(formData.phone)) {
    return { success: false, error: 'Invalid phone number format' }
  }
  
  // Validate field lengths
  const lengthError = validateLength(formData.name, 1, 100, 'Name') ||
                     validateLength(formData.email, 5, 254, 'Email') ||
                     validateLength(formData.message, 10, 2000, 'Message')
  if (lengthError) {
    return { success: false, error: lengthError }
  }
  
  // Sanitize inputs
  const sanitizedData = {
    name: sanitizeInput(formData.name),
    email: sanitizeInput(formData.email),
    phone: formData.phone ? sanitizeInput(formData.phone) : null,
    subject: formData.subject ? sanitizeInput(formData.subject) : null,
    message: sanitizeInput(formData.message)
  }
  
  try {
    // Use direct insert since we have secure policies in place
    const { error } = await supabase
      .from('contact_submissions')
      .insert([sanitizedData])
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Contact form submission error:', error)
    return { success: false, error: 'Failed to submit form. Please try again.' }
  }
}

// Secure enquiry form submission
export interface EnquiryFormData {
  name: string
  email: string
  phone?: string
  message?: string
  source: string
  source_id?: string
  destination?: string
  travel_date?: string
  travelers?: number
}

export const submitSecureEnquiry = async (formData: EnquiryFormData): Promise<{ success: boolean; error?: string }> => {
  // Client-side rate limiting
  if (!checkClientRateLimit('enquiry', 5, 60)) {
    return { success: false, error: 'Too many requests. Please wait before submitting again.' }
  }
  
  // Validate required fields
  const requiredError = validateRequired(formData.name, 'Name') || 
                       validateRequired(formData.email, 'Email')
  if (requiredError) {
    return { success: false, error: requiredError }
  }
  
  // Validate email format
  if (!validateEmail(formData.email)) {
    return { success: false, error: 'Invalid email format' }
  }
  
  // Validate phone if provided
  if (formData.phone && !validatePhone(formData.phone)) {
    return { success: false, error: 'Invalid phone number format' }
  }
  
  // Validate field lengths
  const lengthError = validateLength(formData.name, 1, 100, 'Name') ||
                     validateLength(formData.email, 5, 254, 'Email')
  if (lengthError) {
    return { success: false, error: lengthError }
  }
  
  // Sanitize inputs
  const sanitizedData = {
    name: sanitizeInput(formData.name),
    email: sanitizeInput(formData.email),
    phone: formData.phone ? sanitizeInput(formData.phone) : null,
    message: formData.message ? sanitizeInput(formData.message) : null,
    source: sanitizeInput(formData.source),
    source_id: formData.source_id ? sanitizeInput(formData.source_id) : null,
    destination: formData.destination ? sanitizeInput(formData.destination) : null,
    travel_date: formData.travel_date ? sanitizeInput(formData.travel_date) : null,
    travelers: formData.travelers
  }
  
  try {
    // Use direct insert since we have secure policies in place
    const { error } = await supabase
      .from('enquiries')
      .insert([sanitizedData])
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Enquiry submission error:', error)
    return { success: false, error: 'Failed to submit enquiry. Please try again.' }
  }
}

// Secure blog comment submission
export interface BlogCommentData {
  post_id: string
  author_name: string
  author_email: string
  content: string
}

export const submitSecureBlogComment = async (commentData: BlogCommentData): Promise<{ success: boolean; error?: string }> => {
  // Client-side rate limiting
  if (!checkClientRateLimit('blog_comment', 3, 60)) {
    return { success: false, error: 'Too many comments. Please wait before commenting again.' }
  }
  
  // Validate required fields
  const requiredError = validateRequired(commentData.author_name, 'Name') || 
                       validateRequired(commentData.author_email, 'Email') ||
                       validateRequired(commentData.content, 'Comment')
  if (requiredError) {
    return { success: false, error: requiredError }
  }
  
  // Validate email format
  if (!validateEmail(commentData.author_email)) {
    return { success: false, error: 'Invalid email format' }
  }
  
  // Validate field lengths
  const lengthError = validateLength(commentData.author_name, 1, 100, 'Name') ||
                     validateLength(commentData.author_email, 5, 254, 'Email') ||
                     validateLength(commentData.content, 5, 1000, 'Comment')
  if (lengthError) {
    return { success: false, error: lengthError }
  }
  
  // Sanitize inputs
  const sanitizedData = {
    post_id: commentData.post_id,
    author_name: sanitizeInput(commentData.author_name),
    author_email: sanitizeInput(commentData.author_email),
    content: sanitizeInput(commentData.content),
    status: 'pending' // All comments start as pending for moderation
  }
  
  try {
    // Use direct insert since we have secure policies in place
    const { error } = await supabase
      .from('blog_comments')
      .insert([sanitizedData])
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Blog comment submission error:', error)
    return { success: false, error: 'Failed to submit comment. Please try again.' }
  }
}