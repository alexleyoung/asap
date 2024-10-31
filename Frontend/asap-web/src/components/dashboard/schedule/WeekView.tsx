import React, { useCallback } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  startOfDay,
} from "date-fns";
import { EventFormData, ScheduleItem } from "@/lib/types";
import TimeSlots from "./TimeSlots";
import DraggableItem from "./DraggableItem";
import CurrentTimeLine from "./CurrentTimeLine";

type WeekViewProps = {
  currentDate: Date;
  scheduleItems: ScheduleItem[];
  selectedCalendars: number[];
  onEditItem: (item: EventFormData) => void;
  scheduleRef: React.RefObject<HTMLDivElement>;
};

export default function WeekView({
  currentDate,
  scheduleItems,
  selectedCalendars,
  onEditItem,
  scheduleRef,
}: WeekViewProps) {
  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const renderItems = useCallback(
    (day: Date, containerHeight: number) => {
      const dayStart = startOfDay(day);
      const dayItems = scheduleItems.filter(
        (item) =>
          isSameDay(item.start, day) &&
          selectedCalendars.includes(item.calendarID)
      );

      return dayItems.map((item) => (
        <DraggableItem
          key={item.siid}
          item={item}
          onItemClick={() => {
            const eventFormData: EventFormData = {
              ...item,
              type: "event",
              siid: item.siid,
              uid: item.uid,
            };
            onEditItem(eventFormData);
          }}
          containerHeight={containerHeight}
          dayStart={dayStart}
          columnWidth={100}
          columnOffset={0}
        />
      ));
    },
    [scheduleItems, selectedCalendars, onEditItem]
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
