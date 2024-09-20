"use client";

import { useCurrentDate } from "@/contexts/ScheduleContext";

import { Calendar } from "@/components/ui/calendar";
import CreateItemDialog from "./CreateItemDialog";
import CalendarsCollapsible from "./CalendarsCollapsible";

export default function Sidebar() {
  const { currentDate, setCurrentDate } = useCurrentDate();

  return (
    <aside className='border-r border-border p-4 flex flex-col gap-4'>
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
        <CalendarsCollapsible />
      </div>
    </aside>
  );
}
