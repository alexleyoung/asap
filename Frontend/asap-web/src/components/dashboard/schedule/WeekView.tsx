import React, { useCallback } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  startOfDay,
  addMinutes,
} from "date-fns";
import { Event, Task, Calendar } from "@/lib/types";
import TimeSlots from "./TimeSlots";
import DraggableItem from "./DraggableItem";
import CurrentTimeLine from "./CurrentTimeLine";

type WeekViewProps = {
  currentDate: Date;
  events: Event[];
  tasks: Task[];
  selectedCalendars: Calendar[];
  onEditEvent: (event: Event) => void;
  onEditTask: (task: Task) => void;
  scheduleRef: React.RefObject<HTMLDivElement>;
};

export default function WeekView({
  currentDate,
  events,
  tasks,
  selectedCalendars,
  onEditEvent,
  onEditTask,
  scheduleRef,
}: WeekViewProps) {
  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const renderItems = useCallback(
    (day: Date, containerHeight: number) => {
      const dayStart = startOfDay(day);
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
            <DraggableItem
              key={`event-${event.id}`}
              item={{
                ...event,
                siid: event.id.toString(),
                uid: event.userID.toString(),
                type: "event",
              }}
              onItemClick={() => onEditEvent(event)}
              containerHeight={containerHeight}
              dayStart={dayStart}
              columnWidth={100}
              columnOffset={0}
            />
          ))}
          {dayTasks.map((task) => (
            <DraggableItem
              key={`task-${task.id}`}
              item={{
                ...task,
                siid: task.id.toString(),
                uid: task.userID.toString(),
                type: "task",
                start: task.dueDate,
                end: addMinutes(task.dueDate, task.duration),
              }}
              onItemClick={() => onEditTask(task)}
              containerHeight={containerHeight}
              dayStart={dayStart}
              columnWidth={100}
              columnOffset={0}
            />
          ))}
        </>
      );
    },
    [events, tasks, selectedCalendars, onEditEvent, onEditTask]
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
              {scheduleRef.current &&
                renderItems(day, scheduleRef.current.scrollHeight)}
              <CurrentTimeLine day={day} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
