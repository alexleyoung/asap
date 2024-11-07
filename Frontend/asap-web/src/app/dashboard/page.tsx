"use client";

import Schedule from "@/components/dashboard/schedule";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import { useEffect, useState } from "react";
import { Task, Event, Calendar } from "@/lib/types";
import { getEvents, getTasks } from "@/lib/scheduleCrud";
import { useUser } from "@/contexts/UserContext";
import { useCalendarContext } from "@/contexts/CalendarsContext";
import { fetchCalendars } from "@/lib/scheduleCrud";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { events, tasks, setEvents, setTasks } = useScheduleItems();
  const { user } = useUser();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const { selectedCalendars } = useCalendarContext();

  const handleEventUpdate = (updatedEvent: Event) => {};
  const handleTaskUpdate = (updatedTask: Task) => {};

  useEffect(() => {
    (async () => {
      try {
        if (!user) return;
        setEvents((await getEvents(user.id)) || []);
        setTasks((await getTasks(user.id)) || []);
      } catch (error) {
        console.error("Failed to fetch schedule items:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [setEvents, setTasks, user]);

  useEffect(() => {
    const loadCalendars = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("User")!);
        const response = await fetchCalendars(user.id);
        setCalendars(response);
      } catch (error) {
        console.error("Failed to fetch calendars:", error);
      }
    };
    loadCalendars();
  }, []);

  return (
    <>
      <Schedule
        events={events}
        tasks={tasks}
        onEventUpdate={handleEventUpdate}
        onTaskUpdate={handleTaskUpdate}
        selectedCalendars={calendars} />
    </>
  );
}
