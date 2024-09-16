"use client";

import { useCurrentDate } from "@/contexts/ScheduleContext";

import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventForm } from "./forms/EventForm";

export default function Sidebar() {
  const { currentDate, setCurrentDate } = useCurrentDate();

  return (
    <aside className='border-r border-border p-2'>
      <Calendar
        mode='single'
        selected={currentDate}
        onSelect={(day) => {
          if (day) {
            setCurrentDate(day); // only set if day is valid
          }
        }}
      />

      <Separator className='mb-2' />

      <div className='flex flex-col gap-2'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline'>Create</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
              <DialogDescription>Create a new event or task</DialogDescription>
            </DialogHeader>
            <EventForm onSubmit={() => {}} />
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  );
}
