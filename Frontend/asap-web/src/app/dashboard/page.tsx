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

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const data = await getProtectedData("token");
  //       if (data) {
  //         setLoading(false);
  //       } else {
  //         //SIGN IN IS NOT A LINK LOL
  //         router.push("/signin");
  //       }
  //     } catch (error) {
  //       router.push("/signin");
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
