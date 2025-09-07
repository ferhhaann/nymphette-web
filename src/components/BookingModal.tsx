import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InquiryBookingForm } from "./regions/InquiryBookingForm"
import { Button } from "./ui/button"

interface BookingModalProps {
  trigger?: React.ReactNode
  source?: 'package' | 'group_tour' | 'contact' | 'general'
  sourceId?: string
  country?: string
}

export const BookingModal = ({ 
  trigger, 
  source = 'general',
  sourceId,
  country
}: BookingModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="secondary" className="bg-foreground hover:bg-foreground/90 text-background">
            Book Now
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[890px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book Your Travel Experience</DialogTitle>
        </DialogHeader>
        <InquiryBookingForm 
          source={source} 
          sourceId={sourceId}
          country={country}
        />
      </DialogContent>
    </Dialog>
  )
}
