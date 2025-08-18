import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Trash2, Settings, BarChart3, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

interface AnalyticsData {
  totalPackages: number
  totalCountries: number
  featuredPackages: number
  contentSections: number
}

export const AdminOverview = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPackages: 0,
    totalCountries: 0,
    featuredPackages: 0,
    contentSections: 0
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      const [packagesResult, countriesResult, featuredResult, contentResult] = await Promise.all([
        supabase.from('packages').select('id', { count: 'exact' }),
        supabase.from('countries').select('id', { count: 'exact' }),
        supabase.from('packages').select('id', { count: 'exact' }).eq('featured', true),
        supabase.from('content').select('section', { count: 'exact' })
      ])

      setAnalytics({
        totalPackages: packagesResult.count || 0,
        totalCountries: countriesResult.count || 0,
        featuredPackages: featuredResult.count || 0,
        contentSections: contentResult.count || 0
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard analytics",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const clearDatabase = async () => {
    if (!confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return
    }

    try {
      await Promise.all([
        supabase.from('packages').delete().neq('id', ''),
        supabase.from('countries').delete().neq('id', ''),
        supabase.from('content').delete().neq('id', ''),
        supabase.from('famous_places').delete().neq('id', ''),
        supabase.from('essential_tips').delete().neq('id', ''),
        supabase.from('travel_purposes').delete().neq('id', ''),
        supabase.from('country_faqs').delete().neq('id', '')
      ])

      toast({
        title: "Success",
        description: "Database cleared successfully",
      })
      
      loadAnalytics()
    } catch (error) {
      console.error('Error clearing database:', error)
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button 
          variant="destructive" 
          onClick={clearDatabase}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear Database
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : analytics.totalPackages}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{analytics.featuredPackages} Featured</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : analytics.totalCountries}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Across all regions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Sections</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : analytics.contentSections}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Website content items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground mt-2">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="font-medium">View Analytics</span>
              <span className="text-xs text-muted-foreground">Package performance</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Settings className="h-6 w-6" />
              <span className="font-medium">Site Settings</span>
              <span className="text-xs text-muted-foreground">Configure website</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="font-medium">User Management</span>
              <span className="text-xs text-muted-foreground">Manage admin users</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}