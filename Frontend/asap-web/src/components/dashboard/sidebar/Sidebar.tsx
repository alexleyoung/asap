"use client";

import { useCurrentDate } from "@/contexts/ScheduleContext";

import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import CreateItemDialog from "./CreateItemDialog";

export default function Sidebar() {
  const { currentDate, setCurrentDate } = useCurrentDate();

  return (
    <aside className='border-r border-border p-2'>
      <CreateItemDialog />

      <Calendar
        mode='single'
        selected={currentDate}
        onSelect={(day) => {
          if (day) {
            setCurrentDate(day); // only set if day is valid
          }
        }}
      />

      <div className='flex flex-col gap-2'>
        <div>
          <h3 className='font-semibold'>Calendars</h3>
        </div>
      </div>
    </aside>
  );
}
