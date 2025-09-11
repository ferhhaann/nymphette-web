import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Database,
  Package,
  Users,
  BookOpen,
  MessageSquare,
  ClipboardList,
  FileText,
  Globe,
  Settings,
  LogOut,
  PieChart,
  Shield,
  Home,
  Building
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface AdminSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  onSignOut: () => void
}

const mainMenuItems = [
  {
    title: "Dashboard",
    value: "overview",
    icon: Home,
    description: "Overview & analytics",
    subItems: []
  },
  {
    title: "Countries",
    value: "countries", 
    icon: Globe,
    description: "Manage destinations",
    subItems: []
  },
  {
    title: "Packages",
    value: "packages",
    icon: Package,
    description: "Travel packages",
    subItems: [
      { title: "All Packages", value: "packages" },
      { title: "Bulk Upload", value: "package-bulk-upload" }
    ]
  },
  {
    title: "Group Tours",
    value: "group-tours",
    icon: Users,
    description: "Group activities",
    subItems: []
  }
]

const contentMenuItems = [
  {
    title: "Blog",
    value: "blog",
    icon: BookOpen,
    description: "Articles & posts",
    subItems: []
  },
  {
    title: "Content",
    value: "content",
    icon: FileText,
    description: "Page content",
    subItems: []
  },
  {
    title: "SEO",
    value: "seo",
    icon: Settings,
    description: "Search optimization",
    subItems: []
  }
]

const customerMenuItems = [
  {
    title: "Enquiries",
    value: "enquiries",
    icon: ClipboardList,
    description: "Customer queries",
    badge: "New",
    subItems: []
  },
  {
    title: "Contact",
    value: "contact",
    icon: MessageSquare,
    description: "Contact messages",
    subItems: []
  }
]

export function AdminSidebar({ activeSection, onSectionChange, onSignOut }: AdminSidebarProps) {
  const { state } = useSidebar()
  const location = useLocation()
  const isCollapsed = state === "collapsed"
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    // Auto-expand groups based on active section
    "countries": activeSection.startsWith("country"),
    "packages": activeSection.startsWith("package"),
    "group-tours": activeSection.startsWith("tour") || activeSection === "group-tours",
    "blog": activeSection.startsWith("blog"),
    "content": activeSection.startsWith("content"),
    "seo": activeSection.startsWith("seo"),
    "enquiries": activeSection.startsWith("enquiries"),
    "contact": activeSection.startsWith("contact")
  })

  const isActive = (value: string) => activeSection === value
  const isSubItemActive = (parentValue: string, subItems: any[]) => 
    subItems.some(sub => isActive(sub.value)) || isActive(parentValue)

  const toggleGroup = (groupValue: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupValue]: !prev[groupValue]
    }))
  }

  const handleMenuClick = (item: any) => {
    if (item.subItems.length > 0) {
      toggleGroup(item.value)
      // If group has subitems, also navigate to the main section
      onSectionChange(item.value)
    } else {
      onSectionChange(item.value)
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r bg-card dark:bg-card">
      <SidebarHeader className="border-b border-border bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Building className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">Nymphette Tours</span>
              <span className="text-sm text-primary-foreground/80">Admin Dashboard</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-4 bg-muted/30">
        {/* Main Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3">
            Main Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <div>
                    <SidebarMenuButton
                      isActive={isActive(item.value) || isSubItemActive(item.value, item.subItems)}
                      onClick={() => handleMenuClick(item)}
                      tooltip={isCollapsed ? item.title : undefined}
                      className={`rounded-lg transition-all duration-200 w-full ${
                        isActive(item.value) || isSubItemActive(item.value, item.subItems)
                          ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90' 
                          : 'hover:bg-muted text-foreground hover:text-primary'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                      {item.subItems.length > 0 && !isCollapsed && (
                        <div className={`ml-auto transition-transform duration-200 ${
                          expandedGroups[item.value] ? 'rotate-180' : ''
                        }`}>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      )}
                    </SidebarMenuButton>
                    
                    {/* Submenu */}
                    {!isCollapsed && item.subItems.length > 0 && expandedGroups[item.value] && (
                      <div className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
                        {item.subItems.map((subItem) => (
                          <button
                            key={subItem.value}
                            onClick={() => onSectionChange(subItem.value)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                              isActive(subItem.value)
                                ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                          >
                            {subItem.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Content Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3">
            Content Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {contentMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <div>
                    <SidebarMenuButton
                      isActive={isActive(item.value) || isSubItemActive(item.value, item.subItems)}
                      onClick={() => handleMenuClick(item)}
                      tooltip={isCollapsed ? item.title : undefined}
                      className={`rounded-lg transition-all duration-200 w-full ${
                        isActive(item.value) || isSubItemActive(item.value, item.subItems)
                          ? 'bg-accent text-accent-foreground shadow-md hover:bg-accent/90' 
                          : 'hover:bg-muted text-foreground hover:text-accent'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                      {item.subItems.length > 0 && !isCollapsed && (
                        <div className={`ml-auto transition-transform duration-200 ${
                          expandedGroups[item.value] ? 'rotate-180' : ''
                        }`}>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      )}
                    </SidebarMenuButton>
                    
                    {/* Submenu */}
                    {!isCollapsed && item.subItems.length > 0 && expandedGroups[item.value] && (
                      <div className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
                        {item.subItems.map((subItem) => (
                          <button
                            key={subItem.value}
                            onClick={() => onSectionChange(subItem.value)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                              isActive(subItem.value)
                                ? 'bg-accent/10 text-accent font-medium border-l-2 border-accent'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                          >
                            {subItem.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Customer Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3">
            Customer Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {customerMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <div>
                    <SidebarMenuButton
                      isActive={isActive(item.value) || isSubItemActive(item.value, item.subItems)}
                      onClick={() => handleMenuClick(item)}
                      tooltip={isCollapsed ? item.title : undefined}
                      className={`rounded-lg transition-all duration-200 w-full ${
                        isActive(item.value) || isSubItemActive(item.value, item.subItems)
                          ? 'bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90' 
                          : 'hover:bg-muted text-foreground hover:text-destructive'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                      {item.badge && !isCollapsed && (
                        <Badge variant="secondary" className="ml-auto text-xs bg-destructive/10 text-destructive">
                          {item.badge}
                        </Badge>
                      )}
                      {item.subItems.length > 0 && !isCollapsed && !item.badge && (
                        <div className={`ml-auto transition-transform duration-200 ${
                          expandedGroups[item.value] ? 'rotate-180' : ''
                        }`}>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      )}
                    </SidebarMenuButton>
                    
                    {/* Submenu */}
                    {!isCollapsed && item.subItems.length > 0 && expandedGroups[item.value] && (
                      <div className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
                        {item.subItems.map((subItem) => (
                          <button
                            key={subItem.value}
                            onClick={() => onSectionChange(subItem.value)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                              isActive(subItem.value)
                                ? 'bg-destructive/10 text-destructive font-medium border-l-2 border-destructive'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                          >
                            {subItem.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border bg-muted/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onSignOut}
              tooltip={isCollapsed ? "Sign Out" : undefined}
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg transition-all duration-200 font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {!isCollapsed && (
          <div className="px-2 py-2">
            <div className="flex items-center gap-3 rounded-xl bg-card border border-border p-3 shadow-sm">
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                  A
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">Admin User</span>
                <span className="text-xs text-muted-foreground">Administrator</span>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}