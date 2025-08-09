import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { TravelPackage } from "@/data/packagesData";

const FormSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email(),
  phone: z.string().min(7, "Enter a valid phone"),
  travelers: z.coerce.number().min(1).max(99),
  departureCity: z.string().optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  indianMeals: z.boolean().optional(),
  message: z.string().optional(),
});

interface Props { pkg: TravelPackage | null; regionKey: string }

const InquiryBookingForm: React.FC<Props> = ({ pkg, regionKey }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { travelers: 2, indianMeals: true },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast({ title: "Request sent", description: `We\'ll contact you shortly for ${pkg?.title ?? regionKey} trip.` });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {pkg && (
        <div className="text-sm text-muted-foreground">For package: <span className="font-medium">{pkg.title}</span></div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Input placeholder="Full name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Input placeholder="Email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Input placeholder="Phone" {...register("phone")} aria-invalid={!!errors.phone} />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <Input placeholder="Departure city (optional)" {...register("departureCity")} />
        </div>
        <div className="flex gap-2 items-center">
          <Input type="number" min={1} max={99} className="w-28" {...register("travelers", { valueAsNumber: true })} />
          <span className="text-sm text-muted-foreground">travelers</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("indianMeals")} />
            Indian meals
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("justify-start", !startDate && "text-muted-foreground")}> 
              <CalendarIcon className="mr-2 size-4"/> {startDate ? startDate.toDateString() : "Start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={startDate} onSelect={(d)=> setValue("startDate", d as Date)} initialFocus className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("justify-start", !endDate && "text-muted-foreground")}> 
              <CalendarIcon className="mr-2 size-4"/> {endDate ? endDate.toDateString() : "End date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={endDate} onSelect={(d)=> setValue("endDate", d as Date)} initialFocus className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </div>

      <Textarea rows={4} placeholder="Tell us about your ideal itinerary, budget, or special requests" {...register("message")} />

      <div className="flex justify-end gap-2">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default InquiryBookingForm;
