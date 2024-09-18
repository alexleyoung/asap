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
import { TaskForm } from "./forms/TaskForm";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Sidebar() {
  const { currentDate, setCurrentDate } = useCurrentDate();

  return (
    <aside className="border-r border-border p-2">
      <Calendar
        mode="single"
        selected={currentDate}
        onSelect={(day) => {
          if (day) {
            setCurrentDate(day); // only set if day is valid
          }
        }}
      />

      <Separator className="mb-2" />

      <div className="flex flex-col gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <Tabs defaultValue="event" className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="event">Event</TabsTrigger>
                  <TabsTrigger value="task">Task</TabsTrigger>
                </TabsList>
                <TabsContent value="event">
                  Create an event here.
                  <EventForm onSubmit={() => {}} />
                </TabsContent>
                <TabsContent value="task">
                  Create a task here.
                  <TaskForm onSubmit={() => {}} />
                </TabsContent>
              </Tabs>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  );
}
