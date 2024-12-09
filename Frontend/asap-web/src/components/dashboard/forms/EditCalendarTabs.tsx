"use client";

import { DialogHeader } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditCalendarForm from "./EditCalendarForm";
import { CalendarMembers } from "./CalendarMembers";
import { Calendar } from "@/lib/types";

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
        <EditCalendarForm calendar={calendar} onSave={handleSave} />
      </TabsContent>
      <TabsContent value='members'>
        <CalendarMembers calendar={calendar} />
      </TabsContent>
    </Tabs>
  );
}
