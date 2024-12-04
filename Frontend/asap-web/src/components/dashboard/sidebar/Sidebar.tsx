"use client";

import { useCurrentDate } from "@/contexts/ScheduleContext";

import { Calendar } from "@/components/ui/calendar";
import CreateItemDialog from "../forms/CreateItemDialog";
import CalendarsCollapsible from "./CalendarsCollapsible";
import TodosCollapsible from "./TodosCollapsible";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { currentDate, setCurrentDate } = useCurrentDate();

  return (
    <aside className='border-r border-border p-4 flex flex-col gap-4'>
      <CreateItemDialog />
      <Link href='/dashboard/tasks'>
        <Button variant='outline' className='w-full font-semibold'>
          See Tasks
        </Button>
      </Link>

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
        <TodosCollapsible />
      </div>
    </aside>
  );
}
