import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Code, Check, X } from "lucide-react"

interface JsonFieldEditorProps {
  label: string
  value: any
  onChange: (value: any) => void
  className?: string
  placeholder?: string
}

export const JsonFieldEditor = ({ 
  label, 
  value, 
  onChange, 
  className, 
  placeholder 
}: JsonFieldEditorProps) => {
  const [jsonString, setJsonString] = useState(() => {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return ''
    }
  })
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState('')

  const handleChange = (newValue: string) => {
    setJsonString(newValue)
    
    try {
      const parsed = JSON.parse(newValue)
      setIsValid(true)
      setError('')
      onChange(parsed)
    } catch (err: any) {
      setIsValid(false)
      setError(err.message)
    }
  }

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonString)
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonString(formatted)
      setIsValid(true)
      setError('')
    } catch (err: any) {
      setError(err.message)
      setIsValid(false)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={formatJson}
            disabled={!jsonString}
          >
            <Code className="h-3 w-3 mr-1" />
            Format
          </Button>
          <Badge variant={isValid ? "secondary" : "destructive"} className="text-xs">
            {isValid ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Valid
              </>
            ) : (
              <>
                <X className="h-3 w-3 mr-1" />
                Invalid
              </>
            )}
          </Badge>
        </div>
      </div>
      
      <Textarea
        value={jsonString}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder || `Enter ${label.toLowerCase()} as JSON...`}
        className={`font-mono text-sm ${!isValid ? 'border-red-500' : ''}`}
        rows={6}
      />
      
      {!isValid && error && (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">
            JSON Error: {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}