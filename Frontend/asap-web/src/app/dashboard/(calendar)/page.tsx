"use client";

import Schedule from "@/components/dashboard/schedule";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import { useEffect, useState } from "react";
import { Task, Event, Calendar } from "@/lib/types";
import { getEvents, getCalendars, getTasks } from "@/lib/scheduleCrud";
import { useUser } from "@/contexts/UserContext";
import { useCalendars } from "@/contexts/CalendarsContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { events, tasks, setEvents, setTasks } = useScheduleItems();
  const { calendars, setCalendars, selectedCalendars } = useCalendars();

  const router = useRouter();

  const handleEventUpdate = (updatedEvent: Event) => {};
  const handleTaskUpdate = (updatedTask: Task) => {};

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
      <Schedule
        events={events}
        tasks={tasks}
        onEventUpdate={handleEventUpdate}
        onTaskUpdate={handleTaskUpdate}
        selectedCalendars={selectedCalendars}
      />
    </>
  );
}
