"use client";

import { useState, useEffect } from "react";
import {
  createItem,
  deleteEvent,
  deleteTask,
  generateSchedule,
} from "@/lib/schedule";
import { useUser } from "@/app/contexts/UserContext";
import useSWR from "swr";
import {
  convertDatesToTimezone,
  transformEvents,
  transformTasks,
} from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { Schedule } from "./Schedule";
import { ScheduleSkeleton } from "./ScheduleSkeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ScheduleWrapper() {
  const { user, loading } = useUser();
  const { toast } = useToast();

  // Always call hooks in the same order
  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR(
    user ? `/api/events?userId=${user.id}` : null, // Pass null to skip the fetch if user is not available
    fetcher
  );

  const {
    data: tasksData,
    error: tasksError,
    isLoading: tasksLoading,
  } = useSWR(user ? `/api/tasks?userId=${user.id}` : null, fetcher);

  // Initialize state once, with an empty array or the fetched data
  const [events, setEvents] = useState<CalendarEvent[]>(eventsData || []);
  const [tasks, setTasks] = useState<Task[]>(tasksData || []);

  // Sync state with SWR data when it changes
  useEffect(() => {
    if (eventsData) {
      setEvents(eventsData);
    }
  }, [eventsData]);

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData);
    }
  }, [tasksData]);

  // Handle loading and error states
  if (loading || eventsLoading || tasksLoading) {
    return <ScheduleSkeleton />;
  }

  if (eventsError || tasksError) {
    return <p>Error loading data</p>;
  }

  async function handleCreateItem(item: EventFormData | TaskFormData) {
    // Optimistic update
    try {
      if ("location" in item) {
        setEvents([...events, item as CalendarEvent]);
      } else {
        setTasks([...tasks, item as Task]);
      }
      const newItem = await createItem(item);
      if ("location" in item) {
        setEvents([...events, newItem]);
        // const data = (await generateSchedule({
        //   events: [...events, newItem],
        //   tasks,
        // })) as {
        //   events: CalendarEvent[];
        //   tasks: Task[];
        // };
        // // Update state with data
        // setEvents(data.events);
        // setTasks(data.tasks);
      } else if (newItem.auto_schedule) {
        toast({
          title: "Auto-scheduling task",
          description: "Your schedule is being updated...",
        });
        const data = (await generateSchedule({
          events,
          tasks: [...tasks, newItem],
        })) as {
          events: CalendarEvent[];
          tasks: Task[];
        };
        const formatted = convertDatesToTimezone(
          data,
          Intl.DateTimeFormat().resolvedOptions().timeZone
        );
        setEvents(formatted.events);
        setTasks(formatted.tasks);
      } else {
        setTasks([...tasks, newItem]);
      }
      toast({
        title: "Item created",
        description: "Your item has been created successfully 🎉",
      });
    } catch (error) {
      console.error("Failed to create item:", error);
      toast({
        title: "Failed to create item",
        description: "Try again later.",
      });
      if ("location" in item) {
        setEvents(events.filter((e) => e.id !== (item as CalendarEvent).id));
      } else {
        setTasks(tasks.filter((t) => t.id !== (item as Task).id));
      }
    }
  }

  async function handleDeleteEvent(event: CalendarEvent) {
    // Optimistic update
    setEvents(events.filter((e) => e.id !== event.id));
    try {
      await deleteEvent(event);
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully 🎉",
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast({
        title: "Failed to delete event",
        description: "Try again later.",
      });
      setEvents([...events, event]); // Revert the optimistic update
    }
  }

  async function handleDeleteTask(task: Task) {
    // Optimistic update
    setTasks(tasks.filter((t) => t.id !== task.id));
    try {
      await deleteTask(task);
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully 🎉",
      });
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast({
        title: "Failed to delete task",
        description: "Try again later.",
      });
      setTasks([...tasks, task]); // Revert the optimistic update
    }
  }

  return (
    <Schedule
      events={transformEvents(events)}
      tasks={transformTasks(tasks)}
      onCreateItem={handleCreateItem}
      onDeleteEvent={handleDeleteEvent}
      onDeleteTask={handleDeleteTask}
    />
  );
}
