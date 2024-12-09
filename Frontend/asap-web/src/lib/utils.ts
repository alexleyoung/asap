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

export function eventsOverlap(event1: Event, event2: Event): boolean {
  return (
    (event1.start < event2.end && event1.end > event2.start) ||
    (event2.start < event1.end && event2.end > event1.start)
  );
}

export function getOverlappingGroups(events: Event[]): Event[][] {
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  const groups: Event[][] = [];
  let currentGroup: Event[] = [];

  for (const event of sortedEvents) {
    if (currentGroup.length === 0) {
      currentGroup = [event];
      continue;
    }

    // Check if this event overlaps with any event in the current group
    const overlapsWithGroup = currentGroup.some(groupEvent => eventsOverlap(event, groupEvent));

    if (overlapsWithGroup) {
      currentGroup.push(event);
    } else {
      groups.push([...currentGroup]);
      currentGroup = [event];
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

export function getEventPosition(event: Event, group: Event[]): { width: number; left: number } {
  const sortedGroup = [...group].sort((a, b) => a.start.getTime() - b.start.getTime());
  const position = sortedGroup.findIndex(e => e.id === event.id);
  const totalOverlapping = group.length;
  
  const width = 100 / totalOverlapping;
  const left = position * width;

  return { width, left };
}
