import { DialogHeader } from "@/components/ui/dialog";
import { EventForm } from "../forms/EventForm";
import { TaskForm } from "../forms/TaskForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createEvent, createTask } from "../../../lib/scheduleCrud";
import { useEffect, useState } from "react";
import { EventPost } from "@/lib/types";

interface createItemTabsProps {}

interface CreateItemTabsProps {
  onFormSubmit: (data: EventPost) => void;
  onItemCreate: (item: ScheduleItem) => void;
}

export default function CreateItemTabs({
  onFormSubmit,
  onItemCreate,
}: CreateItemTabsProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Define loading state
  const [items, setItems] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    const storedUserId = storedUser ? JSON.parse(storedUser).id : null;
    setUserId(storedUserId);
  }, []);

  const handleEventSubmit = async (eventData: EventPost) => {};

  return (
    <Tabs defaultValue='event' className='w-full'>
      <DialogHeader>
        <TabsList className='w-full flex mt-6'>
          <TabsTrigger value='event' className='flex-1'>
            <span>Event</span>
          </TabsTrigger>
          <TabsTrigger value='task' className='flex-1'>
            <span>Task</span>
          </TabsTrigger>
        </TabsList>
      </DialogHeader>
      <TabsContent value='event'>
        <EventForm onSubmit={handleEventSubmit} onItemCreate={eventCreate} />
      </TabsContent>
      <TabsContent value='task'>
        <TaskForm onSubmit={() => {}} />
      </TabsContent>
    </Tabs>
  );
}
