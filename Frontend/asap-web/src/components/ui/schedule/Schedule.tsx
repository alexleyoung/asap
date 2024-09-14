"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  parseISO,
  differenceInMinutes,
  startOfDay,
  addMinutes,
} from "date-fns";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ScheduleProps = {
  items: ScheduleItem[];
  onItemUpdate: (item: ScheduleItem) => void;
  onItemCreate: (item: ScheduleItem) => void;
};

type ViewType = "day" | "week" | "month";

const Schedule: React.FC<ScheduleProps> = ({
  items,
  onItemUpdate,
  onItemCreate,
}) => {
  const [view, setView] = useState<ViewType>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [ghostLinePosition, setGhostLinePosition] = useState<{
    top: number;
    time: Date;
  } | null>(null);
  const [ghostLineDay, setGhostLineDay] = useState<Date | null>(null);
  const [newItem, setNewItem] = useState<Partial<ScheduleItem> | null>(null);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);

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

    return () => clearInterval(interval);
  }, [view]); // Add view as a dependency to re-run effect when view changes

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, day: Date) => {
    if (scheduleRef.current) {
      const rect = scheduleRef.current.getBoundingClientRect();
      const scrollTop = scheduleRef.current.scrollTop;
      const y = e.clientY - rect.top + scrollTop;
      const totalMinutes = Math.floor(
        (y / scheduleRef.current.scrollHeight) * 1440
      );
      const roundedMinutes = Math.round(totalMinutes / 5) * 5;
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const updatedItem = items.find((item) => item.id === active.id);
      if (updatedItem) {
        const dropTime = new Date(over.id as string);
        const duration =
          updatedItem.end.getTime() - updatedItem.start.getTime();
        updatedItem.start = dropTime;
        updatedItem.end = new Date(dropTime.getTime() + duration);
        onItemUpdate(updatedItem);
      }
    }
  };

  const renderTimeSlots = (showLabels: boolean = true) => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push(
        <div
          key={i}
          className='h-[60px] border-t border-gray-200 text-xs text-gray-500 relative'>
          {showLabels && (
            <span className='absolute -top-2 left-0'>{`${i
              .toString()
              .padStart(2, "0")}:00`}</span>
          )}
        </div>
      );
    }
    return slots;
  };

  const renderItems = (
    day: Date,
    containerHeight: number,
    isMonthView: boolean = false
  ) => {
    const dayStart = startOfDay(day);
    const dayItems = items.filter((item) => isSameDay(item.start, day));

    if (isMonthView) {
      return dayItems.map((item, index) => (
        <div
          key={item.id}
          className='text-xs p-1 mb-1 rounded cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap'
          style={{ backgroundColor: item.color }}
          onClick={() => setSelectedItem(item)}>
          {item.title}
        </div>
      ));
    }

    return dayItems.map((item) => (
      <DraggableItem
        key={item.id}
        item={item}
        onItemClick={setSelectedItem}
        containerHeight={containerHeight}
        dayStart={dayStart}
      />
    ));
  };

  const renderDayView = () => {
    return (
      <div className='flex flex-col h-full'>
        <div className='text-center font-semibold py-2'>
          {format(currentDate, "MMMM d, yyyy")}
        </div>
        <div
          className='flex-1 overflow-y-auto relative'
          ref={scheduleRef}
          onMouseMove={(e) => handleMouseMove(e, currentDate)}
          onMouseLeave={handleMouseLeave}>
          <div className='h-[1440px]'>
            {" "}
            {/* Set a fixed height for 24 hours */}
            {renderTimeSlots()}
            {scheduleRef.current &&
              renderItems(currentDate, scheduleRef.current.scrollHeight)}
            {ghostLinePosition &&
              ghostLineDay &&
              isSameDay(ghostLineDay, currentDate) && (
                <div
                  className='absolute left-0 right-0 border-t border-blue-300 pointer-events-none'
                  style={{ top: `${ghostLinePosition.top}px` }}>
                  <span className='absolute right-0 top-0 bg-blue-300 text-xs px-1 rounded-bl'>
                    {format(ghostLinePosition.time, "HH:mm")}
                  </span>
                </div>
              )}
            <div
              id='current-time-line'
              className='absolute left-0 right-0 border-t border-red-500 pointer-events-none'
            />
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const now = new Date();

    return (
      <div className='flex flex-col h-full'>
        <div className='flex'>
          <div className='w-16' /> {/* Empty space for time labels */}
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className='flex-1 text-center font-semibold py-2'>
              {format(day, "EEE d")}
            </div>
          ))}
        </div>
        <div className='flex-1 overflow-y-auto relative' ref={scheduleRef}>
          <div className='flex h-[1440px] relative'>
            {" "}
            {/* Set a fixed height for 24 hours */}
            <div className='w-16 flex-shrink-0'>{renderTimeSlots()}</div>
            {days.map((day, index) => (
              <div
                key={day.toISOString()}
                className='flex-1 border-l border-gray-200 relative'
                onMouseMove={(e) => handleMouseMove(e, day)}
                onMouseLeave={handleMouseLeave}>
                {renderTimeSlots(false)}
                {scheduleRef.current &&
                  renderItems(day, scheduleRef.current.scrollHeight)}
                {ghostLinePosition &&
                  ghostLineDay &&
                  isSameDay(ghostLineDay, day) && (
                    <div
                      className='absolute left-0 right-0 border-t border-blue-300 pointer-events-none'
                      style={{ top: `${ghostLinePosition.top}px` }}>
                      <span className='absolute right-0 top-0 bg-blue-300 text-xs px-1 rounded-bl'>
                        {format(ghostLinePosition.time, "HH:mm")}
                      </span>
                    </div>
                  )}
                {isSameDay(now, day) && (
                  <div
                    id='current-time-line'
                    className='absolute left-0 right-0 border-t border-red-500 pointer-events-none'
                    style={{
                      top: `${
                        ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100
                      }%`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
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
            className={`border border-gray-200 p-1 ${
              isSameMonth(day, currentDate) ? "bg-white" : "bg-gray-100"
            }`}>
            <div className='text-right text-sm'>{format(day, "d")}</div>
            <div className='overflow-y-auto h-24'>
              {renderItems(day, 96, true)} {/* 96px height, isMonthView=true */}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
  };

  const handleDateChange = (direction: "prev" | "next") => {
    if (view === "day") {
      setCurrentDate((prevDate) =>
        addDays(prevDate, direction === "prev" ? -1 : 1)
      );
    } else if (view === "week") {
      setCurrentDate((prevDate) =>
        addDays(prevDate, direction === "prev" ? -7 : 7)
      );
    } else {
      setCurrentDate((prevDate) =>
        addMonths(prevDate, direction === "prev" ? -1 : 1)
      );
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className='h-screen flex flex-col p-4 bg-background text-foreground'>
        <div className='flex justify-between items-center mb-4'>
          <div>
            <Button onClick={() => handleDateChange("prev")}>Previous</Button>
            <Button onClick={() => handleDateChange("next")} className='ml-2'>
              Next
            </Button>
          </div>
          <div>
            <Button
              onClick={() => handleViewChange("day")}
              variant={view === "day" ? "default" : "outline"}>
              Day
            </Button>
            <Button
              onClick={() => handleViewChange("week")}
              variant={view === "week" ? "default" : "outline"}
              className='ml-2'>
              Week
            </Button>
            <Button
              onClick={() => handleViewChange("month")}
              variant={view === "month" ? "default" : "outline"}
              className='ml-2'>
              Month
            </Button>
          </div>
        </div>
        <div className='flex-1 overflow-hidden'>
          {view === "day" && renderDayView()}
          {view === "week" && renderWeekView()}
          {view === "month" && renderMonthView()}
        </div>
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

const DraggableItem: React.FC<{
  item: ScheduleItem;
  onItemClick: (item: ScheduleItem) => void;
  containerHeight: number;
  dayStart: Date;
}> = ({ item, onItemClick, containerHeight, dayStart }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const topPosition =
    (differenceInMinutes(item.start, dayStart) / 1440) * containerHeight;
  const height =
    (differenceInMinutes(item.end, item.start) / 1440) * containerHeight;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        ...style,
        position: "absolute",
        top: `${topPosition}px`,
        height: `${height}px`,
        left: "0",
        right: "0",
        backgroundColor: item.color,
        padding: "2px",
        borderRadius: "4px",
        cursor: "move",
        zIndex: 10,
      }}
      onClick={() => onItemClick(item)}>
      {item.title}
    </div>
  );
};

export default Schedule;
