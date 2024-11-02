import React from "react";
import { format } from "date-fns";

type GhostLineProps = {
  position: { top: number; time: Date } | null;
};

export default function GhostLine({ position }: GhostLineProps) {
  if (!position) return null;

  return (
    <div
      className='absolute left-0 right-0 border-t border-blue-300 pointer-events-none'
      style={{ top: `${position.top}px` }}
      aria-hidden='true'>
      <span className='absolute left-0 top-0 bg-blue-300 text-xs px-1 rounded-bl text-blue-900'>
        {format(position.time, "h:mm a")}
      </span>
    </div>
  );
}
