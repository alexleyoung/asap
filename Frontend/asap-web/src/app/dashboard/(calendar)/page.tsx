"use client";

import Schedule from "@/components/dashboard/schedule";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import { useEffect, useState } from "react";
import { Task, Event, Calendar } from "@/lib/types";
import {
  getEvents,
  getCalendars,
  getTasks,
  updateEvent,
  updateTask,
} from "@/lib/scheduleCrud";
import { useUser } from "@/contexts/UserContext";
import { useCalendars } from "@/contexts/CalendarsContext";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { events, tasks, setEvents, setTasks } = useScheduleItems();
  const { calendars, setCalendars, selectedCalendars } = useCalendars();

  const router = useRouter();

  const handleEventUpdate = (updatedEvent: Event) => {
    let old: Event;
    setEvents((prevEvents) => {
      return prevEvents.map((event) => {
        if (event.id === updatedEvent.id) {
          old = event;
          return updatedEvent;
        }
        return event;
      });
    });
    try {
      updateEvent(updatedEvent);
    } catch (error) {
      setEvents((prevEvents) =>
        prevEvents.filter((e) => {
          if (e.id === updatedEvent.id) {
            return old;
          }
          return e;
        })
      );
    }
  };
  const handleTaskUpdate = (updatedTask: Task) => {
    let old: Task;
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === updatedTask.id) {
          old = task;
          return updatedTask;
        }
        return task;
      });
    });
    try {
      updateTask(updatedTask);
    } catch (error) {
      setTasks((prevTasks) =>
        prevTasks.filter((t) => {
          if (t.id === updatedTask.id) {
            return old;
          }
          return t;
        })
      );
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (!user) {
          // router.push("/");
          return;
        }
        setTasks((await getTasks(user.id))?.tasks || []);
        const calendars = await getCalendars(user.id);
        setCalendars(calendars);

        setEvents(await getEvents(calendars));
      } catch (error) {
        console.error("Failed to fetch schedule items:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [setEvents, setTasks, user, setCalendars, router]);

  return (
    <>
      {loading ? (
        <main className='grid place-items-center h-full p-6'>
          <Skeleton className='size-full' />
        </main>
      ) : (
        <Schedule
          events={events}
          tasks={tasks}
          onEventUpdate={handleEventUpdate}
          onTaskUpdate={handleTaskUpdate}
          selectedCalendars={selectedCalendars}
        />
      )}
    </>
  );
}
