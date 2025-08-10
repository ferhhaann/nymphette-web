import React, { useMemo } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { MapPinned, Globe } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import type { TravelPackage } from "@/data/packagesData";

import asiaDetails from "@/data/countryDetails/asia.json";
import europeDetails from "@/data/countryDetails/europe.json";
import africaDetails from "@/data/countryDetails/africa.json";
import americasDetails from "@/data/countryDetails/americas.json";
import middleEastDetails from "@/data/countryDetails/middle-east.json";
import pacificIslandsDetails from "@/data/countryDetails/pacific-islands.json";

const DETAILS_BY_REGION: Record<string, Record<string, any>> = {
  asia: asiaDetails as Record<string, any>,
  europe: europeDetails as Record<string, any>,
  africa: africaDetails as Record<string, any>,
  americas: americasDetails as Record<string, any>,
  "middle-east": middleEastDetails as Record<string, any>,
  "pacific-islands": pacificIslandsDetails as Record<string, any>,
};

interface RegionSidebarProps {
  regionKey: string;
  data: TravelPackage[];
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const getRegionDisplayName = (regionKey: string) => {
  const names: Record<string, string> = {
    asia: "Asia",
    europe: "Europe", 
    africa: "Africa",
    americas: "Americas",
    "middle-east": "Middle East",
    "pacific-islands": "Pacific Islands"
  };
  return names[regionKey] || regionKey;
};

export const RegionSidebar: React.FC<RegionSidebarProps> = ({ regionKey, data }) => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const countries = useMemo(() => {
    const details = DETAILS_BY_REGION[regionKey] || {};
    const counts = new Map<string, number>();
    
    for (const p of data) {
      const slug = (p.countrySlug && p.countrySlug.trim()) || slugify(p.country?.trim() || "");
      if (!slug) continue;
      counts.set(slug, (counts.get(slug) || 0) + 1);
    }
    
    return Object.entries(details)
      .map(([slug, d]: [string, any]) => ({
        slug,
        name: (d && (d as any).name) || slug.replace(/-/g, " ").replace(/\b\w/g, (s) => s.toUpperCase()),
        count: counts.get(slug) || 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [regionKey, data]);

  const isCountryActive = (countrySlug: string) => 
    currentPath.includes(`/regions/${regionKey}/country/${countrySlug}`);
  
  const isRegionActive = currentPath === `/regions/${regionKey}`;

  const getNavClassName = (isActive: boolean) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  if (!countries.length) return null;

  return (
    <Sidebar className={collapsed ? "w-16" : "w-72"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {!collapsed && (
                <>
                  <span>{getRegionDisplayName(regionKey)}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {countries.length}
                  </Badge>
                </>
              )}
            </div>
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Region overview link */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to={`/regions/${regionKey}`} 
                    className={getNavClassName(isRegionActive)}
                  >
                    <MapPinned className="h-4 w-4" />
                    {!collapsed && <span>Region Overview</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Country links */}
              {countries.map((country) => (
                <SidebarMenuItem key={country.slug}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={`/regions/${regionKey}/country/${country.slug}`}
                      className={getNavClassName(isCountryActive(country.slug))}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-2 h-2 bg-current rounded-full opacity-60" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{country.name}</span>
                            {country.count > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {country.count}
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};