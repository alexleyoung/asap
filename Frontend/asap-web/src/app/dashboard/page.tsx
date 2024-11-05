"use client";

import Schedule from "@/components/dashboard/schedule";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProtectedData } from "../../lib/auth";
import { fetchCalendars } from "@/lib/scheduleCrud";

export default function Dashboard() {
  const { items, setItems } = useScheduleItems();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [calendars, setCalendars] = useState([]);

  const handleItemUpdate = (updatedItem: ScheduleItem) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.siid === updatedItem.siid ? updatedItem : item
      )
    );
  };

  useEffect(() => {
    const fetchScheduleItems = async () => {
      try {
        const storedUser = localStorage.getItem("User");
        const userID = storedUser ? JSON.parse(storedUser).id : null;
        console.log("Fetching schedule items...");
        const response = await fetch(
          `http://localhost:8000/users/${userID}/events`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch schedule items");
        }
        const data = await response.json();
        const itemsWithDates = data.map((item: any) => ({
          ...item,
          start: new Date(item.start), // Ensure start is a Date object
          end: new Date(item.end), // Ensure end is a Date object
          siid: item.id,
          uid: item.userID,
        }));
        console.log("Fetched data:", data);
        setItems(itemsWithDates);
      } catch (error) {
        console.error("Failed to fetch schedule items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleItems();
  }, []);

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
        items={items}
        onItemUpdate={handleItemUpdate}
        selectedCalenders={calendars}
      />
    </>
  );
}
