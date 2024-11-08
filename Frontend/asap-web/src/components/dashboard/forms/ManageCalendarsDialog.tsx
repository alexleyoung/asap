import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { Calendar } from "@/lib/types";
import EditCalendarForm from "./EditCalendarForm";
import { set } from "date-fns";
import EditCalendarTabs from "./EditCalendarTabs";
import { on } from "events";

interface ManageCalendarsProps {
  calendars: Calendar[];
  onClose: () => void; // Function to close or hide the manage view
  onUpdate: (calendar: Calendar) => void; // Function to update calendar
  onDelete: (calendar: Calendar) => void; // Function to delete calendar
}

export const ManageCalendarsDialog = ({
  calendars,
  onClose,
  onUpdate,
  onDelete,
}: ManageCalendarsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(
    null
  );
  const [updatedCalendars, setUpdatedCalendars] =
    useState<Calendar[]>(calendars);

  useEffect(() => {
    setUpdatedCalendars(calendars);
  }, [calendars]);

  const handleSave = (updatedCalendar: Calendar) => {
    onUpdate(updatedCalendar); // Call the function passed in props to update the calendar
    setIsEditing(false);
  };

  const handleEditClick = (calendar: Calendar) => {
    setSelectedCalendar(calendar);
    setIsEditing(true);
  };

  const handleDelete = (calendar: Calendar) => {
    onDelete(calendar);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calendars</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogDescription>
            {isEditing ? (
              selectedCalendar ? (
                <EditCalendarTabs
                  calendar={selectedCalendar}
                  onSave={handleSave}
                  onClose={onClose}
                />
              ) : null
            ) : calendars.length === 0 ? (
              <div>No calendars available</div>
            ) : (
              calendars.map((calendar) => (
                <div key={calendar.id}>
                  <span>{calendar.name}</span>
                  <Button
                    onClick={() => handleEditClick(calendar)}
                    className='m-3'>
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(calendar)}
                    variant='destructive'>
                    Delete
                  </Button>
                </div>
              ))
            )}
          </DialogDescription>
          <DialogFooter>
            {isEditing && (
              <Button variant='outline' onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
