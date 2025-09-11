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
        // Main Dashboard
        case "overview":
          return <AdminOverview />
        
        // Countries Management
        case "countries":
        case "country-statistics":
        case "country-attractions":
        case "country-content":
        case "travel-purposes":
          return <CountryManager />
        
        // Package Management
        case "packages":
        case "featured-packages":
        case "package-categories":
        case "package-bulk-upload":
        case "package-analytics":
          return <PackageManager />
        
        // Group Tours
        case "group-tours":
        case "tour-categories":
        case "tour-schedules":
        case "tour-bookings":
          return <GroupTourManager />
        
        // Content Management
        case "blog":
        case "blog-categories":
        case "blog-featured":
        case "blog-drafts":
        case "blog-comments":
          return <BlogManager />
        
        case "content":
        case "content-homepage":
        case "content-about":
        case "content-contact":
        case "content-static":
        case "content-footer":
          return <ContentManager />
        
        case "seo":
        case "seo-meta":
        case "seo-urls":
        case "seo-sitemap":
        case "seo-analytics":
          return <SEOManager />
        
        // Customer Support
        case "contact":
        case "contact-unread":
        case "contact-support":
        case "contact-feedback":
          return <ContactManager />
        
        case "enquiries":
        case "enquiries-pending":
        case "enquiries-progress":
        case "enquiries-resolved":
        case "enquiries-followup":
          return <EnquiryManager />
        
        default:
          return <AdminOverview />
      }
    }

    const getSectionTitle = () => {
      const titles = {
        // Main Dashboard
        "overview": "Dashboard Overview",
        
        // Countries Management
        "countries": "Countries Management",
        "country-statistics": "Country Statistics",
        "country-attractions": "Attractions Management",
        "country-content": "Country Content",
        "travel-purposes": "Travel Purposes",
        
        // Package Management
        "packages": "Travel Packages",
        "featured-packages": "Featured Packages",
        "package-categories": "Package Categories",
        "package-bulk-upload": "Bulk Package Upload",
        "package-analytics": "Package Analytics",
        
        // Group Tours
        "group-tours": "Group Tours",
        "tour-categories": "Tour Categories",
        "tour-schedules": "Tour Schedules",
        "tour-bookings": "Tour Bookings",
        
        // Content Management
        "blog": "Blog Management",
        "blog-categories": "Blog Categories",
        "blog-featured": "Featured Posts",
        "blog-drafts": "Draft Posts",
        "blog-comments": "Comments Management",
        
        "content": "Content Management",
        "content-homepage": "Homepage Content",
        "content-about": "About Page Content",
        "content-contact": "Contact Page Content",
        "content-static": "Static Pages",
        "content-footer": "Footer Content",
        
        "seo": "SEO Management",
        "seo-meta": "Meta Tags",
        "seo-urls": "URL Management",
        "seo-sitemap": "Sitemaps",
        "seo-analytics": "SEO Analytics",
        
        // Customer Support
        "contact": "Contact Management",
        "contact-unread": "Unread Messages",
        "contact-support": "Support Tickets",
        "contact-feedback": "Customer Feedback",
        
        "enquiries": "Customer Enquiries",
        "enquiries-pending": "Pending Enquiries",
        "enquiries-progress": "In Progress",
        "enquiries-resolved": "Resolved Enquiries",
        "enquiries-followup": "Follow-up Required"
      }
      return titles[activeSection as keyof typeof titles] || "Dashboard"
    }

    const getSectionDescription = () => {
      const descriptions = {
        // Main Dashboard
        "overview": "Monitor your travel website performance and key metrics",
        
        // Countries Management
        "countries": "Manage destination information and travel content",
        "country-statistics": "View and analyze country visitor statistics",
        "country-attractions": "Manage tourist attractions and points of interest",
        "country-content": "Edit country-specific content and descriptions",
        "travel-purposes": "Manage travel purpose categories and data",
        
        // Package Management
        "packages": "Create and manage travel packages for customers",
        "featured-packages": "Highlight and promote special travel packages",
        "package-categories": "Organize packages into categories",
        "package-bulk-upload": "Upload multiple packages at once",
        "package-analytics": "Analyze package performance and bookings",
        
        // Group Tours
        "group-tours": "Organize and manage group tour experiences",
        "tour-categories": "Categorize different types of group tours",
        "tour-schedules": "Manage tour dates and availability",
        "tour-bookings": "Handle group tour reservations",
        
        // Content Management
        "blog": "Write and manage blog posts to engage your audience",
        "blog-categories": "Organize blog posts into categories",
        "blog-featured": "Manage featured and highlighted posts",
        "blog-drafts": "Work on unpublished blog content",
        "blog-comments": "Moderate and respond to blog comments",
        
        "content": "Update website content and information",
        "content-homepage": "Edit homepage content and layout",
        "content-about": "Manage about page information",
        "content-contact": "Update contact page details",
        "content-static": "Manage static page content",
        "content-footer": "Edit footer content and links",
        
        "seo": "Optimize your website for search engines",
        "seo-meta": "Manage meta titles and descriptions",
        "seo-urls": "Configure URL structure and redirects",
        "seo-sitemap": "Generate and manage XML sitemaps",
        "seo-analytics": "Monitor SEO performance metrics",
        
        // Customer Support
        "contact": "Handle customer contact form submissions",
        "contact-unread": "Review new messages from customers",
        "contact-support": "Manage customer support tickets",
        "contact-feedback": "Review customer feedback and suggestions",
        
        "enquiries": "Manage customer travel enquiries and bookings",
        "enquiries-pending": "Review new enquiries awaiting response",
        "enquiries-progress": "Track enquiries currently being handled",
        "enquiries-resolved": "View completed enquiry resolutions",
        "enquiries-followup": "Handle enquiries requiring follow-up"
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
            <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/95 px-6 shadow-sm">
              <SidebarTrigger className="-ml-1 h-8 w-8 hover:bg-muted rounded-lg transition-colors" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-foreground truncate">
                    {getSectionTitle()}
                  </h1>
                  <p className="text-sm text-muted-foreground truncate hidden sm:block">
                    {getSectionDescription()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Online
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 space-y-6 bg-background min-h-screen">
              <div className="min-h-0 max-w-7xl mx-auto">
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