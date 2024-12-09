import React from "react";
import { format, setHours, setMinutes } from "date-fns";
import DroppableTimeSlot from "./DroppableTimeSlot";

type TimeSlotsProps = {
  showLabels: boolean;
  day: Date;
};

export default function TimeSlots({ showLabels, day }: TimeSlotsProps) {
  return (
    <div className='grid grid-rows-[repeat(96,1fr)] h-full'>
      {Array.from({ length: 24 * 4 }, (_, i) => {
        const hour = Math.floor(i / 4);
        const minute = (i % 4) * 15;
        const isHourSlot = minute === 0;
        return (
          <TimeSlot
            key={i}
            day={day}
            hour={hour}
            minute={minute}
            showLabel={showLabels && isHourSlot}
            isHourSlot={isHourSlot}
          />
        );
      })}
    </div>
  );
}

type TimeSlotProps = {
  day: Date;
  hour: number;
  minute: number;
  showLabel: boolean;
  isHourSlot: boolean;
};

function TimeSlot({ day, hour, minute, showLabel, isHourSlot }: TimeSlotProps) {
  const slotDate = setHours(setMinutes(day, minute), hour);

  return (
    <DroppableTimeSlot
      date={slotDate}
      className={`min-h-[15px] ${
        isHourSlot ? "border-t border-border" : ""
      } relative`}>
      {showLabel && hour !== 0 && (
        <span className='absolute -top-2 text-xs text-muted-foreground bg-background whitespace-nowrap'>
          {format(slotDate, "h:mm a").toLowerCase()}
        </span>
      )}
    </DroppableTimeSlot>
  );
}
