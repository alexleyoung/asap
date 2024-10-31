import React, { useCallback } from "react";
import {
  format,
  startOfDay,
  isSameDay,
  differenceInMinutes,
  addMinutes,
} from "date-fns";
import { EventFormData, ScheduleItem } from "@/lib/types";
import TimeSlots from "./TimeSlots";
import DraggableItem from "./DraggableItem";

type DayViewProps = {
  currentDate: Date;
  scheduleItems: ScheduleItem[];
  selectedCalendars: number[];
  onEditItem: (item: EventFormData) => void;
  scheduleRef: React.RefObject<HTMLDivElement>;
};

export default function DayView({
  currentDate,
  scheduleItems,
  selectedCalendars,
  onEditItem,
  scheduleRef,
}: DayViewProps) {
  const renderItems = useCallback(
    (containerHeight: number) => {
      const dayStart = startOfDay(currentDate);
      const dayItems = scheduleItems.filter(
        (item) =>
          isSameDay(item.start, currentDate) &&
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
    [currentDate, scheduleItems, selectedCalendars, onEditItem]
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
