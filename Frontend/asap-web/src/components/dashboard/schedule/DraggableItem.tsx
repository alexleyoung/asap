import React, { useMemo } from "react";
import { format, differenceInMinutes } from "date-fns";
import { useDraggable } from "@dnd-kit/core";
import { Event, Task } from "@/lib/types";
import { isEvent, isTask } from "@/lib/utils";

type DraggableItemProps = {
  item: Event | Task;
  dragID: string;
  onItemClick: (item: Event | Task) => void;
  containerHeight: number;
  dayStart: Date;
  columnWidth: number;
  columnOffset: number;
};

export default function DraggableItem({
  item,
  dragID,
  onItemClick,
  containerHeight,
  dayStart,
  columnWidth,
  columnOffset,
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: dragID,
      data: item,
    });

  const style = useMemo(() => {
    const start = isEvent(item) ? item.start : item.dueDate;
    const end = isEvent(item)
      ? item.end
      : new Date(start.getTime() + item.duration * 60000);

    const topPercentage = (differenceInMinutes(start, dayStart) / 1440) * 100;
    const heightPercentage = (differenceInMinutes(end, start) / 1440) * 100;

    return {
      position: "absolute" as const,
      top: `${topPercentage}%`,
      height: `${heightPercentage}%`,
      left: `${columnOffset * columnWidth}%`,
      width: `${columnWidth}%`,
      backgroundColor: isEvent(item) ? "#80080" : "#4CAF50", // Default green color for tasks
      cursor: isDragging ? "grabbing" : "grab",
      zIndex: isDragging ? 20 : 10,
      opacity: isDragging ? 0.8 : 1,
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      transition: isDragging ? "none" : "transform 0.1s",
    };
  }, [item, dayStart, columnWidth, columnOffset, transform, isDragging]);

  const getItemDetails = () => {
    if (isEvent(item)) {
      return {
        title: item.title,
        startTime: format(item.start, "h:mm a"),
        endTime: format(item.end, "h:mm a"),
      };
    } else {
      const dueTime = format(item.dueDate, "h:mm a");
      return {
        title: item.title,
        startTime: dueTime,
        endTime: `${item.duration} min`,
      };
    }
  };

  const { title, startTime, endTime } = getItemDetails();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onItemClick(item);
      }}
      className='scale-95 rounded-sm transition-transform p-2 text-white'>
      <h3 className='font-medium truncate'>{title}</h3>
      <p className='text-xs'>
        {startTime} - {endTime}
      </p>
      {isTask(item) && (
        <p className='text-xs mt-1'>
          {item.completed ? "Completed" : "Pending"}
        </p>
      )}
    </div>
  );
}
