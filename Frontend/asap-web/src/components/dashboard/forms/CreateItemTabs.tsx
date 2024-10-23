import { DialogHeader } from "@/components/ui/dialog";
import { EventForm } from "../forms/EventForm";
import { TaskForm } from "../forms/TaskForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createItem } from "../../../lib/scheduleCrud";
import { useEffect, useState } from "react";
import { EventFormData } from "@/lib/types";

interface createItemTabsProps {}

interface CreateItemTabsProps {
  onFormSubmit: (data: EventFormData) => void;
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

  type EventDataToSend = Omit<EventFormData, "uid" | "siid" | "type">;

  const handleEventSubmit = async (eventData: EventFormData) => {
    const {
      title,
      start,
      end,
      location,
      description,
      category,
      frequency,
      calendarID,
    } = eventData;
    const dataToSend: EventDataToSend = {
      title,
      start,
      end,
      location: location || "",
      description: description || "",
      category: category || "",
      frequency: frequency || "",
      calendarID: typeof calendarID === "number" ? calendarID : 0,
    };
    console.log("Event data:", dataToSend);
    console.log("User ID:", userId);
    try {
      setLoading(true);
      let response;
      if (userId) {
        response = await createItem({ id: userId }, dataToSend); // Call createItem with event data
        console.log("Response:", response);
        const scheduleItem: ScheduleItem = {
          ...eventData,
          siid: 0, // or generate a unique id
          uid: userId ? parseInt(userId) : 0,
          color: "", // or assign a default color
          type: "event",
        };
        console.log("calling onItemCreate with:", scheduleItem);
        onItemCreate(scheduleItem);
      } else {
        throw new Error("User ID is null");
      }
      console.log("Event created successfully:", response);

      onFormSubmit(eventData);
    } catch (error) {
      console.error("Failed to create event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="event" className="w-full">
      <DialogHeader>
        <TabsList className="w-full flex mt-6">
          <TabsTrigger value="event" className="flex-1">
            <span>Event</span>
          </TabsTrigger>
          <TabsTrigger value="task" className="flex-1">
            <span>Task</span>
          </TabsTrigger>
        </TabsList>
      </DialogHeader>
      <TabsContent value="event">
        <EventForm onSubmit={handleEventSubmit} onItemCreate={onItemCreate} />
      </TabsContent>
      <TabsContent value="task">
        <TaskForm onSubmit={() => {}} />
      </TabsContent>
    </Tabs>
  );
}
