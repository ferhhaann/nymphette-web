import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FilterData {
  search: string
  status: string
  source: string
}

interface EnquiryFilterProps {
  onApplyFilter: (filterData: FilterData) => void
  totalItems: number
  filteredItems: number
}

export const EnquiryFilter = ({ onApplyFilter, totalItems, filteredItems }: EnquiryFilterProps) => {
  const [filterData, setFilterData] = useState<FilterData>({
    search: '',
    status: 'all',
    source: 'all'
  })

  const handleFilterChange = (key: keyof FilterData, value: string) => {
    const newFilterData = { ...filterData, [key]: value }
    setFilterData(newFilterData)
    onApplyFilter(newFilterData)
  }

  const clearFilters = () => {
    const clearedData = { search: '', status: 'all', source: 'all' }
    setFilterData(clearedData)
    onApplyFilter(clearedData)
  }

  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">🔍 Search & Filter</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by name, email, phone, or destination..."
            value={filterData.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="status-filter">Filter by Status</Label>
          <Select value={filterData.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="source-filter">Filter by Source</Label>
          <Select value={filterData.source} onValueChange={(value) => handleFilterChange('source', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="package">Package</SelectItem>
              <SelectItem value="group_tour">Group Tour</SelectItem>
              <SelectItem value="contact">Contact Form</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredItems} of {totalItems} enquiries
        </div>
        {filteredItems !== totalItems && (
          <Badge variant="secondary" className="text-xs">
            {totalItems - filteredItems} filtered out
          </Badge>
        )}
      </div>
    </div>
  )
}