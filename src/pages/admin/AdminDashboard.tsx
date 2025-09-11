import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
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
import { AdminSidebar } from "@/components/admin/AdminSidebar"

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adminCheckComplete, setAdminCheckComplete] = useState(false)
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

  if (isAuthenticated && isAdmin) {
    const renderActiveContent = () => {
      switch (activeSection) {
        case "overview":
          return <AdminOverview />
        case "packages":
          return <PackageManager />
        case "group-tours":
          return <GroupTourManager />
        case "countries":
          return <CountryManager />
        case "blog":
          return <BlogManager />
        case "contact":
          return <ContactManager />
        case "enquiries":
          return <EnquiryManager />
        case "content":
          return <ContentManager />
        case "seo":
          return <SEOManager />
        default:
          return <AdminOverview />
      }
    }

    const getSectionTitle = () => {
      const titles = {
        "overview": "Dashboard Overview",
        "packages": "Travel Packages",
        "group-tours": "Group Tours",
        "countries": "Countries Management",
        "blog": "Blog Management",
        "contact": "Contact Management",
        "enquiries": "Customer Enquiries",
        "content": "Content Management",
        "seo": "SEO Settings"
      }
      return titles[activeSection as keyof typeof titles] || "Dashboard"
    }

    const getSectionDescription = () => {
      const descriptions = {
        "overview": "Monitor your travel website performance and key metrics",
        "packages": "Create and manage travel packages for your customers",
        "group-tours": "Organize and manage group tour experiences",
        "countries": "Manage destination information, attractions, and content",
        "blog": "Write and manage blog posts to engage your audience",
        "contact": "Handle customer contact form submissions",
        "enquiries": "Manage customer travel enquiries and bookings",
        "content": "Update website content and information",
        "seo": "Optimize your website for search engines"
      }
      return descriptions[activeSection as keyof typeof descriptions] || "Welcome to your admin dashboard"
    }

    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onSignOut={signOut}
          />
          
          <SidebarInset className="flex-1">
            {/* Header */}
            <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold truncate">{getSectionTitle()}</h1>
                  <p className="text-sm text-muted-foreground truncate hidden sm:block">
                    {getSectionDescription()}
                  </p>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 space-y-6">
              <div className="min-h-0">
                {renderActiveContent()}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
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