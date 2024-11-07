import React from "react";
import { format, setHours, setMinutes } from "date-fns";
import { useDroppable } from "@dnd-kit/core";

type TimeSlotsProps = {
  showLabels: boolean;
  day: Date;
};

export default function TimeSlots({ showLabels, day }: TimeSlotsProps) {
  return (
    <>
      {Array.from({ length: 24 * 4 }, (_, i) => {
        const hour = Math.floor(i / 4);
        const minute = (i % 4) * 15;
        return (
          <TimeSlot
            key={i}
            day={day}
            hour={hour}
            minute={minute}
            showLabel={hour === 0 ? false : showLabels}
          />
        );
      })}
    </>
  );
}

type TimeSlotProps = {
  day: Date;
  hour: number;
  minute: number;
  showLabel: boolean;
};

function TimeSlot({ day, hour, minute, showLabel }: TimeSlotProps) {
  const { setNodeRef } = useDroppable({
    id: `${format(day, "yyyy-MM-dd")}-${hour * 60 + minute}`,
  });

  const isHourMark = minute === 0;

  return (
    <div
      ref={setNodeRef}
      className={`h-[15px] ${
        isHourMark ? "border-t border-border" : ""
      } relative`}>
      {showLabel && isHourMark && (
        <span className='absolute bg-background -top-2 left-0 text-xs text-accent-foreground'>
          {format(setHours(setMinutes(day, minute), hour), "h a")}
        </span>
      )}
    </div>
  );
}
