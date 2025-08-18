import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Phone, Mail, MessageCircle } from 'lucide-react'

export const InquiryBookingForm = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Contact & Enquiry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Enquiry Form */}
          <div className="space-y-4">
            <h4 className="font-semibold">Enquire Now</h4>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" placeholder="Your full name" />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="+91 9876543210" />
                </div>
                <div>
                  <Label htmlFor="city">City of Residence</Label>
                  <Input id="city" placeholder="Your city" />
                </div>
              </div>

              <div>
                <Label htmlFor="requirements">Travel Requirements</Label>
                <Textarea 
                  id="requirements" 
                  placeholder="Tell us about your travel dates, group size, preferences, and any special requirements..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-primary">
                Send Enquiry
              </Button>
            </form>
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
  )
}