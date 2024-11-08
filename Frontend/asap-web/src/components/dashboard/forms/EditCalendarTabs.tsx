"use client";

import { useState, useEffect } from "react";
import { DialogHeader } from "@/components/ui/dialog";
import { EventForm } from "../forms/EventForm";
import { TaskForm } from "../forms/TaskForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createEvent, createTask } from "@/lib/scheduleCrud";
import { Event, Task, EventPost, TaskPost, Calendar } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import EditCalendarForm from "./EditCalendarForm";
import { CalendarMembers } from "./CalendarMembers";

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
        <CalendarMembers />
      </TabsContent>
    </Tabs>
  );
}
