import React, { useCallback } from "react";
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

type DayViewProps = {
  currentDate: Date;
  events: Event[];
  tasks: Task[];
  selectedCalendars: Calendar[];
  onEditEvent: (event: Event) => void;
  onEditTask: (task: Task) => void;
  scheduleRef: React.RefObject<HTMLDivElement>;
};

export default function DayView({
  currentDate,
  events,
  tasks,
  selectedCalendars,
  onEditEvent,
  onEditTask,
  scheduleRef,
}: DayViewProps) {
  const renderItems = useCallback(
    (containerHeight: number) => {
      const dayStart = startOfDay(currentDate);
      const dayEvents = events.filter(
        (event) =>
          isSameDay(event.start, currentDate) &&
          selectedCalendars.some((cal) => cal.id === event.calendarID)
      );
      const dayTasks = tasks.filter(
        (task) =>
          isSameDay(task.dueDate, currentDate) &&
          selectedCalendars.some((cal) => cal.id === task.calendarID)
      );

      return (
        <>
          {dayEvents.map((event, i) => (
            <DraggableItem
              key={event.id}
              dragID={i}
              item={event}
              onItemClick={() => onEditEvent(event)}
              containerHeight={containerHeight}
              dayStart={dayStart}
              columnWidth={100}
              columnOffset={0}
            />
          ))}
          {dayTasks.map((task, i) => (
            <DraggableItem
              key={task.id}
              dragID={i + dayEvents.length}
              item={task}
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
    [currentDate, events, tasks, selectedCalendars, onEditEvent, onEditTask]
  );

  return (
    <div className='flex flex-col h-full'>
      <div className='flex'>
        <div className='w-16' />
        <div className='flex-1 py-2'>{format(currentDate, "EEE d")}</div>
      </div>
      <div className='flex flex-col h-full'>
        <div className='flex-1 overflow-y-auto relative' ref={scheduleRef}>
          <div className='flex h-[1440px]'>
            <div className='w-16 flex-shrink-0 bg-background z-10'>
              <TimeSlots showLabels={true} day={currentDate} />
            </div>
            <div className='flex-1 relative'>
              <TimeSlots showLabels={false} day={currentDate} />
              {scheduleRef.current &&
                renderItems(scheduleRef.current.scrollHeight)}
              <CurrentTimeLine day={currentDate} />
            </div>
          </div>
        </div>
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
