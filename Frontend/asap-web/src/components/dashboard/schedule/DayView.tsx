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
  const [ghostLinePosition, setGhostLinePosition] = useState<{
    top: number;
    time: Date;
  } | null>(null);

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
              key={`event-${event.id}`}
              dragID={`event-${event.id}`}
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
              key={`task-${task.id}`}
              dragID={`task-${task.id}`}
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
        <div
          className='flex-1 overflow-y-auto relative'
          ref={scheduleRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}>
          <div className='flex h-[1440px]'>
            <div className='w-16 flex-shrink-0 bg-background z-10'>
              <TimeSlots showLabels={true} day={currentDate} />
            </div>
            <div className='flex-1 relative'>
              <TimeSlots showLabels={false} day={currentDate} />
              {scheduleRef.current &&
                renderItems(scheduleRef.current.scrollHeight)}
              <CurrentTimeLine day={currentDate} />
              <GhostLine position={ghostLinePosition} />
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
