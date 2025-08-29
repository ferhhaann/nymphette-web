import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CountryBreadcrumbProps {
  region: string
  countryName: string
}

export const CountryBreadcrumb = ({ region, countryName }: CountryBreadcrumbProps) => {
  return (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground my-4">
      <Link to="/" className="hover:text-primary transition-colors flex items-center">
        <Home className="h-4 w-4 mr-1" />
        Home
      </Link>
      <ChevronRight className="h-4 w-4 flex-shrink-0" />
      <Link to="/packages" className="hover:text-primary transition-colors">
        Tour Packages
      </Link>
      <ChevronRight className="h-4 w-4 flex-shrink-0" />
      <Link 
        to={`/regions/${region.toLowerCase()}`} 
        className="hover:text-primary transition-colors whitespace-nowrap"
      >
        {region} Tour Packages
      </Link>
      <ChevronRight className="h-4 w-4 flex-shrink-0" />
      <span className="text-foreground font-medium">{countryName}</span>
    </nav>
  )
}