import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { useCurrentDate, useView } from "@/contexts/ScheduleContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateItemTabs from "../forms/CreateItemTabs";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Event, Task, Calendar } from "@/lib/types"; // Import the new types
import { useScheduleItems } from "@/contexts/ScheduleContext";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import EditEventDialog from "./EditEventDialog";
import { snapToTimeSlot } from "@/lib/utils";
import { useHotkeys } from "react-hotkeys-hook";

export type ScheduleProps = {
  events: Event[];
  tasks: Task[];
  onEventUpdate: (event: Event) => void;
  onTaskUpdate: (task: Task) => void;
  selectedCalendars: Calendar[];
};

export default function Schedule({
  events,
  tasks,
  onEventUpdate,
  onTaskUpdate,
  selectedCalendars,
}: ScheduleProps) {
  const { view, setView } = useView();
  const { setEvents } = useScheduleItems();
  const { currentDate } = useCurrentDate();
  const [newItem, setNewItem] = useState<Partial<Event | Task> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);

  useHotkeys("w", () => setView("week"));
  useHotkeys("m", () => setView("month"));
  useHotkeys("d", () => setView("day"));

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket("ws://localhost:8000/notifications");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      console.log("Received message:", event.data);
      const notification = JSON.parse(event.data);

      if (notification.type === "event_created") {
        setEvents((prevEvents) => [...prevEvents, notification.data]);
      }

      if (notification.type === "event_deleted") {
        setEvents((prevEvents) => {
          return prevEvents.filter(
            (event) => event.id !== notification.data.id
          );
        });
      }

      if (notification.type === "event_updated") {
        setEvents((prevEvents) => {
          return prevEvents.map((event) => {
            if (event.id === notification.data.id) {
              const updatedEvent = {
                ...event,
                ...notification.data.updated_fields,
                start: notification.data.start
                  ? new Date(notification.data.start)
                  : null,
                end: notification.data.end
                  ? new Date(notification.data.end)
                  : null,
              };

              return updatedEvent;
            }
            return event;
          });
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");

      // Reconnect only if the connection is closed and it's not already reconnecting
      setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.log("Attempting to reconnect...");
          // Open a new WebSocket connection only if the previous one was closed
          const newWs = new WebSocket("ws://localhost:8000/ws/notifications");
          setWs(newWs); // Update the state with the new WebSocket connection
        }
      }, 5000);
    };

    // Set the WebSocket instance in state
    setWs(ws);

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, []);

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditing(true);

  function handleEditTask(task: Task): void {
    throw new Error("Function not implemented.");
  }

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    // Implement drag end logic here
  }, []);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[snapToTimeSlot]}
      sensors={[pointerSensor]}
      autoScroll={false}>
      <div className='flex-grow h-full flex flex-col p-4 bg-background text-foreground'>
        <ScrollArea className='h-full'>
          {view === "day" && (
            <DayView
              currentDate={currentDate}
              events={events}
              tasks={tasks}
              selectedCalendars={selectedCalendars}
              onEditEvent={handleEditEvent}
              onEditTask={handleEditTask}
              scheduleRef={scheduleRef}
            />
          )}
          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              events={events}
              tasks={tasks}
              selectedCalendars={selectedCalendars}
              onEditEvent={handleEditEvent}
              onEditTask={handleEditTask}
              scheduleRef={scheduleRef}
            />
          )}
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              events={events}
              tasks={tasks}
              selectedCalendars={selectedCalendars}
              onEditEvent={handleEditEvent}
              onEditTask={handleEditTask}
            />
          )}
        </ScrollArea>
        <Dialog open={newItem !== null} onOpenChange={() => setNewItem(null)}>
          <DialogHeader>
            <DialogTitle className='sr-only'>Create New Item</DialogTitle>
            <DialogDescription className='sr-only'>
              Create a new item
            </DialogDescription>
          </DialogHeader>
          <DialogContent>
            <CreateItemTabs />
          </DialogContent>
        </Dialog>
      </div>
      <EditEventDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        eventData={editingEvent}
        onSubmit={(updatedEvent: Event) => {
          onEventUpdate(updatedEvent);
          setIsEditing(false);
        }}
      />
    </DndContext>
  );
}
