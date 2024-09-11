"use client";

import { useState, useEffect, useRef } from "react";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  format,
  addWeeks,
  subWeeks,
  isToday,
  differenceInMinutes,
  startOfDay,
} from "date-fns";

import { ChevronLeft, ChevronRight, CirclePlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DayColumn } from "./DayColumn";
import { TimeSlots } from "./TimeSlots";
import { CreateDialog } from "./CreateDialog";
import { AllDayRow } from "./AllDayRow";

type ScheduleProps = {
  events: CalendarEvent[];
  tasks: Task[];
  onCreateItem: (item: EventFormData | TaskFormData) => Promise<void>;
  onDeleteEvent: (item: CalendarEvent) => Promise<void>;
  onDeleteTask: (item: Task) => Promise<void>;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_START_HOUR = 0;
const DAY_END_HOUR = 23;
const MINUTES_PER_DAY = 1440;
const SCROLL_OFFSET = 100;

export function Schedule({
  events,
  tasks,
  onCreateItem,
  onDeleteEvent,
  onDeleteTask,
}: ScheduleProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newItemDate, setNewItemDate] = useState<Date | null>(null);
  const [now, setNow] = useState(new Date());

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<HTMLDivElement>(null);

  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const scrollToCurrentTime = () => {
      if (scrollAreaRef.current) {
        const scrollArea = scrollAreaRef.current;
        const currentTimePosition = getCurrentTimePosition();
        const scrollPosition =
          (currentTimePosition / 100) * scrollArea.scrollHeight - SCROLL_OFFSET;
        scrollArea.scrollTop = scrollPosition;
      }
    };
    scrollToCurrentTime();
  }, [now]);

  const getCurrentTimePosition = () => {
    const minutesSinceMidnight = differenceInMinutes(now, startOfDay(now));
    return (minutesSinceMidnight / MINUTES_PER_DAY) * 100;
  };

  const handleTimeSlotClick = (
    day: Date,
    hour: number,
    minutes: number = 0
  ) => {
    const eventStart = new Date(day);
    eventStart.setHours(hour, minutes);
    setNewItemDate(eventStart);
    setIsCreateModalOpen(true);
  };

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleCreateItem = (newItem: EventFormData | TaskFormData) => {
    onCreateItem(newItem);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const renderDayHeaders = () => {
    return WEEKDAYS.map((day, index) => {
      const currentDay = addDays(startDate, index);
      const isCurrentDay = isToday(currentDay);
      return (
        <div
          key={day}
          className={`flex-1 text-center border-l first:border-l-0 py-2 ${
            isCurrentDay ? "bg-highlight/20" : ""
          }`}>
          <div className='text-md font-semibold'>
            {format(currentDay, "EEE d")}
          </div>
        </div>
      );
    });
  };

  return (
    <div className='bg-background text-foreground flex flex-col h-full'>
      <div className='absolute z-50 -top-1 min-w-fit gap-8 flex justify-between items-center p-4'>
        <div className='flex gap-4 items-center'>
          <Button variant='outline' size='icon' onClick={handlePreviousWeek}>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button variant='outline' size='icon' onClick={handleNextWeek}>
            <ChevronRight className='h-4 w-4' />
          </Button>
          <h2 className='text-2xl font-medium'>
            {currentDate.toLocaleDateString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>
        <Button
          variant='secondary'
          onClick={() => setIsCreateModalOpen(true)}
          className='flex gap-2 items-center'>
          <CirclePlus /> Create
        </Button>
      </div>
      <div className='flex py-2 border-b bg-background sticky top-0 z-20'>
        <div className='w-16 flex-shrink-0' />
        {renderDayHeaders()}
      </div>
      <AllDayRow
        events={events}
        start_date={startDate}
        onEventClick={handleEventClick}
        onDeleteEvent={onDeleteEvent}
      />
      <ScrollArea className='flex-grow'>
        <div ref={scrollAreaRef} className='flex relative h-[1440px]'>
          <div className='w-16 border-r flex-shrink-0'>
            <TimeSlots
              startHour={DAY_START_HOUR}
              endHour={DAY_END_HOUR}
              onTimeClick={handleTimeSlotClick}
            />
          </div>
          <div className='flex-1 flex relative'>
            {Array.from({ length: 7 }).map((_, i) => (
              <DayColumn
                key={i}
                day={addDays(startDate, i)}
                events={events}
                tasks={tasks}
                now={now}
                onTimeSlotClick={handleTimeSlotClick}
                onEventClick={handleEventClick}
                onTaskClick={handleTaskClick}
                onDeleteEvent={onDeleteEvent}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      <CreateDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateItem={handleCreateItem}
        initialDate={newItemDate}
      />
    </div>
  );
}
