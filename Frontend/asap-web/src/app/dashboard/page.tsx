"use client";

import { useState } from "react";

import Schedule from "@/components/ui/schedule";
import { useScheduleItems } from "@/contexts/ScheduleContext";

export default function Dashboard() {
  const { items, setItems } = useScheduleItems();

  const handleItemUpdate = (updatedItem: ScheduleItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleItemCreate = (newItem: ScheduleItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

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
