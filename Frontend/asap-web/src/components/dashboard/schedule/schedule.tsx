import React, { useState, useRef, useCallback } from "react";
import { useCurrentDate, useView } from "@/contexts/ScheduleContext";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import { useHotkeys } from "react-hotkeys-hook";
import { differenceInMinutes, addMinutes } from "date-fns"; // Import date-fns functions
import { snapToTimeSlot } from "@/lib/utils";
import { isEvent, isTask } from "@/lib/utils";
import { deleteTask } from "@/lib/scheduleCrud";
import { Event, Task, Calendar } from "@/lib/types"; // Import the new types

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragCancelEvent,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateItemTabs from "../forms/CreateItemTabs";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import EditEventDialog from "./EditEventDialog";
import EditTaskDialog from "../forms/EditTaskDialog";
import PreviewTaskDialog from "../forms/PreviewTaskDialog";
import { toast } from "@/hooks/use-toast";

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
  const { setEvents, setTasks } = useScheduleItems();
  const { currentDate } = useCurrentDate();
  const [newItem, setNewItem] = useState<Partial<Event | Task> | null>(null);
  const [selectedItem, setSelectedItem] = useState<Event | Task | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null);

  useHotkeys("w", () => setView("week"));
  useHotkeys("m", () => setView("month"));
  useHotkeys("d", () => setView("day"));

  const [draggedItem, setDraggedItem] = useState<Event | Task | null>(null);
  const [previewDate, setPreviewDate] = useState<Date | null>(null);

  const handleEditEvent = (event: Event) => {
    setSelectedItem(event);
    setIsEditing(true);
  };
  function handlePreviewTask(task: Task): void {
    setSelectedItem(task);
    setPreviewing(true);
  }
  function handleEditTask(task: Task | null): void {
    setSelectedItem(task);
    setPreviewing(false);
    setIsEditing(true);
  }
  async function handleDeleteTask(task: Task | null): Promise<void> {
    if (!task) return;
    const old = task;
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task?.id));
    try {
      await deleteTask(task);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete task:", error);
      setTasks((prevTasks) => [...prevTasks, old]);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
    setSelectedItem(task);
    setPreviewing(false);
  }

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const item = event.active.data.current as Event | Task;
    setDraggedItem(item);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    if (!event.over) return;

    const dropZoneId = event.over.id as string;
    const [, dateStr] = dropZoneId.split("dropzone-");
    const [year, month, day, hour, minute] = dateStr.split("-").map(Number);
    const dropDate = new Date(year, month - 1, day, hour, minute);
    setPreviewDate(dropDate);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setDraggedItem(null);
      setPreviewDate(null);

      if (!over) return;

      const draggedItem = active.data.current as Event | Task;
      const dropZoneId = over.id as string;

      const [, dateStr] = dropZoneId.split("dropzone-");
      const [year, month, day, hour, minute] = dateStr.split("-").map(Number);

      const dropDate = new Date(year, month - 1, day, hour, minute);

      if (isEvent(draggedItem)) {
        const duration = differenceInMinutes(
          draggedItem.end,
          draggedItem.start
        );
        const updatedEvent: Event = {
          ...draggedItem,
          start: dropDate,
          end: addMinutes(dropDate, duration),
        };
        onEventUpdate(updatedEvent);
      } else if (isTask(draggedItem)) {
        const updatedTask: Task = {
          ...draggedItem,
          start: dropDate,
          end: addMinutes(dropDate, draggedItem.duration || 30),
        };
        onTaskUpdate(updatedTask);
      }
    },
    [onEventUpdate, onTaskUpdate]
  );

  const handleDragCancel = useCallback((event: DragCancelEvent) => {
    setDraggedItem(null);
    setPreviewDate(null);
  }, []);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
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
              draggedItem={draggedItem}
              previewDate={previewDate}
            />
          )}
          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              events={events}
              tasks={tasks}
              selectedCalendars={selectedCalendars}
              onEditEvent={handleEditEvent}
              onEditTask={handlePreviewTask}
              scheduleRef={scheduleRef}
              draggedItem={draggedItem}
              previewDate={previewDate}
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
        onClose={() => {
          setIsEditing(false);
          setSelectedItem(null);
        }}
        eventData={
          selectedItem && "location" in selectedItem ? selectedItem : null
        }
        onSubmit={(updatedEvent: Event) => {
          onEventUpdate(updatedEvent);
          setIsEditing(false);
        }}
      />
      <PreviewTaskDialog
        isOpen={previewing}
        onClose={() => {
          setPreviewing(false);
          setSelectedItem(null);
        }}
        onEditTask={() => {
          setPreviewing(false);
          handleEditTask(
            selectedItem && "priority" in selectedItem ? selectedItem : null
          );
        }}
        onDeleteTask={handleDeleteTask}
        taskData={
          selectedItem && "priority" in selectedItem ? selectedItem : null
        }
      />
      <EditTaskDialog
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setSelectedItem(null);
        }}
        taskData={
          selectedItem && "priority" in selectedItem ? selectedItem : null
        }
      />
    </DndContext>
  );
}
