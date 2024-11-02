import React, { useCallback, useState } from "react";
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
import GhostLine from "./GhostLine";

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

  const [ghostLinePosition, setGhostLinePosition] = useState<{
    top: number;
    time: Date;
  } | null>(null);
  const [ghostLineDay, setGhostLineDay] = useState<Date | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, day: Date) => {
      if (scheduleRef.current) {
        const rect = scheduleRef.current.getBoundingClientRect();
        const scrollTop = scheduleRef.current.scrollTop;
        const y = e.clientY - rect.top + scrollTop;
        const totalMinutes = Math.floor(
          (y / scheduleRef.current.scrollHeight) * 1440
        );
        const roundedMinutes = Math.round(totalMinutes / 15) * 15;
        const ghostTime = addMinutes(startOfDay(day), roundedMinutes);
        setGhostLinePosition({
          top: (roundedMinutes / 1440) * scheduleRef.current.scrollHeight,
          time: ghostTime,
        });
        setGhostLineDay(day);
      }
    },
    [scheduleRef]
  );

  const handleMouseLeave = useCallback(() => {
    setGhostLinePosition(null);
    setGhostLineDay(null);
  }, []);

  const renderItems = useCallback(
    (day: Date, containerHeight: number) => {
      const dayStart = startOfDay(day);
      const dayEvents = events.filter(
        (event) => isSameDay(event.start, day)
        // && selectedCalendars.some((cal) => cal.id === event.calendarID)
      );
      const dayTasks = tasks.filter((task) => {
        // only render scheduled tasks
        if (!("start" in task)) {
          return false;
        }
        isSameDay(task.dueDate, day) &&
          selectedCalendars.some((cal) => cal.id === task.calendarID);
      });

      return (
        <>
          {dayEvents.map((event) => (
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
          {dayTasks.map((task) => (
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
              className='flex-1 border-l border-border relative'
              onMouseMove={(e) => handleMouseMove(e, day)}
              onMouseLeave={handleMouseLeave}>
              <TimeSlots showLabels={false} day={day} />
              {scheduleRef.current &&
                renderItems(day, scheduleRef.current.scrollHeight)}
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
