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
    description: "Overview & analytics"
  },
  {
    title: "Countries",
    value: "countries", 
    icon: Globe,
    description: "Manage destinations"
  },
  {
    title: "Packages",
    value: "packages",
    icon: Package,
    description: "Travel packages"
  },
  {
    title: "Group Tours",
    value: "group-tours",
    icon: Users,
    description: "Group activities"
  }
]

const contentMenuItems = [
  {
    title: "Blog",
    value: "blog",
    icon: BookOpen,
    description: "Articles & posts"
  },
  {
    title: "Content",
    value: "content",
    icon: FileText,
    description: "Page content"
  },
  {
    title: "SEO",
    value: "seo",
    icon: Settings,
    description: "Search optimization"
  }
]

const customerMenuItems = [
  {
    title: "Enquiries",
    value: "enquiries",
    icon: ClipboardList,
    description: "Customer queries",
    badge: "New"
  },
  {
    title: "Contact",
    value: "contact",
    icon: MessageSquare,
    description: "Contact messages"
  }
]

export function AdminSidebar({ activeSection, onSectionChange, onSignOut }: AdminSidebarProps) {
  const { state } = useSidebar()
  const location = useLocation()
  const isCollapsed = state === "collapsed"

  const isActive = (value: string) => activeSection === value

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-1 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Nymphette Tours</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* Main Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={isActive(item.value)}
                    onClick={() => onSectionChange(item.value)}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Content Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={isActive(item.value)}
                    onClick={() => onSectionChange(item.value)}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Customer Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Customers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={isActive(item.value)}
                    onClick={() => onSectionChange(item.value)}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge && !isCollapsed && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onSignOut}
              tooltip={isCollapsed ? "Sign Out" : undefined}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {!isCollapsed && (
          <div className="px-2 py-1">
            <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent p-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">A</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-medium truncate">Admin User</span>
                <span className="text-xs text-muted-foreground">Administrator</span>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}