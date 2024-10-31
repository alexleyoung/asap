import React, { useMemo } from "react";
import { format, differenceInMinutes } from "date-fns";
import { useDraggable } from "@dnd-kit/core";
import { ScheduleItem } from "@/lib/types";

type DraggableItemProps = {
  item: ScheduleItem;
  onItemClick: (item: ScheduleItem) => void;
  containerHeight: number;
  dayStart: Date;
  columnWidth: number;
  columnOffset: number;
};

export default function DraggableItem({
  item,
  onItemClick,
  containerHeight,
  dayStart,
  columnWidth,
  columnOffset,
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.siid,
      data: item,
    });

  const style = useMemo(() => {
    const topPercentage =
      (differenceInMinutes(item.start, dayStart) / 1440) * 100;
    const heightPercentage =
      (differenceInMinutes(item.end, item.start) / 1440) * 100;

    return {
      position: "absolute" as const,
      top: `${topPercentage}%`,
      height: `${heightPercentage}%`,
      left: `${columnOffset * columnWidth}%`,
      width: `${columnWidth}%`,
      backgroundColor: item.color || "#800080",
      cursor: isDragging ? "grabbing" : "grab",
      zIndex: isDragging ? 20 : 10,
      opacity: isDragging ? 0.8 : 1,
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      transition: isDragging ? "none" : "transform 0.1s",
    };
  }, [
    item,
    dayStart,
    containerHeight,
    columnWidth,
    columnOffset,
    transform,
    isDragging,
  ]);

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
      <h3 className='font-medium truncate'>{item.title}</h3>
      <p className='text-xs'>
        {format(item.start, "h:mm a")} - {format(item.end, "h:mm a")}
      </p>
    </div>
  );
}
