import React, { useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { EventFormData, ScheduleItem } from "@/lib/types";

type MonthViewProps = {
  currentDate: Date;
  scheduleItems: ScheduleItem[];
  selectedCalendars: number[];
  onEditItem: (item: EventFormData) => void;
};

export default function MonthView({
  currentDate,
  scheduleItems,
  selectedCalendars,
  onEditItem,
}: MonthViewProps) {
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const renderItems = useCallback(
    (day: Date) => {
      const dayItems = scheduleItems.filter(
        (item) =>
          isSameDay(item.start, day) &&
          selectedCalendars.includes(item.calendarID)
      );

      return dayItems.map((item) => (
        <div
          key={item.siid}
          className='text-xs p-1 mb-1 rounded cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap'
          style={{ backgroundColor: item.color || "#800080" }}
          onClick={() => {
            const eventFormData: EventFormData = {
              ...item,
              type: "event",
              siid: item.siid,
              uid: item.uid,
            };
            onEditItem(eventFormData);
          }}>
          {item.title}
        </div>
      ));
    },
    [scheduleItems, selectedCalendars, onEditItem]
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
