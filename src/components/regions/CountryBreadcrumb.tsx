import { UnifiedBreadcrumb } from '@/components/common/UnifiedBreadcrumb'

interface CountryBreadcrumbProps {
  region: string
  countryName: string
}

export const CountryBreadcrumb = ({ region, countryName }: CountryBreadcrumbProps) => {
  const breadcrumbItems = [
    { name: 'Packages', href: '/packages' },
    { name: region, href: `/regions/${region.toLowerCase().replace(/\s+/g, '-')}` },
    { name: countryName, current: true }
  ]

  return <UnifiedBreadcrumb items={breadcrumbItems} />
}