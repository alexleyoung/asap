import React from "react";
import { formatHour } from "@/lib/utils";

type GhostLineProps = {
  position: { top: number; time: string };
  onTimeClick: (hours: number, minutes: number) => void;
  isHoveringItem: boolean;
};

export const GhostLine: React.FC<GhostLineProps> = ({
  position,
  onTimeClick,
  isHoveringItem,
}) => {
  if (isHoveringItem) return null;

  const [hours, minutes] = position.time.split(":").map(Number);
  const formattedTime = formatHour(hours, minutes);

  return (
    <div
      className='absolute left-0 right-0 border-t pointer-events-none'
      style={{ top: `${position.top}%` }}>
      <div
        className='relative px-2 text-end -top-2 text-xs py-2 pointer-events-auto cursor-pointer'
        onClick={(e) => {
          e.stopPropagation();
          onTimeClick(hours, minutes);
        }}>
        {formattedTime}
      </div>
    </div>
  );
};
