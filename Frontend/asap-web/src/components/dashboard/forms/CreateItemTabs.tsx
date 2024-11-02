"use client";

import { useState, useEffect } from "react";
import { DialogHeader } from "@/components/ui/dialog";
import { EventForm } from "../forms/EventForm";
import { TaskForm } from "../forms/TaskForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createEvent, createTask } from "@/lib/scheduleCrud";
import { Event, Task, EventPost, TaskPost } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useScheduleItems } from "@/contexts/ScheduleContext";

export default function CreateItemTabs() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { setEvents, setTasks } = useScheduleItems();
  const { toast } = useToast();

  const handleEventSubmit = async (eventData: EventPost) => {
    if (!user) {
      console.log("user not found");
      toast({
        title: "Error",
        description: "User ID not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const createdEvent = await createEvent({ ...eventData, userID: user.id });
      setEvents((prevEvents) => [...prevEvents, createdEvent]);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (taskData: TaskPost) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User ID not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const createdTask = await createTask({ ...taskData, userID: user.id });
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      console.error("Failed to create task:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue='event' className='w-full'>
      <DialogHeader>
        <TabsList className='w-full flex mt-4'>
          <TabsTrigger value='event' className='flex-1'>
            <span>Event</span>
          </TabsTrigger>
          <TabsTrigger value='task' className='flex-1'>
            <span>Task</span>
          </TabsTrigger>
        </TabsList>
      </DialogHeader>
      <TabsContent value='event'>
        <EventForm
          onSubmit={handleEventSubmit}
          loading={loading}
          calendars={[]}
        />
      </TabsContent>
      <TabsContent value='task'>
        <TaskForm onSubmit={handleTaskSubmit} loading={loading} />
      </TabsContent>
    </Tabs>
  );
}
