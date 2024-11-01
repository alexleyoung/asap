"use client";

import { useState, useEffect } from "react";
import { DialogHeader } from "@/components/ui/dialog";
import { EventForm } from "../forms/EventForm";
import { TaskForm } from "../forms/TaskForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createEvent, createTask } from "@/lib/scheduleCrud";
import { Event, Task, EventPost, TaskPost } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface CreateItemTabsProps {
  onItemCreate: (item: Event | Task) => void;
}

export default function CreateItemTabs({ onItemCreate }: CreateItemTabsProps) {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    const storedUserId = storedUser ? JSON.parse(storedUser).id : null;
    setUserId(storedUserId);
  }, []);

  const handleEventSubmit = async (eventData: EventPost) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const createdEvent = await createEvent({ ...eventData, userID: userId });
      onItemCreate(createdEvent);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (error) {
      console.error("Failed to create event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (taskData: TaskPost) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const createdTask = await createTask({ ...taskData, userID: userId });
      onItemCreate(createdTask);
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
        <EventForm onSubmit={handleEventSubmit} />
      </TabsContent>
      <TabsContent value='task'>
        <TaskForm onSubmit={handleTaskSubmit} />
      </TabsContent>
    </Tabs>
  );
}
