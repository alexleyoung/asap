"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  parseISO,
  differenceInMinutes,
  startOfDay,
  addMinutes,
  setHours,
  setMinutes,
  isWithinInterval,
  isBefore,
  isAfter,
} from "date-fns";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  Modifier,
} from "@dnd-kit/core";
import { useCurrentDate, useView } from "@/contexts/ScheduleContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

type ScheduleProps = {
  items: ScheduleItem[];
  onItemUpdate: (item: ScheduleItem) => void;
  onItemCreate: (item: ScheduleItem) => void;
};

const Schedule: React.FC<ScheduleProps> = ({
  items,
  onItemUpdate,
  onItemCreate,
}) => {
  const { view, setView } = useView();
  const { currentDate, setCurrentDate } = useCurrentDate();
  const [ghostLinePosition, setGhostLinePosition] = useState<{
    top: number;
    time: Date;
  } | null>(null);
  const [ghostLineDay, setGhostLineDay] = useState<Date | null>(null);
  const [newItem, setNewItem] = useState<Partial<ScheduleItem> | null>(null);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);

  const scrollToCurrentTime = useCallback(() => {
    if (scheduleRef.current && (view === "day" || view === "week")) {
      const now = new Date();
      const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
      const scrollPosition =
        (minutesSinceMidnight / 1440) * scheduleRef.current.scrollHeight;
      scheduleRef.current.scrollTo({
        top: scrollPosition - scheduleRef.current.clientHeight / 2,
        behavior: "smooth",
      });
    }
  }, [view]);

  useEffect(() => {
    const updateCurrentTimeLine = () => {
      const now = new Date();
      if (scheduleRef.current) {
        const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
        const linePosition =
          (minutesSinceMidnight / 1440) * scheduleRef.current.scrollHeight;
        const line = document.getElementById("current-time-line");
        if (line) {
          line.style.top = `${linePosition}px`;
        }
      }
    };

    updateCurrentTimeLine();
    const interval = setInterval(updateCurrentTimeLine, 60000); // Update every minute

    scrollToCurrentTime(); // Scroll to current time when component mounts

    return () => clearInterval(interval);
  }, [scrollToCurrentTime]);

  useEffect(() => {
    scrollToCurrentTime(); // Scroll to current time when view changes
  }, [view, scrollToCurrentTime]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, day: Date) => {
    if (scheduleRef.current) {
      const rect = scheduleRef.current.getBoundingClientRect();
      const scrollTop = scheduleRef.current.scrollTop;
      const y = e.clientY - rect.top + scrollTop;
      const totalMinutes = Math.floor(
        (y / scheduleRef.current.scrollHeight) * 1440
      );
      const roundedMinutes = Math.round(totalMinutes / 15) * 15;
      const ghostTime = addMinutes(startOfDay(day), roundedMinutes);
      setGhostLinePosition({
        top: (roundedMinutes / 1440) * scheduleRef.current.scrollHeight,
        time: ghostTime,
      });
      setGhostLineDay(day);
    }
  };

  const handleMouseLeave = () => {
    setGhostLinePosition(null);
    setGhostLineDay(null);
  };

  const roundToNearestFifteenMinutes = (date: Date): Date => {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;
    return setMinutes(date, roundedMinutes);
  };

  const snapToTimeSlot: Modifier = ({
    transform,
    draggingNodeRect,
    containerNodeRect,
  }) => {
    if (!draggingNodeRect || !containerNodeRect) {
      return transform;
    }

    const minutesSinceMidnight =
      (transform.y / containerNodeRect.height) * 1440;
    const roundedMinutes = Math.round(minutesSinceMidnight / 15) * 15;
    const snappedY = (roundedMinutes / 1440) * containerNodeRect.height;

    return {
      ...transform,
      y: snappedY,
    };
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over) {
        const updatedItem = items.find((item) => item.id === active.id);
        if (updatedItem) {
          const [dropYear, dropMonth, dropDay, dropMinutes] = (
            over.id as string
          ).split("-");
          const dropDate = parseISO(`${dropYear}-${dropMonth}-${dropDay}`);
          let dropTime = addMinutes(
            startOfDay(dropDate),
            parseInt(dropMinutes)
          );

          // Snap to nearest 15-minute increment
          dropTime = roundToNearestFifteenMinutes(dropTime);

          const timeDiff = differenceInMinutes(dropTime, updatedItem.start);
          const newStart = roundToNearestFifteenMinutes(
            addMinutes(updatedItem.start, timeDiff)
          );
          const newEnd = roundToNearestFifteenMinutes(
            addMinutes(updatedItem.end, timeDiff)
          );

          onItemUpdate({
            ...updatedItem,
            start: newStart,
            end: newEnd,
          });
        }
      }
    },
    [items, onItemUpdate]
  );

  const handleScheduleClick = (day: Date, yPosition: number) => {
    if (scheduleRef.current) {
      const totalMinutes = Math.floor(
        (yPosition / scheduleRef.current.scrollHeight) * 1440
      );
      const roundedMinutes = Math.round(totalMinutes / 15) * 15;
      const clickedTime = addMinutes(startOfDay(day), roundedMinutes);
      const endTime = addMinutes(clickedTime, 60); // Default duration: 1 hour

      setNewItem({
        title: "",
        start: clickedTime,
        end: endTime,
      });
    }
  };

  const TimeSlot: React.FC<{
    day: Date;
    hour: number;
    minute: number;
    showLabel: boolean;
  }> = React.memo(({ day, hour, minute, showLabel }) => {
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
  });

  const renderTimeSlots = useCallback((showLabels: boolean, day: Date) => {
    return Array.from({ length: 24 * 4 }, (_, i) => {
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
    });
  }, []);

  const optimizeColumnDivision = (
    items: ScheduleItem[]
  ): (ScheduleItem | ScheduleItem[])[] => {
    const sortedItems = [...items].sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    );
    const result: (ScheduleItem | ScheduleItem[])[] = [];
    let currentGroup: ScheduleItem[] = [];

    const isOverlapping = (item1: ScheduleItem, item2: ScheduleItem) =>
      isBefore(item1.start, item2.end) && isAfter(item1.end, item2.start);

    for (let i = 0; i < sortedItems.length; i++) {
      if (
        currentGroup.length === 0 ||
        currentGroup.some((groupItem) =>
          isOverlapping(sortedItems[i], groupItem)
        )
      ) {
        currentGroup.push(sortedItems[i]);
      } else {
        result.push(currentGroup.length === 1 ? currentGroup[0] : currentGroup);
        currentGroup = [sortedItems[i]];
      }
    }

    if (currentGroup.length > 0) {
      result.push(currentGroup.length === 1 ? currentGroup[0] : currentGroup);
    }

    return result;
  };

  const DraggableItem = React.memo<{
    item: ScheduleItem;
    onItemClick: (item: ScheduleItem) => void;
    containerHeight: number;
    dayStart: Date;
    columnWidth: number;
    columnOffset: number;
  }>(
    ({
      item,
      onItemClick,
      containerHeight,
      dayStart,
      columnWidth,
      columnOffset,
    }) => {
      const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
          id: item.id,
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
          backgroundColor: item.color,
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
          <h1 className='font-medium truncate'>{item.title}</h1>
          <p className='text-xs'>
            {format(item.start, "h:mm a")} - {format(item.end, "h:mm a")}
          </p>
        </div>
      );
    }
  );

  const renderItems = useCallback(
    (day: Date, containerHeight: number, isMonthView: boolean = false) => {
      const dayStart = startOfDay(day);
      const dayItems = items.filter((item) => isSameDay(item.start, day));

      if (isMonthView) {
        return dayItems.map((item) => (
          <div
            key={item.id}
            className='text-xs p-1 mb-1 rounded cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap'
            style={{ backgroundColor: item.color }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(item);
            }}>
            {item.title}
          </div>
        ));
      }

      const optimizedItems = optimizeColumnDivision(dayItems);

      return optimizedItems.flatMap((item, index) => {
        if (Array.isArray(item)) {
          const columnWidth = 100 / item.length;
          return item.map((subItem, subIndex) => (
            <DraggableItem
              key={subItem.id}
              item={subItem}
              onItemClick={setSelectedItem}
              containerHeight={containerHeight}
              dayStart={dayStart}
              columnWidth={columnWidth}
              columnOffset={subIndex}
            />
          ));
        } else {
          return (
            <DraggableItem
              key={item.id}
              item={item}
              onItemClick={setSelectedItem}
              containerHeight={containerHeight}
              dayStart={dayStart}
              columnWidth={100}
              columnOffset={0}
            />
          );
        }
      });
    },
    [items]
  );

  const renderDayView = useCallback(() => {
    return (
      <div className='flex flex-col h-full'>
        <div className='flex'>
          <div className='w-16' />
          <div className='flex-1 py-2'>{format(currentDate, "EEE d")}</div>
        </div>
        <div className='flex flex-col h-full'>
          <div className='flex-1 overflow-y-auto relative' ref={scheduleRef}>
            <div className='flex h-[1440px]'>
              <div className='w-16 flex-shrink-0 bg-background z-10'>
                {renderTimeSlots(true, currentDate)}
              </div>
              <div
                className='flex-1 relative'
                onMouseMove={(e) => handleMouseMove(e, currentDate)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const yPosition = e.clientY - rect.top;
                  handleScheduleClick(currentDate, yPosition);
                }}>
                {renderTimeSlots(false, currentDate)}
                {scheduleRef.current &&
                  renderItems(currentDate, scheduleRef.current.scrollHeight)}
                {ghostLinePosition &&
                  ghostLineDay &&
                  isSameDay(ghostLineDay, currentDate) && (
                    <div
                      className='absolute left-0 right-0 border-t border-blue-300 pointer-events-none'
                      style={{ top: `${ghostLinePosition.top}px` }}>
                      <span className='absolute left-0 top-0 bg-blue-300 text-xs px-1 rounded-bl'>
                        {format(ghostLinePosition.time, "h:mm a")}
                      </span>
                    </div>
                  )}
                <div
                  id='current-time-line'
                  className='absolute z-10 left-0 right-0 border-t border-red-500 pointer-events-none flex items-center'>
                  <div className='size-2 z-10 rounded-full bg-red-500 -my-1 -ml-1'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    currentDate,
    ghostLineDay,
    ghostLinePosition,
    renderItems,
    renderTimeSlots,
  ]);

  const renderWeekView = useCallback(() => {
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const now = new Date();

    return (
      <div className='flex flex-col'>
        <div className='flex'>
          <div className='w-16' />
          {days.map((day) => (
            <div key={day.toISOString()} className='flex-1 text-center py-2'>
              {format(day, "EEE d")}
            </div>
          ))}
        </div>
        <div className='flex-1 overflow-y-auto relative' ref={scheduleRef}>
          <div className='flex h-[1440px] relative'>
            <div className='w-16 flex-shrink-0 bg-background z-10'>
              {renderTimeSlots(true, days[0])}
            </div>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className='flex-1 border-l border-border relative'
                onMouseMove={(e) => handleMouseMove(e, day)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const yPosition = e.clientY - rect.top;
                  handleScheduleClick(day, yPosition);
                }}>
                {renderTimeSlots(false, day)}
                {scheduleRef.current &&
                  renderItems(day, scheduleRef.current.scrollHeight)}
                {ghostLinePosition &&
                  ghostLineDay &&
                  isSameDay(ghostLineDay, day) && (
                    <div
                      className='absolute left-0 right-0 border-t border-blue-300 pointer-events-none'
                      style={{ top: `${ghostLinePosition.top}px` }}>
                      <span className='absolute left-0 top-0 bg-blue-300 text-xs px-1 rounded-bl'>
                        {format(ghostLinePosition.time, "h:mm a")}
                      </span>
                    </div>
                  )}
                {isSameDay(now, day) && (
                  <div
                    id='current-time-line'
                    className='absolute z-10 left-0 right-0 border-t border-red-500 pointer-events-none flex items-center'
                    style={{
                      top: `${
                        ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100
                      }%`,
                    }}>
                    <div className='size-2 z-10 rounded-full bg-red-500 -my-1 -ml-1'></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }, [
    currentDate,
    ghostLineDay,
    ghostLinePosition,
    renderItems,
    renderTimeSlots,
  ]);

  const renderMonthView = useCallback(() => {
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className='grid grid-cols-7 gap-1 h-full'>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className='text-center font-semibold py-2'>
            {day}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`border border-border p-1 ${
              isSameMonth(day, currentDate) ? "bg-background" : "bg-accent"
            }`}>
            <div className='text-right text-sm'>{format(day, "d")}</div>
            <div className='overflow-y-auto h-24'>
              {renderItems(day, 96, true)}
            </div>
          </div>
        ))}
      </div>
    );
  }, [currentDate, renderItems]);

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[snapToTimeSlot]}
      autoScroll={false}>
      <div className='flex-grow h-full flex flex-col p-4 bg-background text-foreground'>
        <ScrollArea className='h-full'>
          {view === "day" && renderDayView()}
          {view === "week" && renderWeekView()}
          {view === "month" && renderMonthView()}
        </ScrollArea>
        <Dialog open={newItem !== null} onOpenChange={() => setNewItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='title' className='text-right'>
                  Title
                </Label>
                <Input
                  id='title'
                  value={newItem?.title || ""}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='start' className='text-right'>
                  Start
                </Label>
                <Input
                  id='start'
                  type='datetime-local'
                  value={
                    newItem?.start
                      ? format(newItem.start, "yyyy-MM-dd'T'HH:mm")
                      : ""
                  }
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      start: parseISO(e.target.value),
                    }))
                  }
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='end' className='text-right'>
                  End
                </Label>
                <Input
                  id='end'
                  type='datetime-local'
                  value={
                    newItem?.end
                      ? format(newItem.end, "yyyy-MM-dd'T'HH:mm")
                      : ""
                  }
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      end: parseISO(e.target.value),
                    }))
                  }
                  className='col-span-3'
                />
              </div>
            </div>
            <Button
              onClick={() => {
                if (newItem?.title && newItem?.start && newItem?.end) {
                  onItemCreate({
                    id: Math.random().toString(36).substr(2, 9),
                    title: newItem.title,
                    start: newItem.start,
                    end: newItem.end,
                    color: "#3b82f6",
                  });
                  setNewItem(null);
                }
              }}>
              Create
            </Button>
          </DialogContent>
        </Dialog>
        <Popover
          open={selectedItem !== null}
          onOpenChange={() => setSelectedItem(null)}>
          <PopoverContent>
            {selectedItem && (
              <div>
                <h3 className='font-semibold'>{selectedItem.title}</h3>
                <p>Start: {format(selectedItem.start, "PPp")}</p>
                <p>End: {format(selectedItem.end, "PPp")}</p>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </DndContext>
  );
};

export default Schedule;