"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { useState } from "react";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventForm } from "../forms/EventForm";
import { TaskForm } from "../forms/TaskForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreateItemDialog() {
  const [open, setOpen] = useState(false);

  useHotkeys("t", (e) => {
    e.preventDefault();
    setOpen(true);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full'>
          Create (T)
        </Button>
      </DialogTrigger>
      <DialogContent className='w-full'>
        <Tabs defaultValue='event' className='w-full'>
          <DialogHeader>
            <TabsList className='w-full flex mt-6'>
              <TabsTrigger value='event' className='flex-1'>
                <span>Event</span>
              </TabsTrigger>
              <TabsTrigger value='task' className='flex-1'>
                <span>Task</span>
              </TabsTrigger>
            </TabsList>
          </DialogHeader>
          <TabsContent value='event'>
            <EventForm onSubmit={() => {}} />
          </TabsContent>
          <TabsContent value='task'>
            <TaskForm onSubmit={() => {}} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
