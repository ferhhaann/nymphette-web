import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InquiryBookingForm } from "./regions/InquiryBookingForm";

interface GroupTourBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: {
    id: string;
    title: string;
    destination: string;
    start_date: string;
    end_date: string;
    duration: string;
    price: number;
    group_type?: string;
    difficulty_level?: string;
  };
}

export const GroupTourBookingModal = ({ isOpen, onClose, tour }: GroupTourBookingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Join Group Tour: {tour.title}</DialogTitle>
        </DialogHeader>
        <InquiryBookingForm 
          country={tour.destination} 
          source="group_tour" 
          sourceId={tour.id}
          tourDetails={tour}
        />
      </DialogContent>
    </Dialog>
  );
};