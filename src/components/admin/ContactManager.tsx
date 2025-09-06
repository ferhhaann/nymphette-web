import React, { useState, useEffect } from 'react'
import { Save, Mail, MessageSquare, Clock, MapPin, Phone, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status: string
  created_at: string
}

interface ContactInfo {
  general: {
    company_name: string
    tagline: string
    phone: string
    email: string
    address: string
    whatsapp: string
  }
  social: {
    facebook: string
    instagram: string
    twitter: string
    youtube: string
  }
  office_hours: {
    monday_friday: string
    saturday: string
    sunday: string
  }
}

export const ContactManager: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    general: {
      company_name: '',
      tagline: '',
      phone: '',
      email: '',
      address: '',
      whatsapp: ''
    },
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    },
    office_hours: {
      monday_friday: '',
      saturday: '',
      sunday: ''
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch contact submissions
      const { data: submissionsData } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      // Fetch contact info
      const { data: contactData } = await supabase
        .from('contact_info')
        .select('*')

      if (submissionsData) {
        setSubmissions(submissionsData)
      }

      if (contactData) {
        const organized: any = {
          general: {},
          social: {},
          office_hours: {}
        }

        contactData.forEach(item => {
          organized[item.section][item.key] = item.value
        })

        setContactInfo(organized)
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
      toast.error('Failed to fetch contact data')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveContactInfo = async () => {
    setSaving(true)
    try {
      // Delete existing contact info
      await supabase.from('contact_info').delete().neq('id', '00000000-0000-0000-0000-000000000000')

      // Insert new contact info
      const insertData = []
      
      Object.entries(contactInfo).forEach(([section, data]) => {
        Object.entries(data).forEach(([key, value]) => {
          insertData.push({
            section,
            key,
            value: JSON.stringify(value)
          })
        })
      })

      await supabase.from('contact_info').insert(insertData)
      
      toast.success('Contact information updated successfully')
    } catch (error) {
      console.error('Error saving contact info:', error)
      toast.error('Failed to save contact information')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateSubmissionStatus = async (submissionId: string, status: string) => {
    try {
      await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', submissionId)
      
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId ? { ...sub, status } : sub
        )
      )
      
      toast.success('Submission status updated')
    } catch (error) {
      console.error('Error updating submission status:', error)
      toast.error('Failed to update status')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500'
      case 'replied': return 'bg-green-500'
      case 'resolved': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return <div className="p-4">Loading contact data...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contact Management</h2>
      
      <Tabs defaultValue="submissions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submissions">Contact Submissions</TabsTrigger>
          <TabsTrigger value="settings">Contact Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Recent Submissions ({submissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map(submission => (
                  <div key={submission.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{submission.name}</h4>
                        <p className="text-sm text-muted-foreground">{submission.email}</p>
                        {submission.phone && (
                          <p className="text-sm text-muted-foreground">{submission.phone}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(submission.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    {submission.subject && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">Subject: </span>
                        <span className="text-sm">{submission.subject}</span>
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <span className="text-sm font-medium">Message: </span>
                      <p className="text-sm text-muted-foreground mt-1">{submission.message}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Select
                        value={submission.status}
                        onValueChange={(value) => handleUpdateSubmissionStatus(submission.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="replied">Replied</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`mailto:${submission.email}?subject=Re: ${submission.subject || 'Your inquiry'}`)}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    </div>
                  </div>
                ))}
                
                {submissions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No contact submissions yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    value={contactInfo.general.company_name}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      general: { ...contactInfo.general, company_name: e.target.value }
                    })}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tagline</label>
                  <Input
                    value={contactInfo.general.tagline}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      general: { ...contactInfo.general, tagline: e.target.value }
                    })}
                    placeholder="Your company tagline"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={contactInfo.general.phone}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      general: { ...contactInfo.general, phone: e.target.value }
                    })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={contactInfo.general.email}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      general: { ...contactInfo.general, email: e.target.value }
                    })}
                    placeholder="hello@company.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">WhatsApp</label>
                  <Input
                    value={contactInfo.general.whatsapp}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      general: { ...contactInfo.general, whatsapp: e.target.value }
                    })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-sm font-medium">Address</label>
                  <Textarea
                    value={contactInfo.general.address}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      general: { ...contactInfo.general, address: e.target.value }
                    })}
                    placeholder="123 Main Street, City, State 12345"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Office Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Office Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Monday - Friday</label>
                  <Input
                    value={contactInfo.office_hours.monday_friday}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      office_hours: { ...contactInfo.office_hours, monday_friday: e.target.value }
                    })}
                    placeholder="9:00 AM - 6:00 PM"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Saturday</label>
                  <Input
                    value={contactInfo.office_hours.saturday}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      office_hours: { ...contactInfo.office_hours, saturday: e.target.value }
                    })}
                    placeholder="10:00 AM - 4:00 PM"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sunday</label>
                  <Input
                    value={contactInfo.office_hours.sunday}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      office_hours: { ...contactInfo.office_hours, sunday: e.target.value }
                    })}
                    placeholder="Closed"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Facebook</label>
                  <Input
                    value={contactInfo.social.facebook}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      social: { ...contactInfo.social, facebook: e.target.value }
                    })}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Instagram</label>
                  <Input
                    value={contactInfo.social.instagram}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      social: { ...contactInfo.social, instagram: e.target.value }
                    })}
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Twitter</label>
                  <Input
                    value={contactInfo.social.twitter}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      social: { ...contactInfo.social, twitter: e.target.value }
                    })}
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">YouTube</label>
                  <Input
                    value={contactInfo.social.youtube}
                    onChange={(e) => setContactInfo({
                      ...contactInfo,
                      social: { ...contactInfo.social, youtube: e.target.value }
                    })}
                    placeholder="https://youtube.com/@yourpage"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveContactInfo} disabled={saving} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Contact Settings'}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}