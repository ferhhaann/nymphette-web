import { supabase } from '@/integrations/supabase/client'
import { submitSecureEnquiry, type EnquiryFormData } from './secureFormUtils'

export interface CreateEnquiryData {
  name: string
  email: string
  phone?: string
  message?: string
  source: 'package' | 'group_tour' | 'contact' | 'general'
  source_id?: string
  destination?: string
  travel_date?: string
  travelers?: number
}

/**
 * Create a new enquiry using secure submission method
 * @deprecated Use submitSecureEnquiry from secureFormUtils instead for better security
 */
export const createEnquiry = async (data: CreateEnquiryData) => {
  console.warn('createEnquiry is deprecated. Use submitSecureEnquiry for better security.')
  
  // Map to secure form format
  const secureData: EnquiryFormData = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    source: data.source,
    source_id: data.source_id,
    destination: data.destination,
    travel_date: data.travel_date,
    travelers: data.travelers
  }
  
  const result = await submitSecureEnquiry(secureData)
  
  if (result.success) {
    return { success: true, data: { id: 'created' } }
  } else {
    return { success: false, error: result.error }
  }
}

/**
 * Send WhatsApp notification for enquiry
 */
export const sendWhatsAppNotification = async (
  enquiryData: CreateEnquiryData,
  webhookUrl?: string
) => {
  if (!webhookUrl) {
    console.warn('WhatsApp webhook URL not configured')
    return { success: false, error: 'WhatsApp webhook URL not configured' }
  }

  try {
    const message = `🌟 New Booking Enquiry!

👤 Name: ${enquiryData.name}
📧 Email: ${enquiryData.email}
📱 Phone: ${enquiryData.phone || 'Not provided'}
🏝️ Destination: ${enquiryData.destination || 'Not specified'}
📅 Travel Date: ${enquiryData.travel_date || 'Not specified'}
👥 Travelers: ${enquiryData.travelers || 'Not specified'}
📝 Source: ${enquiryData.source.replace('_', ' ').toUpperCase()}

Message: ${enquiryData.message || 'No message provided'}

---
Sent from Travel Booking System`

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify({
        message,
        enquiry_data: enquiryData,
        timestamp: new Date().toISOString()
      })
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error)
    return { success: false, error }
  }
}

/**
 * Enhanced form submission that creates enquiry and optionally sends WhatsApp notification
 */
export const submitEnquiry = async (
  data: CreateEnquiryData,
  options?: {
    sendWhatsApp?: boolean
    webhookUrl?: string
    onSuccess?: (enquiry: any) => void
    onError?: (error: any) => void
  }
) => {
  // Create the enquiry
  const result = await createEnquiry(data)
  
  if (!result.success) {
    options?.onError?.(result.error)
    return result
  }

  // Send WhatsApp notification if requested
  if (options?.sendWhatsApp && options?.webhookUrl) {
    await sendWhatsAppNotification(data, options.webhookUrl)
  }

  options?.onSuccess?.(result.data)
  return result
}