import React, { useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { Event, Task, Calendar } from "@/lib/types";

type MonthViewProps = {
  currentDate: Date;
  events: Event[];
  tasks: Task[];
  selectedCalendars: Calendar[];
  onEditEvent: (event: Event) => void;
  onEditTask: (task: Task) => void;
};

export default function MonthView({
  currentDate,
  events,
  tasks,
  selectedCalendars,
  onEditEvent,
  onEditTask,
}: MonthViewProps) {
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const renderItems = useCallback(
    (day: Date) => {
      const dayEvents = events.filter(
        (event) =>
          isSameDay(event.start, day) &&
          selectedCalendars.some((cal) => cal.id === event.calendarID)
      );

      const dayTasks = tasks.filter(
        (task) =>
          isSameDay(task.dueDate, day) &&
          selectedCalendars.some((cal) => cal.id === task.calendarID)
      );

      return (
        <>
          {dayEvents.map((event) => (
            <div
              key={`event-${event.id}`}
              className='text-xs p-1 mb-1 rounded cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap'
              style={{ backgroundColor: "#800080" }}
              onClick={() => onEditEvent(event)}>
              {event.title}
            </div>
          ))}
          {dayTasks.map((task) => (
            <div
              key={`task-${task.id}`}
              className='text-xs p-1 mb-1 rounded cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap'
              style={{ backgroundColor: "#4CAF50" }}
              onClick={() => onEditTask(task)}>
              {task.title}
            </div>
          ))}
        </>
      );
    },
    [events, tasks, selectedCalendars, onEditEvent, onEditTask]
  );

  return (
    <div className='grid grid-cols-7 gap-1 h-full'>
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className='text-center font-semibold py-2'>
          {day}
        </div>
      ))}
      {days.map((day) => (
        <div
          key={day.toISOString()}
          className={`border border-border p-1 ${
            isSameMonth(day, currentDate) ? "bg-background" : "bg-accent"
          }`}>
          <div className='text-right text-sm'>{format(day, "d")}</div>
          <div className='overflow-y-auto h-24'>{renderItems(day)}</div>
        </div>
      ))}
    </div>
  );
}
