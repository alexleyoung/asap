"use client";

import Schedule from "@/components/dashboard/schedule";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import { useEffect, useState } from "react";
import { Task, Event } from "@/lib/types";
import { getEvents, getTasks } from "@/lib/scheduleCrud";
import { useUser } from "@/contexts/UserContext";
import { useCalendars } from "@/contexts/CalendarsContext";
import { getCalendars } from "@/lib/scheduleCrud";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { events, tasks, setEvents, setTasks } = useScheduleItems();
  const { calendars, setCalendars } = useCalendars();

  const router = useRouter();

  const handleEventUpdate = (updatedEvent: Event) => {};
  const handleTaskUpdate = (updatedTask: Task) => {};

  useEffect(() => {
    (async () => {
      try {
        if (!user) {
          router.push("/");
          return;
        }
        setEvents((await getEvents(user.id)) || []);
        setTasks((await getTasks(user.id)) || []);
        setCalendars((await getCalendars(user.id)) || []);
      } catch (error) {
        console.error("Failed to fetch schedule items:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [setEvents, setTasks, user, setCalendars, router]);

  return (
    <>
      <Schedule
        events={events}
        tasks={tasks}
        onEventUpdate={handleEventUpdate}
        onTaskUpdate={handleTaskUpdate}
        selectedCalendars={calendars}
      />
    </>
  );
}
