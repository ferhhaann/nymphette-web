import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { TravelPackage } from "@/data/packagesData";

interface FormData {
  name: string;
  email: string;
  phone: string;
  travelers: number;
  departureCity: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  indianMeals: boolean;
  message: string;
}

interface Props { pkg: TravelPackage | null; regionKey: string }

const InquiryBookingForm: React.FC<Props> = ({ pkg, regionKey }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    travelers: 2,
    departureCity: "",
    startDate: undefined,
    endDate: undefined,
    indianMeals: true,
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.name.length < 2) newErrors.name = "Enter your full name";
    if (!formData.email.includes("@")) newErrors.email = "Enter a valid email";
    if (formData.phone.length < 7) newErrors.phone = "Enter a valid phone";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      toast({ title: "Request sent", description: `We'll contact you shortly for ${pkg?.title ?? regionKey} trip.` });
    }
  };

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {pkg && (
        <div className="text-sm text-muted-foreground">For package: <span className="font-medium">{pkg.title}</span></div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Input 
            placeholder="Full name" 
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            aria-invalid={!!errors.name} 
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>
        <div>
          <Input 
            placeholder="Email" 
            type="email" 
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            aria-invalid={!!errors.email} 
          />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>
        <div>
          <Input 
            placeholder="Phone" 
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            aria-invalid={!!errors.phone} 
          />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
        </div>
        <div>
          <Input 
            placeholder="Departure city (optional)" 
            value={formData.departureCity}
            onChange={(e) => updateField("departureCity", e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Input 
            type="number" 
            min={1} 
            max={99} 
            className="w-28" 
            value={formData.travelers}
            onChange={(e) => updateField("travelers", parseInt(e.target.value) || 1)}
          />
          <span className="text-sm text-muted-foreground">travelers</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={formData.indianMeals}
              onChange={(e) => updateField("indianMeals", e.target.checked)}
            />
            Indian meals
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("justify-start", !formData.startDate && "text-muted-foreground")}> 
              <CalendarIcon className="mr-2 size-4"/> {formData.startDate ? formData.startDate.toDateString() : "Start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar 
              mode="single" 
              selected={formData.startDate} 
              onSelect={(date) => updateField("startDate", date)} 
              initialFocus 
              className={cn("p-3 pointer-events-auto")} 
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("justify-start", !formData.endDate && "text-muted-foreground")}> 
              <CalendarIcon className="mr-2 size-4"/> {formData.endDate ? formData.endDate.toDateString() : "End date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar 
              mode="single" 
              selected={formData.endDate} 
              onSelect={(date) => updateField("endDate", date)} 
              initialFocus 
              className={cn("p-3 pointer-events-auto")} 
            />
          </PopoverContent>
        </Popover>
      </div>

      <Textarea 
        rows={4} 
        placeholder="Tell us about your ideal itinerary, budget, or special requests" 
        value={formData.message}
        onChange={(e) => updateField("message", e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default InquiryBookingForm;
