import React, { useMemo } from "react";
import { format, differenceInMinutes } from "date-fns";
import { useDraggable } from "@dnd-kit/core";
import { Event, Task } from "@/lib/types";
import { getColor, isEvent, isTask } from "@/lib/utils";

type DraggableItemProps = {
  item: Event | Task;
  dragID: string;
  onItemClick: (item: Event | Task) => void;
  columnWidth: number;
  dayStart: Date;

  columnOffset: number;
};

export default function DraggableItem({
  item,
  dragID,
  onItemClick,
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
    const start = item.start;
    const end = item.end;

    const topPercentage = (differenceInMinutes(start!, dayStart) / 1440) * 100;
    const heightPercentage = (differenceInMinutes(end!, start!) / 1440) * 100;

    return {
      position: "absolute" as const,
      top: `${topPercentage}%`,
      height: `${heightPercentage}%`,
      left: `${columnOffset * columnWidth}%`,
      width: `${columnWidth}%`,
      cursor: isDragging ? "grabbing" : "grab",
      zIndex: isDragging ? 99999999 : 1,
      opacity: isDragging ? 0 : 1,
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      transition: isDragging ? "none" : "transform 0.1s",
    };
  }, [item, dayStart, columnWidth, columnOffset, transform, isDragging]);

  const getItemDetails = () => {
    return {
      title: item.title,
      startTime: format(item.start!, "h:mm a"),
      endTime: format(item.end!, "h:mm a"),
    };
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
      className={`scale-95 rounded-sm transition-transform p-2 overflow-hidden text-white bg-${getColor(
        item.color || ""
      )}`}>
      <h3 className='font-medium truncate'>{title}</h3>
      <p className='text-xs'>
        {startTime} - {endTime}
      </p>
      {isTask(item) && (
        <></>
        // <p className='text-xs mt-1'>
        //   {item.completed ? "Completed" : "Pending"}
        // </p>
      )}
    </div>
  );
}
