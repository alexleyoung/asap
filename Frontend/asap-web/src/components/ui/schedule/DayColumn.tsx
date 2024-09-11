import React, { useState, useCallback, useRef } from "react";
import { isSameDay, isToday, areIntervalsOverlapping, getYear } from "date-fns";

import { EventRenderer } from "./EventRenderer";
import { TaskRenderer } from "./TaskRenderer";
import { GhostLine } from "./GhostLine";
import { isAllDayEvent } from "@/lib/utils";

type DayColumnProps = {
  day: Date;
  events: CalendarEvent[];
  tasks: Task[];
  now: Date;
  onTimeSlotClick: (day: Date, hour: number, minutes: number) => void;
  onEventClick: (event: CalendarEvent) => void;
  onTaskClick: (task: Task) => void;
  onDeleteEvent: (event: CalendarEvent) => Promise<void>;
  onDeleteTask: (task: Task) => Promise<void>;
};

type CalendarItem = CalendarEvent | Task;

type PositionedItem = {
  item: CalendarItem;
  left: number;
  width: number;
};

export function DayColumn({
  day,
  events,
  tasks,
  now,
  onTimeSlotClick,
  onEventClick,
  onTaskClick,
  onDeleteEvent,
  onDeleteTask,
}: DayColumnProps) {
  const [ghostLinePosition, setGhostLinePosition] = useState<{
    top: number;
    time: string;
  } | null>(null);
  const [isHoveringItem, setIsHoveringItem] = useState(false);
  const columnRef = useRef<HTMLDivElement>(null);

  const dayEvents = events.filter(
    (event) => !isAllDayEvent(event) && isSameDay(event.start_date, day)
  );

  const dayTasks = tasks.filter((task) => isSameDay(task.start_date, day));

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isHoveringItem) {
        setGhostLinePosition(null);
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const totalMinutes = Math.floor((y / rect.height) * 1440);
      const roundedMinutes = Math.round(totalMinutes / 15) * 15;
      const top = (roundedMinutes / 1440) * 100;
      const hours = Math.floor(roundedMinutes / 60);
      const minutes = roundedMinutes % 60;
      const time = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      setGhostLinePosition({ top, time });
    },
    [isHoveringItem]
  );

  const handleMouseLeave = useCallback(() => {
    setGhostLinePosition(null);
  }, []);

  const handleItemMouseEnter = useCallback(() => {
    setIsHoveringItem(true);
  }, []);

  const handleItemMouseLeave = useCallback(() => {
    setIsHoveringItem(false);
  }, []);

  const calculatePositions = (items: CalendarItem[]): PositionedItem[] => {
    const sortedItems = [...items].sort(
      (a, b) => a.start_date.getTime() - b.start_date.getTime()
    );

    const positionedItems: PositionedItem[] = [];

    sortedItems.forEach((item) => {
      const overlappingItems = positionedItems.filter((positionedItem) =>
        areIntervalsOverlapping(
          {
            start: positionedItem.item.start_date,
            end: positionedItem.item.end_date,
          },
          { start: item.start_date, end: item.end_date }
        )
      );

      const totalOverlappingItems = overlappingItems.length + 1;
      const width = 1 / totalOverlappingItems;

      // Find the first available position
      let left = 0;
      for (let i = 0; i < totalOverlappingItems; i++) {
        if (
          !overlappingItems.some((oi) => Math.abs(oi.left - i * width) < 0.001)
        ) {
          left = i * width;
          break;
        }
      }

      // Adjust width and position of all overlapping items
      overlappingItems.forEach((oi) => {
        oi.width = width;
        if (oi.left > left) {
          oi.left = Math.min(1 - width, oi.left);
        }
      });

      positionedItems.push({
        item,
        left,
        width,
      });
    });

    return positionedItems;
  };

  const positionedItems = calculatePositions([...dayEvents, ...dayTasks]);

  const positionedEvents = positionedItems.filter(
    (item): item is PositionedItem & { item: CalendarEvent } =>
      "location" in item.item
  );

  const positionedTasks = positionedItems.filter(
    (item): item is PositionedItem & { item: Task } => "priority" in item.item
  );

  return (
    <div
      ref={columnRef}
      className='flex-1 border-l border-border relative h-full'
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}>
      <div className='absolute inset-0'>
        <EventRenderer
          events={positionedEvents}
          onEventClick={onEventClick}
          onEventMouseEnter={handleItemMouseEnter}
          onEventMouseLeave={handleItemMouseLeave}
          onDeleteEvent={onDeleteEvent}
        />
        <TaskRenderer
          tasks={positionedTasks}
          onTaskClick={onTaskClick}
          onTaskMouseEnter={handleItemMouseEnter}
          onTaskMouseLeave={handleItemMouseLeave}
          onDeleteTask={onDeleteTask}
        />
        {Array.from({ length: 24 }).map((_, hour) => (
          <div
            key={hour}
            className='absolute left-0 right-0 h-[60px] border-t border-border cursor-pointer'
            style={{ top: `${(hour / 24) * 100}%` }}
            // onClick={() => onTimeSlotClick(day, hour, 0)}
          />
        ))}
        {isToday(day) && (
          <div
            className='absolute left-0 right-0 border-t-2 border-highlight z-20'
            style={{
              top: `${
                ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100
              }%`,
            }}>
            <div className='absolute -left-1 -top-1 w-2 h-2 bg-highlight rounded-full' />
          </div>
        )}
        {ghostLinePosition && (
          <GhostLine
            position={ghostLinePosition}
            onTimeClick={(hours, minutes) => {
              onTimeSlotClick(day, hours, minutes);
            }}
            isHoveringItem={isHoveringItem}
          />
        )}
      </div>
    </div>
  );
}
