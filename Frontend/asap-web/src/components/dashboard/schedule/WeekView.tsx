/* eslint-disable react/display-name */
import React, { useCallback, useState } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  startOfDay,
  addMinutes,
  differenceInMinutes,
} from "date-fns";
import { Event, Task, Calendar } from "@/lib/types";
import TimeSlots from "./TimeSlots";
import DraggableItem from "./DraggableItem";
import CurrentTimeLine from "./CurrentTimeLine";
import GhostLine from "./GhostLine";
import { useCalendars } from "@/contexts/CalendarsContext";
import { getCssColor } from "@/lib/utils";

type WeekViewProps = {
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

export default function WeekView({
  currentDate,
  events,
  tasks,
  selectedCalendars,
  onEditEvent,
  onEditTask,
  scheduleRef,
  draggedItem,
  previewDate,
}: WeekViewProps) {
  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const [ghostLinePosition, setGhostLinePosition] = useState<{
    top: number;
    time: Date;
  } | null>(null);
  const [ghostLineDay, setGhostLineDay] = useState<Date | null>(null);

  const isEvent = (item: Event | Task): item is Event =>
    "start" in item && "end" in item;

  const renderItems = useCallback(
    (day: Date) => {
      const dayStart = startOfDay(day);
      const dayEvents = events.filter(
        (event) =>
          isSameDay(event.start, day) &&
          selectedCalendars.some((cal) => cal.id === event.calendarID)
      );
      const dayTasks = tasks.filter((task) => {
        if (task.start) {
          return (
            isSameDay(task.start, day) &&
            selectedCalendars.some((cal) => cal.id === task.calendarID)
          );
        }
        return false;
      });

      // Render preview if we're dragging
      const previewItem =
        draggedItem && previewDate && isSameDay(day, previewDate) ? (
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
      selectedCalendars,
      onEditEvent,
      onEditTask,
      draggedItem,
      previewDate,
    ]
  );

  return (
    <div className='flex flex-col'>
      <div className='flex'>
        <div className='w-16' />
        {days.map((day) => (
          <div key={day.toISOString()} className='flex-1 text-center py-2'>
            {format(day, "EEE d")}
          </div>
        ))}
      </div>
      <div className='flex-1 overflow-y-auto relative' ref={scheduleRef}>
        <div className='flex h-[1440px] relative'>
          <div className='w-16 flex-shrink-0 bg-background z-10'>
            <TimeSlots showLabels={true} day={days[0]} />
          </div>
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className='flex-1 border-l border-border relative'>
              <TimeSlots showLabels={false} day={day} />
              {scheduleRef.current && renderItems(day)}
              <CurrentTimeLine day={day} />
              {ghostLineDay && isSameDay(ghostLineDay, day) && (
                <GhostLine position={ghostLinePosition} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
