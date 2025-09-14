import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  name: string
  href?: string
  current?: boolean
}

interface UnifiedBreadcrumbProps {
  items: BreadcrumbItem[]
}

export const UnifiedBreadcrumb = ({ items }: UnifiedBreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mt-6" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-primary transition-colors inline-flex items-center">
        <Home className="h-4 w-4 mr-1" />
        Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="inline-flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          {item.current || !item.href ? (
            <span className="text-foreground font-medium inline-flex items-center">{item.name}</span>
          ) : (
            <Link to={item.href} className="hover:text-primary transition-colors inline-flex items-center">
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}