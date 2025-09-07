import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { createEnquiry, sendWhatsAppNotification } from '@/utils/enquiryUtils'

interface InquiryFormData {
  name: string
  email: string
  phone: string
  city: string
  requirements: string
}

interface InquiryBookingFormProps {
  country?: string
  source?: 'package' | 'group_tour' | 'contact' | 'general'
  sourceId?: string
}

export const InquiryBookingForm = ({ 
  country = '', 
  source = 'general', 
  sourceId 
}: InquiryBookingFormProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    requirements: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof InquiryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const enquiryData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Travel Requirements: ${formData.requirements}\nCity: ${formData.city}`,
        source,
        source_id: sourceId,
        destination: country
      }

      const result = await createEnquiry(enquiryData)
      
      if (result.success) {
        toast({
          title: "Enquiry Sent Successfully!",
          description: "Thank you for your interest. Our travel experts will contact you within 24 hours."
        })
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          requirements: ''
        })
      } else {
        throw new Error('Failed to submit enquiry')
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error)
      toast({
        title: "Submission Failed",
        description: "There was an error sending your enquiry. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Contact & Enquiry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information and Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Contact Info */}
            <div className="space-y-4">
              <h4 className="font-semibold">Get In Touch</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>info@travelagency.com</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Share your ideal tour for customization. Our travel experts will get back to you within 24 hours.
              </p>
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-4">
              <h4 className="font-semibold">Enquire Now</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City of Residence</Label>
                    <Input 
                      id="city" 
                      placeholder="Your city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="requirements">Travel Requirements</Label>
                  <Textarea 
                    id="requirements" 
                    placeholder="Tell us about your travel dates, group size, preferences, and any special requirements..."
                    rows={4}
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Travel Tips */}
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Travel Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">V</span>
                </div>
                <div>
                  <div className="font-medium text-sm">Visa Requirements</div>
                  <div className="text-xs text-muted-foreground">Check before travel</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">H</span>
                </div>
                <div>
                  <div className="font-medium text-sm">Health & Safety</div>
                  <div className="text-xs text-muted-foreground">Travel insurance recommended</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">₹</span>
                </div>
                <div>
                  <div className="font-medium text-sm">Currency & Tipping</div>
                  <div className="text-xs text-muted-foreground">Local currency preferred</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button - Outside Card */}
      <Button 
        type="submit" 
        size="lg"
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Enquiry'}
      </Button>
    </form>
  )
}