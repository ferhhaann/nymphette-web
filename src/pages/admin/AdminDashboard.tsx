import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, FileText, Settings, Database, Globe, Users, BookOpen, MessageSquare, ClipboardList } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AdminOverview } from "@/components/admin/AdminOverview"
import { PackageManager } from "@/components/admin/PackageManager"
import { ContentManager } from "@/components/admin/ContentManager"
import { CountryManager } from "@/components/admin/CountryManager"
import GroupTourManager from "@/components/admin/GroupTourManager"
import { BlogManager } from "@/components/admin/BlogManager"
import { ContactManager } from "@/components/admin/ContactManager"
import { EnquiryManager } from "@/components/admin/EnquiryManager"
import SEOManager from "@/components/admin/SEOManager"

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")
  const { toast } = useToast()

  useEffect(() => {
    // Simple initialization - don't call async functions immediately
    const initAuth = async () => {
      try {
        await checkAuth()
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        setLoading(false)
      }
    }
    
    initAuth()
    
    // Check URL parameters for initial section
    const params = new URLSearchParams(window.location.search)
    const section = params.get('section')
    if (section) {
      setActiveSection(section)
    }
  }, [])

  const checkAuth = async () => {
    console.log('AdminDashboard: Starting auth check...')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('AdminDashboard: Session check result:', !!session?.user)
      
      if (session?.user) {
        setIsAuthenticated(true)
        
        // Check if user has admin role - handle gracefully if function doesn't exist
        try {
          console.log('AdminDashboard: Calling is_admin RPC...')
          const { data: isAdminResult, error } = await supabase
            .rpc('is_admin')
          
          console.log('AdminDashboard: is_admin result:', { isAdminResult, error })
          
          if (error) {
            console.error('Admin check error:', error)
            // For now, if there's an error with the RPC, treat as non-admin
            setIsAdmin(false)
          } else {
            setIsAdmin(isAdminResult || false)
          }
        } catch (rpcError) {
          console.error('RPC call failed:', rpcError)
          // Fallback: if RPC fails, check if user exists (temporary admin access)
          setIsAdmin(true) // Temporary fallback for debugging
        }
      } else {
        setIsAuthenticated(false)
        setIsAdmin(false)
      }
      setLoading(false)
      console.log('AdminDashboard: Auth check completed')
    } catch (error) {
      console.error('Auth check error:', error)
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      
      // Re-check authentication and admin status
      await checkAuth()
      
      toast({
        title: "Success",
        description: "Signed in successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message
      })
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      setIsAdmin(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You don't have admin privileges to access this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isAuthenticated && isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your travel website content, packages, and SEO settings
              </p>
            </div>
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </div>

          <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
            <TabsList className="grid w-full grid-cols-9">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="packages" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Packages
              </TabsTrigger>
              <TabsTrigger value="group-tours" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Group Tours
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="enquiries" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Enquiries
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="countries" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Countries
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                SEO
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <AdminOverview />
            </TabsContent>

            <TabsContent value="packages">
              <PackageManager />
            </TabsContent>

            <TabsContent value="group-tours">
              <GroupTourManager />
            </TabsContent>

            <TabsContent value="countries">
              <CountryManager />
            </TabsContent>

            <TabsContent value="blog">
              <BlogManager />
            </TabsContent>

            <TabsContent value="contact">
              <ContactManager />
            </TabsContent>

            <TabsContent value="enquiries">
              <EnquiryManager />
            </TabsContent>

            <TabsContent value="content">
              <ContentManager />
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <SEOManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Nymphette Tours Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Content Management System with SEO Tools
          </p>
        </header>
        
        <AuthForm onSignIn={signIn} />
      </div>
    </div>
  )
}

interface AuthFormProps {
  onSignIn: (email: string, password: string) => void
}

const AuthForm = ({ onSignIn }: AuthFormProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSignIn(email, password)
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard with SEO management tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard