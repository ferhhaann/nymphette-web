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
    <Sidebar collapsible="icon" className="border-r bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <SidebarHeader className="border-b border-sidebar-border bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Building className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">Nymphette Tours</span>
              <span className="text-sm text-blue-100">Admin Dashboard</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-4">
        {/* Main Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            🏠 Main Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={isActive(item.value)}
                    onClick={() => onSectionChange(item.value)}
                    tooltip={isCollapsed ? item.title : undefined}
                    className={`rounded-lg transition-all duration-200 ${
                      isActive(item.value) 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:from-blue-600 hover:to-indigo-600' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Content Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            📝 Content Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={isActive(item.value)}
                    onClick={() => onSectionChange(item.value)}
                    tooltip={isCollapsed ? item.title : undefined}
                    className={`rounded-lg transition-all duration-200 ${
                      isActive(item.value) 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:from-green-600 hover:to-emerald-600' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Customer Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            👥 Customer Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={isActive(item.value)}
                    onClick={() => onSectionChange(item.value)}
                    tooltip={isCollapsed ? item.title : undefined}
                    className={`rounded-lg transition-all duration-200 ${
                      isActive(item.value) 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:from-orange-600 hover:to-red-600' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                    {item.badge && !isCollapsed && (
                      <Badge variant="secondary" className="ml-auto text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100">
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

      <SidebarFooter className="border-t border-sidebar-border bg-slate-50 dark:bg-slate-900">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onSignOut}
              tooltip={isCollapsed ? "Sign Out" : undefined}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {!isCollapsed && (
          <div className="px-2 py-2">
            <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-3 border">
              <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-slate-600">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold">
                  A
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">Admin User</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">Administrator</span>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}