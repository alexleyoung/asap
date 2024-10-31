import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Modifier } from "@dnd-kit/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const snapToTimeSlot: Modifier = ({
  transform,
  draggingNodeRect,
  containerNodeRect,
}) => {
  if (!draggingNodeRect || !containerNodeRect) {
    return transform;
  }

  const minutesSinceMidnight = (transform.y / containerNodeRect.height) * 1440;
  const roundedMinutes = Math.round(minutesSinceMidnight / 15) * 15;
  const snappedY = (roundedMinutes / 1440) * containerNodeRect.height;

  return {
    ...transform,
    y: snappedY,
  };
};
