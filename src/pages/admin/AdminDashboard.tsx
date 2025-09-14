import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, FileText, Settings, Database, Globe, Users, BookOpen, MessageSquare, ClipboardList } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAutoLogout } from "@/hooks/useAutoLogout"
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
  const [adminCheckComplete, setAdminCheckComplete] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")
  const { toast } = useToast()
  
  // Auto logout after 7 minutes of inactivity
  useAutoLogout({ 
    timeoutMinutes: 7, 
    warningMinutes: 1,
    onLogout: () => {
      setIsAuthenticated(false)
      setIsAdmin(false)
    }
  })

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
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setIsAuthenticated(true)
        
        // Check if user has admin role
        try {
          const { data: isAdminResult, error } = await supabase
            .rpc('is_admin')
          
          if (error) {
            // For production, if there's an error with the RPC, treat as non-admin
            setIsAdmin(false)
          } else {
            setIsAdmin(isAdminResult || false)
          }
        } catch (rpcError) {
          // Fallback: if RPC fails completely
          setIsAdmin(false)
        }
        setAdminCheckComplete(true)
      } else {
        setIsAuthenticated(false)
        setIsAdmin(false)
        setAdminCheckComplete(true)
      }
      setLoading(false)
    } catch (error) {
      setIsAuthenticated(false)
      setIsAdmin(false)
      setAdminCheckComplete(true)
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

  if (loading || (isAuthenticated && !adminCheckComplete)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  // Only show access denied if we've completed the check AND user is authenticated AND not admin
  if (isAuthenticated && adminCheckComplete && !isAdmin) {
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

  // Only show admin dashboard if authenticated, admin check complete, AND user is admin
  if (isAuthenticated && adminCheckComplete && isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                Manage your travel website content, packages, and SEO settings
              </p>
            </div>
            <Button 
              onClick={signOut} 
              variant="outline" 
              className="w-full sm:w-auto"
            >
              Sign Out
            </Button>
          </div>

          <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
            <div className="bg-card rounded-lg border shadow-sm p-2">
              <TabsList className="grid w-full h-auto gap-1 bg-transparent p-1" style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'
              }}>
                <TabsTrigger 
                  value="overview" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 min-h-[60px] sm:min-h-[48px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <Database className="h-4 w-4 flex-shrink-0" />
                  <span className="text-center">Overview</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="packages" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 min-h-[60px] sm:min-h-[48px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <Package className="h-4 w-4 flex-shrink-0" />
                  <span className="text-center">Packages</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="group-tours" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 min-h-[60px] sm:min-h-[48px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span className="text-center">Group Tours</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="blog" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 min-h-[60px] sm:min-h-[48px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <BookOpen className="h-4 w-4 flex-shrink-0" />
                  <span className="text-center">Blog</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="contact" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 min-h-[60px] sm:min-h-[48px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="text-center">Contact</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="enquiries" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 min-h-[60px] sm:min-h-[48px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <ClipboardList className="h-4 w-4 flex-shrink-0" />
                  <span className="text-center">Enquiries</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="content" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 min-h-[60px] sm:min-h-[48px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="text-center">Content</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="countries" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 min-h-[60px] sm:min-h-[48px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  <span className="text-center">Countries</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="seo" 
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 min-h-[60px] sm:min-h-[48px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <Settings className="h-4 w-4 flex-shrink-0" />
                  <span className="text-center">SEO</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="mt-6">
              <AdminOverview />
            </TabsContent>

            <TabsContent value="packages" className="mt-6">
              <PackageManager />
            </TabsContent>

            <TabsContent value="group-tours" className="mt-6">
              <GroupTourManager />
            </TabsContent>

            <TabsContent value="countries" className="mt-6">
              <CountryManager />
            </TabsContent>

            <TabsContent value="blog" className="mt-6">
              <BlogManager />
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <ContactManager />
            </TabsContent>

            <TabsContent value="enquiries" className="mt-6">
              <EnquiryManager />
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <ContentManager />
            </TabsContent>

            <TabsContent value="seo" className="mt-6">
              <SEOManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Nymphette Tours Admin
          </h1>
          <p className="text-muted-foreground">
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
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSignIn(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard with SEO management tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your admin email"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard