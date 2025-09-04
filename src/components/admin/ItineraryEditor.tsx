import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical } from "lucide-react"

interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
  meals: string[]
  accommodation?: string
}

interface ItineraryEditorProps {
  itinerary: ItineraryDay[]
  onChange: (itinerary: ItineraryDay[]) => void
}

export const ItineraryEditor = ({ itinerary, onChange }: ItineraryEditorProps) => {
  const [days, setDays] = useState<ItineraryDay[]>(itinerary || [])

  const updateItinerary = (newDays: ItineraryDay[]) => {
    setDays(newDays)
    onChange(newDays)
  }

  const addDay = () => {
    const newDay: ItineraryDay = {
      day: days.length + 1,
      title: "",
      description: "",
      activities: [],
      meals: [],
      accommodation: ""
    }
    updateItinerary([...days, newDay])
  }

  const removeDay = (index: number) => {
    const newDays = days.filter((_, i) => i !== index)
    // Renumber days
    const renumberedDays = newDays.map((day, i) => ({ ...day, day: i + 1 }))
    updateItinerary(renumberedDays)
  }

  const updateDay = (index: number, updates: Partial<ItineraryDay>) => {
    const newDays = days.map((day, i) => 
      i === index ? { ...day, ...updates } : day
    )
    updateItinerary(newDays)
  }

  const updateArrayField = (index: number, field: 'activities' | 'meals', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean)
    updateDay(index, { [field]: items })
  }

  const moveDay = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === days.length - 1)
    ) return

    const newDays = [...days]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    // Swap the elements
    const temp = newDays[index]
    newDays[index] = newDays[newIndex]
    newDays[newIndex] = temp
    
    // Renumber days
    const renumberedDays = newDays.map((day, i) => ({ ...day, day: i + 1 }))
    updateItinerary(renumberedDays)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Itinerary Editor</h3>
        <Button onClick={addDay} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Day
        </Button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {days.map((day, index) => (
          <Card key={index} className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Day {day.day}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveDay(index, 'up')}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveDay(index, 'down')}
                      disabled={index === days.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      ↓
                    </Button>
                  </div>
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeDay(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`title-${index}`} className="text-xs">Day Title</Label>
                  <Input
                    id={`title-${index}`}
                    value={day.title}
                    onChange={(e) => updateDay(index, { title: e.target.value })}
                    placeholder="e.g., Arrival in Tokyo"
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor={`accommodation-${index}`} className="text-xs">Accommodation</Label>
                  <Input
                    id={`accommodation-${index}`}
                    value={day.accommodation || ""}
                    onChange={(e) => updateDay(index, { accommodation: e.target.value })}
                    placeholder="Hotel name or type"
                    className="h-8"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`description-${index}`} className="text-xs">Description</Label>
                <Textarea
                  id={`description-${index}`}
                  value={day.description}
                  onChange={(e) => updateDay(index, { description: e.target.value })}
                  placeholder="Describe the day's activities..."
                  rows={2}
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`activities-${index}`} className="text-xs">Activities (comma-separated)</Label>
                  <Textarea
                    id={`activities-${index}`}
                    value={day.activities?.join(', ') || ''}
                    onChange={(e) => updateArrayField(index, 'activities', e.target.value)}
                    placeholder="Sightseeing, Museums, Shopping"
                    rows={2}
                    className="text-sm"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {day.activities?.map((activity, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{activity}</Badge>
                    )) || []}
                  </div>
                </div>
                <div>
                  <Label htmlFor={`meals-${index}`} className="text-xs">Meals (comma-separated)</Label>
                  <Textarea
                    id={`meals-${index}`}
                    value={day.meals?.join(', ') || ''}
                    onChange={(e) => updateArrayField(index, 'meals', e.target.value)}
                    placeholder="Breakfast, Lunch, Dinner"
                    rows={2}
                    className="text-sm"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {day.meals?.map((meal, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{meal}</Badge>
                    )) || []}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {days.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No itinerary days added yet. Click "Add Day" to start building the itinerary.
        </div>
      )}
    </div>
  )
}