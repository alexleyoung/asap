import React from "react";
import { isSameDay } from "date-fns";

type CurrentTimeLineProps = {
  day: Date;
};

export default function CurrentTimeLine({ day }: CurrentTimeLineProps) {
  const now = new Date();
  if (!isSameDay(now, day)) return null;

  return (
    <div
      className='absolute z-10 left-0 right-0 border-t border-red-500 pointer-events-none flex items-center'
      style={{
        top: `${((now.getHours() * 60 + now.getMinutes()) / 1440) * 100}%`,
      }}
      aria-hidden='true'>
      <div className='size-2 rounded-full bg-red-500 -my-1 -ml-1'></div>
    </div>
  );
}
