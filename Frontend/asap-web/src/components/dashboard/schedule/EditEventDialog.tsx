import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Event } from "@/lib/types"; // Import the Event type
import EditEventForm from "../forms/EditEventForm"; // Assuming this component exists

type EditEventDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  eventData: Event | null;
  onSubmit: (updatedEvent: Event) => void;
};

export default function EditEventDialog({
  isOpen,
  onClose,
  eventData,
  onSubmit,
}: EditEventDialogProps) {
  if (!eventData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Edit the details of the selected event.
          </DialogDescription>
        </DialogHeader>
        <EditEventForm
          eventData={{ ...eventData }}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
