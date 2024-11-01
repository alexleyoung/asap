"use client";

import Schedule from "@/components/dashboard/schedule";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Task, Event, Calendar } from "@/lib/types";

export default function Dashboard() {
  const { events, tasks, setEvents, setTasks } = useScheduleItems();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [calendars, setCalendars] = useState<Calendar[]>([]);

  const handleEventUpdate = (updatedEvent: Event) => {};
  const handleTaskUpdate = (updatedTask: Task) => {};

  useEffect(() => {
    (async () => {
      try {
        const storedUser = localStorage.getItem("User");
        const userID = storedUser ? JSON.parse(storedUser).id : null;
        if (!userID) return;

        const response = await fetch(
          `http://localhost:8000/users/${userID}/events`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch schedule items");
        }
        const data = await response.json();
        const eventsWithDates = data.map((item: Event) => ({
          ...item,
          start: new Date(item.start), // Convert date string to Date object
          end: new Date(item.end), // Convert date string to Date object
        }));
        setEvents(eventsWithDates);
      } catch (error) {
        console.error("Failed to fetch schedule items:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [setEvents]);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch("http://localhost:8000/calendars");
        if (!response.ok) {
          throw new Error("Failed to fetch calendars");
        }
        const data = await response.json();
        setCalendars(data);
      } catch (error) {
        console.error("Failed to fetch calendars:", error);
      }
    };

    fetchCalendars();
  }, []);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const data = await getProtectedData("token");
  //       if (data) {
  //         setLoading(false);
  //       } else {
  //         router.back();
  //         console.log("Not authenticated");
  //       }
  //     } catch (error) {
  //       router.back();
  //       console.log("An error occurred. Please try again.");
  //     }
  //   };
  //   checkAuth();
  // }, [router]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <Schedule
        events={}
        tasks={}
        onEventUpdate={handleEventUpdate}
        onTaskUpdate={handleTaskUpdate}
        selectedCalendars={calendars}
      />
    </>
  );
}
