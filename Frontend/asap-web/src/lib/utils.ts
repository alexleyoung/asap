import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Modifier } from "@dnd-kit/core";
import { Event, Task } from "@/lib/types";

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

export const isEvent = (item: Event | Task): item is Event => {
  return !("duration" in item);
};

export const isTask = (item: Event | Task): item is Task => {
  return "duration" in item;
};

export function getColor(color: string) {
  switch (color) {
    case "red":
      return "red-500";
    case "yellow":
      return "yellow-500";
    case "green":
      return "green-500";
    case "blue":
      return "blue-500";
    case "purple":
      return "purple-500";
    case "orange":
      return "orange-500";
    case "lime":
      return "lime-500";
    case "pink":
      return "pink-500";
    case "indigo":
      return "indigo-500";
    case "cyan":
      return "cyan-500";
    default:
      return "blue-500";
  }
}

export function getCssColor(color: string) {
  switch (color.toLowerCase()) {
    case "red":
      return "#ef4444"; // red-500
    case "yellow":
      return "#eab308"; // yellow-500
    case "green":
      return "#22c55e"; // green-500
    case "blue":
      return "#3b82f6"; // blue-500
    case "purple":
      return "#a855f7"; // purple-500
    case "orange":
      return "#f97316"; // orange-500
    case "lime":
      return "#84cc16"; // lime-500
    case "pink":
      return "#ec4899"; // pink-500
    case "indigo":
      return "#6366f1"; // indigo-500
    case "cyan":
      return "#06b6d4"; // cyan-500
    default:
      return "#3b82f6"; // blue-500
  }
}
