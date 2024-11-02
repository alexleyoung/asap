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
  const { currentDate } = useCurrentDate();
  const [newItem, setNewItem] = useState<Partial<Event | Task> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null);

  useHotkeys("w", () => setView("week"));
  useHotkeys("m", () => setView("month"));
  useHotkeys("d", () => setView("day"));

  const handleItemCreate = (newItem: Event | Task) => {
    if ("dueDate" in newItem) {
      onTaskUpdate(newItem as Task);
    } else {
      onEventUpdate(newItem as Event);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditing(true);
  };

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
            <CreateItemTabs onItemCreate={handleItemCreate} />
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
