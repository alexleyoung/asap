import React, { useCallback, useState } from "react";
import {
  format,
  startOfDay,
  isSameDay,
  differenceInMinutes,
  addMinutes,
} from "date-fns";
import { Event, Task, Calendar } from "@/lib/types";
import TimeSlots from "./TimeSlots";
import DraggableItem from "./DraggableItem";
import GhostLine from "./GhostLine";
import { getCssColor } from "@/lib/utils";

type DayViewProps = {
  currentDate: Date;
  events: Event[];
  tasks: Task[];
  selectedCalendars: Calendar[];
  onEditEvent: (event: Event) => void;
  onEditTask: (task: Task) => void;
  scheduleRef: React.RefObject<HTMLDivElement>;
  draggedItem: Event | Task | null;
  previewDate: Date | null;
};

export default function DayView({
  currentDate,
  events,
  tasks,
  selectedCalendars,
  onEditEvent,
  onEditTask,
  scheduleRef,
  draggedItem,
  previewDate,
}: DayViewProps) {
  const [ghostLinePosition, setGhostLinePosition] = useState<{
    top: number;
    time: Date;
  } | null>(null);

  const isEvent = (item: Event | Task): item is Event =>
    "start" in item && "end" in item;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (scheduleRef.current) {
        const rect = scheduleRef.current.getBoundingClientRect();
        const scrollTop = scheduleRef.current.scrollTop;
        const y = e.clientY - rect.top + scrollTop;
        const totalMinutes = Math.floor(
          (y / scheduleRef.current.scrollHeight) * 1440
        );
        const roundedMinutes = Math.round(totalMinutes / 15) * 15;
        const ghostTime = addMinutes(startOfDay(currentDate), roundedMinutes);
        setGhostLinePosition({
          top: (roundedMinutes / 1440) * scheduleRef.current.scrollHeight,
          time: ghostTime,
        });
      }
    },
    [currentDate, scheduleRef]
  );

  const handleMouseLeave = useCallback(() => {
    setGhostLinePosition(null);
  }, []);

  const renderItems = useCallback(
    (containerHeight: number) => {
      const dayStart = startOfDay(currentDate);
      const dayEvents = events.filter((event) =>
        isSameDay(event.start, currentDate)
      );
      const dayTasks = tasks.filter((task) => {
        if (!task.start) {
          return false;
        }
        return isSameDay(task.start, currentDate);
      });

      // Render preview if we're dragging
      const previewItem =
        draggedItem && previewDate && isSameDay(currentDate, previewDate) ? (
          <div
            style={{
              position: "absolute",
              top: `${
                (differenceInMinutes(previewDate, dayStart) / 1440) * 100
              }%`,
              height: `${
                (differenceInMinutes(
                  isEvent(draggedItem)
                    ? draggedItem.end
                    : addMinutes(
                        draggedItem.start!,
                        draggedItem.duration || 30
                      ),
                  isEvent(draggedItem) ? draggedItem.start : draggedItem.start!
                ) /
                  1440) *
                100
              }%`,
              left: "0",
              right: "0",
              backgroundColor: draggedItem.color
                ? `${getCssColor(draggedItem.color)}33`
                : "rgba(var(--accent) / 0.2)",
              border: `2px dashed ${
                draggedItem.color
                  ? getCssColor(draggedItem.color)
                  : "rgb(var(--accent))"
              }`,
              borderRadius: "4px",
              pointerEvents: "none",
            }}>
            <div
              className='p-2 text-xs'
              style={{
                color: draggedItem.color
                  ? getCssColor(draggedItem.color)
                  : "rgb(var(--accent-foreground))",
              }}>
              {draggedItem.title}
              <br />
              {format(previewDate, "h:mm a")} -{" "}
              {format(
                isEvent(draggedItem)
                  ? addMinutes(
                      previewDate,
                      differenceInMinutes(draggedItem.end, draggedItem.start)
                    )
                  : addMinutes(previewDate, draggedItem.duration || 30),
                "h:mm a"
              )}
            </div>
          </div>
        ) : null;

      return (
        <>
          {dayEvents.map((event) => (
            <DraggableItem
              key={`event-${event.id}`}
              dragID={`event-${event.id}`}
              item={event}
              onItemClick={() => onEditEvent(event)}
              dayStart={dayStart}
              columnWidth={100}
              columnOffset={0}
            />
          ))}
          {dayTasks.map((task) => (
            <DraggableItem
              key={`task-${task.id}`}
              dragID={`task-${task.id}`}
              item={task}
              onItemClick={() => onEditTask(task)}
              dayStart={dayStart}
              columnWidth={100}
              columnOffset={0}
            />
          ))}
          {previewItem}
        </>
      );
    },
    [
      events,
      tasks,
      onEditEvent,
      onEditTask,
      draggedItem,
      previewDate,
      currentDate,
    ]
  );

  return (
    <div className='flex flex-1 overflow-hidden'>
      <div className='w-16 flex-shrink-0 bg-background z-10'>
        <TimeSlots showLabels={true} day={currentDate} />
      </div>
      <div
        className='flex-1 border-l border-border relative'
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}>
        <TimeSlots showLabels={false} day={currentDate} />
        {scheduleRef.current && renderItems(scheduleRef.current.scrollHeight)}
        {ghostLinePosition && (
          <GhostLine
            position={{
              top: ghostLinePosition.top,
              time: ghostLinePosition.time,
            }}
          />
        )}
      </div>
    </div>
  );
}

function CurrentTimeLine({ day }: { day: Date }) {
  const now = new Date();
  if (!isSameDay(now, day)) return null;

  return (
    <div
      id='current-time-line'
      className='absolute z-10 left-0 right-0 border-t border-red-500 pointer-events-none flex items-center'
      style={{
        top: `${((now.getHours() * 60 + now.getMinutes()) / 1440) * 100}%`,
      }}>
      <div className='size-2 z-10 rounded-full bg-red-500 -my-1 -ml-1'></div>
    </div>
  );
}
