"use client";

import Schedule from "@/components/dashboard/schedule";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import { useEffect, useState } from "react";
import { Task, Event, Calendar } from "@/lib/types";
import { getEvents, getTasks } from "@/lib/scheduleCrud";
import { useUser } from "@/contexts/UserContext";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const { events, tasks, setEvents, setTasks } = useScheduleItems();
  const { user } = useUser();

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

  // useEffect(() => {
  //   const fetchCalendars = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8000/calendars");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch calendars");
  //       }
  //       const data = await response.json();
  //       setCalendars(data);
  //     } catch (error) {
  //       console.error("Failed to fetch calendars:", error);
  //     }
  //   };

  //   fetchCalendars();
  // }, []);

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
