import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

interface RegionBreadcrumbProps {
  region: string
  isFromPackagesPage: boolean
}

export const RegionBreadcrumb = ({ region, isFromPackagesPage }: RegionBreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link to="/" className="hover:text-primary transition-colors flex items-center">
        <Home className="h-4 w-4 mr-1" />
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      {isFromPackagesPage && (
        <>
          <Link to="/packages" className="hover:text-primary transition-colors">
            Tour Packages
          </Link>
          <ChevronRight className="h-4 w-4" />
        </>
      )}
      <span className="text-foreground font-medium">{region} Tour Packages</span>
    </nav>
  )
}
