import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import { 
  Phone, Mail, User, Calendar, MapPin, MessageSquare, 
  Edit, Trash2, Send, Filter, Search, Eye, Clock,
  Users, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'
import { EnquiryFilter } from './EnquiryFilter'

interface Enquiry {
  id: string
  name: string
  email: string
  phone?: string
  message?: string
  source: string
  source_id?: string
  package_title?: string
  destination?: string
  travel_date?: string
  travelers?: number
  status: 'new' | 'in_progress' | 'contacted' | 'closed' | 'cancelled'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  assigned_to?: string
  notes?: string
  whatsapp_sent: boolean
  whatsapp_sent_at?: string
  created_at: string
  updated_at: string
}

interface EnquiryLog {
  id: string
  enquiry_id: string
  action: string
  old_values?: any
  new_values?: any
  performed_by?: string
  notes?: string
  created_at: string
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  normal: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600'
}

export const EnquiryManager = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([])
  const [logs, setLogs] = useState<EnquiryLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null)
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    in_progress: 0,
    contacted: 0,
    closed: 0
  })

  useEffect(() => {
    loadEnquiries()
    loadLogs()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [enquiries])

  const loadEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setEnquiries(data as Enquiry[] || [])
      setFilteredEnquiries(data as Enquiry[] || [])
    } catch (error) {
      console.error('Error loading enquiries:', error)
      toast({
        title: "Error",
        description: "Failed to load enquiries",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('enquiry_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error('Error loading logs:', error)
    }
  }

  const calculateStats = () => {
    const newStats = {
      total: enquiries.length,
      new: enquiries.filter(e => e.status === 'new').length,
      in_progress: enquiries.filter(e => e.status === 'in_progress').length,
      contacted: enquiries.filter(e => e.status === 'contacted').length,
      closed: enquiries.filter(e => e.status === 'closed').length
    }
    setStats(newStats)
  }

  const updateEnquiry = async (id: string, updates: Partial<Enquiry>) => {
    try {
      const { error } = await supabase
        .from('enquiries')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      
      await loadEnquiries()
      toast({
        title: "Success",
        description: "Enquiry updated successfully"
      })
    } catch (error) {
      console.error('Error updating enquiry:', error)
      toast({
        title: "Error",
        description: "Failed to update enquiry",
        variant: "destructive"
      })
    }
  }

  const deleteEnquiry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('enquiries')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      await loadEnquiries()
      await loadLogs()
      toast({
        title: "Success",
        description: "Enquiry deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting enquiry:', error)
      toast({
        title: "Error",
        description: "Failed to delete enquiry",
        variant: "destructive"
      })
    }
  }

  const sendWhatsAppNotification = async (enquiry: Enquiry) => {
    try {
      if (!whatsappUrl) {
        toast({
          title: "Error",
          description: "Please configure WhatsApp webhook URL first",
          variant: "destructive"
        })
        return
      }

      const message = `New booking enquiry from ${enquiry.name}!\n\nDestination: ${enquiry.destination}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone}\nTravel Date: ${enquiry.travel_date}\nTravelers: ${enquiry.travelers}\n\nMessage: ${enquiry.message}`

      await fetch(whatsappUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          message,
          enquiry_id: enquiry.id,
          timestamp: new Date().toISOString()
        })
      })

      await updateEnquiry(enquiry.id, { 
        whatsapp_sent: true, 
        whatsapp_sent_at: new Date().toISOString() 
      })

      toast({
        title: "Success",
        description: "WhatsApp notification sent successfully"
      })
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error)
      toast({
        title: "Error",
        description: "Failed to send WhatsApp notification",
        variant: "destructive"
      })
    }
  }

  const handleFilter = (filterData: { search: string; status: string; source: string }) => {
    let filtered = [...enquiries]
    
    if (filterData.search) {
      const search = filterData.search.toLowerCase()
      filtered = filtered.filter(enquiry => 
        enquiry.name.toLowerCase().includes(search) ||
        enquiry.email.toLowerCase().includes(search) ||
        enquiry.destination?.toLowerCase().includes(search) ||
        enquiry.phone?.includes(search)
      )
    }
    
    if (filterData.status && filterData.status !== 'all') {
      filtered = filtered.filter(enquiry => enquiry.status === filterData.status)
    }
    
    if (filterData.source && filterData.source !== 'all') {
      filtered = filtered.filter(enquiry => enquiry.source === filterData.source)
    }
    
    setFilteredEnquiries(filtered)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getSourceLabel = (source: string) => {
    const sourceLabels = {
      package: 'Package',
      group_tour: 'Group Tour',
      contact: 'Contact Form',
      general: 'General'
    }
    return sourceLabels[source as keyof typeof sourceLabels] || source
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enquiry Management</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Real-time updates enabled</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="WhatsApp Webhook URL"
            value={whatsappUrl}
            onChange={(e) => setWhatsappUrl(e.target.value)}
            className="w-80"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New</p>
                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
              </div>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.in_progress}</p>
              </div>
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contacted</p>
                <p className="text-2xl font-bold text-green-600">{stats.contacted}</p>
              </div>
              <Phone className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Closed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="enquiries" className="w-full">
        <TabsList>
          <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="enquiries" className="space-y-4">
          <EnquiryFilter
            onApplyFilter={handleFilter}
            totalItems={enquiries.length}
            filteredItems={filteredEnquiries.length}
          />

          <Card>
            <CardHeader>
              <CardTitle>Enquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnquiries.map((enquiry) => (
                    <TableRow key={enquiry.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{enquiry.name}</div>
                          <div className="text-sm text-muted-foreground">{enquiry.email}</div>
                          {enquiry.phone && (
                            <div className="text-sm text-muted-foreground">{enquiry.phone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{enquiry.destination}</div>
                          {enquiry.package_title && (
                            <div className="text-sm text-muted-foreground">
                              Package: {enquiry.package_title}
                            </div>
                          )}
                          {enquiry.travel_date && (
                            <div className="text-sm text-muted-foreground">
                              {enquiry.travel_date}
                            </div>
                          )}
                          {enquiry.travelers && (
                            <div className="text-sm text-muted-foreground">
                              {enquiry.travelers} travelers
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getSourceLabel(enquiry.source)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[enquiry.status]}>
                          {enquiry.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityColors[enquiry.priority]}>
                          {enquiry.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(enquiry.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedEnquiry(enquiry)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Enquiry Details</DialogTitle>
                              </DialogHeader>
                              {selectedEnquiry && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Name</Label>
                                      <p className="font-medium">{selectedEnquiry.name}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p>{selectedEnquiry.email}</p>
                                    </div>
                                    <div>
                                      <Label>Phone</Label>
                                      <p>{selectedEnquiry.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <Label>Destination</Label>
                                      <p>{selectedEnquiry.destination || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <Label>Package</Label>
                                      <p>{selectedEnquiry.package_title || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <Label>Travel Date</Label>
                                      <p>{selectedEnquiry.travel_date || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <Label>Travelers</Label>
                                      <p>{selectedEnquiry.travelers || 'N/A'}</p>
                                    </div>
                                  </div>
                                  {selectedEnquiry.message && (
                                    <div>
                                      <Label>Message</Label>
                                      <p className="mt-1 p-3 bg-muted rounded-md">
                                        {selectedEnquiry.message}
                                      </p>
                                    </div>
                                  )}
                                  {selectedEnquiry.notes && (
                                    <div>
                                      <Label>Admin Notes</Label>
                                      <p className="mt-1 p-3 bg-muted rounded-md">
                                        {selectedEnquiry.notes}
                                      </p>
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={() => sendWhatsAppNotification(selectedEnquiry)}
                                      disabled={selectedEnquiry.whatsapp_sent}
                                    >
                                      <Send className="h-4 w-4 mr-2" />
                                      {selectedEnquiry.whatsapp_sent ? 'WhatsApp Sent' : 'Send WhatsApp'}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setEditingEnquiry(enquiry)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Enquiry</DialogTitle>
                              </DialogHeader>
                              {editingEnquiry && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="status">Status</Label>
                                      <Select
                                        value={editingEnquiry.status}
                                        onValueChange={(value) => 
                                          setEditingEnquiry({...editingEnquiry, status: value as any})
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="new">New</SelectItem>
                                          <SelectItem value="in_progress">In Progress</SelectItem>
                                          <SelectItem value="contacted">Contacted</SelectItem>
                                          <SelectItem value="closed">Closed</SelectItem>
                                          <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="priority">Priority</Label>
                                      <Select
                                        value={editingEnquiry.priority}
                                        onValueChange={(value) => 
                                          setEditingEnquiry({...editingEnquiry, priority: value as any})
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="low">Low</SelectItem>
                                          <SelectItem value="normal">Normal</SelectItem>
                                          <SelectItem value="high">High</SelectItem>
                                          <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="assigned_to">Assigned To</Label>
                                    <Input
                                      id="assigned_to"
                                      value={editingEnquiry.assigned_to || ''}
                                      onChange={(e) => 
                                        setEditingEnquiry({...editingEnquiry, assigned_to: e.target.value})
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="notes">Admin Notes</Label>
                                    <Textarea
                                      id="notes"
                                      value={editingEnquiry.notes || ''}
                                      onChange={(e) => 
                                        setEditingEnquiry({...editingEnquiry, notes: e.target.value})
                                      }
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => setEditingEnquiry(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        updateEnquiry(editingEnquiry.id, {
                                          status: editingEnquiry.status,
                                          priority: editingEnquiry.priority,
                                          assigned_to: editingEnquiry.assigned_to,
                                          notes: editingEnquiry.notes
                                        })
                                        setEditingEnquiry(null)
                                      }}
                                    >
                                      Save Changes
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Enquiry</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this enquiry? This action cannot be undone.
                                  Note: This action will be logged in the audit trail.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteEnquiry(enquiry.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs (Read-Only)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Enquiry ID</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.enquiry_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{log.performed_by || 'System'}</TableCell>
                      <TableCell>{log.notes}</TableCell>
                      <TableCell>{formatDate(log.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}