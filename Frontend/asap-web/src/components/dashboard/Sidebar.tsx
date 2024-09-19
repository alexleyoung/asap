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
          <DialogContent className="w-full">
            <Tabs defaultValue="event" className="w-full">
              <DialogHeader>
                <TabsList className="w-full flex mt-6">
                  <TabsTrigger value="event" className="flex-1">
                    <span>Event</span>
                  </TabsTrigger>
                  <TabsTrigger value="task" className="flex-1">
                    <span>Task</span>
                  </TabsTrigger>
                </TabsList>
              </DialogHeader>
              <TabsContent value="event">
                <EventForm onSubmit={() => {}} />
              </TabsContent>
              <TabsContent value="task">
                <TaskForm onSubmit={() => {}} />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  );
}
