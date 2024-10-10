"use client";

import Schedule from "@/components/dashboard/schedule";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProtectedData } from "../../lib/auth";

export default function Dashboard() {
  const { items, setItems } = useScheduleItems();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleItemUpdate = (updatedItem: ScheduleItem) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.siid === updatedItem.siid ? updatedItem : item
      )
    );
  };

  const handleItemCreate = (newItem: ScheduleItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  useEffect(() => {
    const fetchScheduleItems = async () => {
      try {
        const storedUser = localStorage.getItem("User");
        const userID = storedUser ? JSON.parse(storedUser).id : null;
        console.log("Fetching schedule items...");
        const response = await fetch(
          `http://localhost:8000/users/${userID}/events`
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
        items={items}
        onItemUpdate={handleItemUpdate}
        onItemCreate={handleItemCreate}
      />
    </>
  );
}
