"use client";

import { DialogHeader } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditCalendarForm from "./EditCalendarForm";
import { CalendarMembers } from "./CalendarMembers";
import { Calendar } from "@/lib/types";
import { deleteCalendar } from "@/lib/scheduleCrud";
import { useCalendars } from "@/contexts/CalendarsContext";
import { useToast } from "@/hooks/use-toast";

interface EditCalendarTabsProps {
  calendar: Calendar;
  onSave: (updatedCalendar: Calendar) => void;
  onClose: () => void;
}

export default function EditCalendarTabs({
  calendar,
  onSave,
  onClose,
}: EditCalendarTabsProps) {
  const handleSave = async (updatedCalendar: Calendar) => {
    onSave(updatedCalendar);
    onClose();
  };
  const { toast } = useToast();

  const { setCalendars, toggleCalendar } = useCalendars();

  const handleDeleteCalendar = async (calendar: Calendar) => {
    try {
      await deleteCalendar(calendar);

      setCalendars((prevCalendars) =>
        prevCalendars.filter((c) => c.id !== calendar.id)
      );

      toggleCalendar(calendar);

      toast({
        title: "Calendar and associated events deleted successfully.",
        duration: 3000,
      });

      console.log("Calendar and associated events deleted successfully.");
    } catch (error) {
      toast({
        title: "Error deleting calendar and events.",
        description: "Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      console.error("Error deleting calendar and events:", error);
    }
  };

  return (
    <Tabs defaultValue='details' className='w-full'>
      <DialogHeader>
        <TabsList className='w-full flex mt-4'>
          <TabsTrigger value='details' className='flex-1'>
            <span>Details</span>
          </TabsTrigger>
          <TabsTrigger value='members' className='flex-1'>
            <span>Members</span>
          </TabsTrigger>
        </TabsList>
      </DialogHeader>
      <TabsContent value='details'>
        <EditCalendarForm
          calendar={calendar}
          onSave={handleSave}
          onDelete={handleDeleteCalendar}
        />
      </TabsContent>
      <TabsContent value='members'>
        <CalendarMembers calendar={calendar} />
      </TabsContent>
    </Tabs>
  );
}
