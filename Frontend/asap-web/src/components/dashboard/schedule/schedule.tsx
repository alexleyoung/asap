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
  set,
} from "date-fns";

import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  Modifier,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { useCurrentDate, useView } from "@/contexts/ScheduleContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateItemTabs from "../forms/CreateItemTabs";
import { DialogDescription } from "@radix-ui/react-dialog";
import { EventFormData } from "@/lib/types";
import EventCard from "./EventCard";
import { Edit } from "lucide-react";
import EditEventForm from "../forms/EditEventForm";

export type ScheduleProps = {
  items: ScheduleItem[];
  onItemUpdate: (item: ScheduleItem) => void;
  selectedCalenders: number[];
};

export const Schedule: React.FC<ScheduleProps> = ({
  items,
  onItemUpdate,
  selectedCalenders,
}) => {
  const { view } = useView();
  const { currentDate } = useCurrentDate();
  const [ghostLinePosition, setGhostLinePosition] = useState<{
    top: number;
    time: Date;
  } | null>(null);
  const [ghostLineDay, setGhostLineDay] = useState<Date | null>(null);
  const [newItem, setNewItem] = useState<Partial<ScheduleItem> | null>(null);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const [edittingItem, setEdittingItem] = useState<EventFormData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(items);

  useEffect(() => {
    setScheduleItems(items);
  }, [items]);

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
        const updatedItem = items.find((item) => item.siid === active.id);
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

  const handleItemCreate = (newItem: ScheduleItem) => {
    console.log("Creating new item:", newItem);
    setScheduleItems((prevItems) => [...prevItems, newItem]);
  };

  const handleEditItem = (item: EventFormData) => {
    console.log("Editing item:", item);
    // Open dialog with item data

    setEdittingItem({
      title: item.title,
      start: item.start,
      end: item.end,
      description: item.description,
      category: item.category,
      frequency: item.frequency,
      uid: item.uid,
      calendarID: item.calendarID,
      location: item.location,
      siid: item.siid,
      type: "event",
    });
    console.log("Editing event: ", edittingItem);

    // if (item.type === "task") {
    //   setEdittingItem({
    //     title: item.title,
    //     start: item.start,
    //     end: item.end,
    //     description: item.description,
    //     category: item.category,
    //     frequency: item.frequency,
    //     due: item.due,
    //     priority: item.priority,
    //     difficulty: item.difficulty,
    //     duration: item.duration,
    //     flexible: item.flexible,
    //     auto: item.auto,
    //     uid: item.uid,
    //     calendarID: item.calendarID,
    //     siid: item.siid,
    //   });
    // }
    setIsEditing(true);
  };
  useEffect(() => {
    if (edittingItem) {
      console.log("Editing event hi: ", edittingItem);
    }
  }, [edittingItem]);

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
        } relative`}
      >
        {showLabel && isHourMark && (
          <span className="absolute bg-background -top-2 left-0 text-xs text-accent-foreground">
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

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

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
          backgroundColor: "#800080", //chaange to item.color
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
            console.log("item clicked, item:", item);

            // Log the item structure for debugging
            console.log("Item Structure: ", item);

            // ignore error lol
            const eventFormData: EventFormData = {
              ...item, // Spread properties from the original item
              type: "event", // Ensure type is always "event"
              siid: item.siid,
              uid: item.uid,
            };

            // Log the final event form data to check everything
            console.log("Final EventFormData: ", eventFormData);

            handleEditItem(eventFormData);
            console.log("Editing event");
          }}
          className="scale-95 rounded-sm transition-transform p-2 text-white"
        >
          <h1 className="font-medium truncate">{item.title}</h1>
          <p className="text-xs">
            {format(item.start, "h:mm a")} - {format(item.end, "h:mm a")}
          </p>
        </div>
      );
    }
  );

  const renderItems = useCallback(
    (day: Date, containerHeight: number, isMonthView: boolean = false) => {
      const dayStart = startOfDay(day);
      const dayItems = scheduleItems.filter(
        (item) =>
          isSameDay(item.start, day) &&
          selectedCalenders.includes(item.calendarID)
      );

      if (isMonthView) {
        return dayItems.map((item) => (
          <div
            key={item.siid}
            className="text-xs p-1 mb-1 rounded cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ backgroundColor: "#800080" }} // change to item.color
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(item);
              console.log("item clicked");
            }}
          >
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
              key={subItem.siid}
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
              key={item.siid}
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
    [items, scheduleItems, selectedCalenders]
  );

  const renderDayView = useCallback(() => {
    return (
      <div className="flex flex-col h-full">
        <div className="flex">
          <div className="w-16" />
          <div className="flex-1 py-2">{format(currentDate, "EEE d")}</div>
        </div>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto relative" ref={scheduleRef}>
            <div className="flex h-[1440px]">
              <div className="w-16 flex-shrink-0 bg-background z-10">
                {renderTimeSlots(true, currentDate)}
              </div>
              <div
                className="flex-1 relative"
                onMouseMove={(e) => handleMouseMove(e, currentDate)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const yPosition = e.clientY - rect.top;
                  handleScheduleClick(currentDate, yPosition);
                }}
              >
                {renderTimeSlots(false, currentDate)}
                {scheduleRef.current &&
                  renderItems(currentDate, scheduleRef.current.scrollHeight)}
                {ghostLinePosition &&
                  ghostLineDay &&
                  isSameDay(ghostLineDay, currentDate) && (
                    <div
                      className="absolute left-0 right-0 border-t border-blue-300 pointer-events-none"
                      style={{ top: `${ghostLinePosition.top}px` }}
                    >
                      <span className="absolute left-0 top-0 bg-blue-300 text-xs px-1 rounded-bl">
                        {format(ghostLinePosition.time, "h:mm a")}
                      </span>
                    </div>
                  )}
                <div
                  id="current-time-line"
                  className="absolute z-10 left-0 right-0 border-t border-red-500 pointer-events-none flex items-center"
                >
                  <div className="size-2 z-10 rounded-full bg-red-500 -my-1 -ml-1"></div>
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
      <div className="flex flex-col">
        <div className="flex">
          <div className="w-16" />
          {days.map((day) => (
            <div key={day.toISOString()} className="flex-1 text-center py-2">
              {format(day, "EEE d")}
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto relative" ref={scheduleRef}>
          <div className="flex h-[1440px] relative">
            <div className="w-16 flex-shrink-0 bg-background z-10">
              {renderTimeSlots(true, days[0])}
            </div>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className="flex-1 border-l border-border relative"
                onMouseMove={(e) => handleMouseMove(e, day)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const yPosition = e.clientY - rect.top;
                  handleScheduleClick(day, yPosition);
                }}
              >
                {renderTimeSlots(false, day)}
                {scheduleRef.current &&
                  renderItems(day, scheduleRef.current.scrollHeight)}
                {ghostLinePosition &&
                  ghostLineDay &&
                  isSameDay(ghostLineDay, day) && (
                    <div
                      className="absolute left-0 right-0 border-t border-blue-300 pointer-events-none"
                      style={{ top: `${ghostLinePosition.top}px` }}
                    >
                      <span className="absolute left-0 top-0 bg-blue-300 text-xs px-1 rounded-bl">
                        {format(ghostLinePosition.time, "h:mm a")}
                      </span>
                    </div>
                  )}
                {isSameDay(now, day) && (
                  <div
                    id="current-time-line"
                    className="absolute z-10 left-0 right-0 border-t border-red-500 pointer-events-none flex items-center"
                    style={{
                      top: `${
                        ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100
                      }%`,
                    }}
                  >
                    <div className="size-2 z-10 rounded-full bg-red-500 -my-1 -ml-1"></div>
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
      <div className="grid grid-cols-7 gap-1 h-full">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold py-2">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`border border-border p-1 ${
              isSameMonth(day, currentDate) ? "bg-background" : "bg-accent"
            }`}
          >
            <div className="text-right text-sm">{format(day, "d")}</div>
            <div className="overflow-y-auto h-24">
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
      sensors={[pointerSensor]}
      autoScroll={false}
    >
      <div className="flex-grow h-full flex flex-col p-4 bg-background text-foreground">
        <ScrollArea className="h-full">
          {view === "day" && renderDayView()}
          {view === "week" && renderWeekView()}
          {view === "month" && renderMonthView()}
        </ScrollArea>
        <Dialog open={newItem !== null} onOpenChange={() => setNewItem(null)}>
          <DialogHeader>
            <DialogTitle className="sr-only">Create New Item</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new item
            </DialogDescription>
          </DialogHeader>
          <DialogContent>
            <CreateItemTabs
              onFormSubmit={() => {}}
              onItemCreate={handleItemCreate}
            />
          </DialogContent>
        </Dialog>
        {/* <Popover
          open={selectedItem !== null}
          onOpenChange={() => setSelectedItem(null)}
        >
          <PopoverContent>
            {selectedItem && (
              <div>
                <h3 className="font-semibold">{selectedItem.title}</h3>
                <p>Start: {format(selectedItem.start, "PPp")}</p>
                <p>End: {format(selectedItem.end, "PPp")}</p>
              </div>
            )}
          </PopoverContent>
        </Popover> */}
      </div>
      {/* Render the EditEventForm when editing an item */}
      {isEditing && edittingItem && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>
                Edit the details of the selected event.
              </DialogDescription>
            </DialogHeader>
            <EditEventForm
              eventData={edittingItem as EventFormData}
              onClose={() => setIsEditing(false)}
              onSubmit={(updatedEvent: EventFormData) => {
                const updatedItem: ScheduleItem = {
                  ...updatedEvent,
                  color: "#800080", // Provide a default color if missing
                };
                setIsEditing(false); // Close the dialog
                onItemUpdate(updatedItem); // Call the update function
              }}
              eventId={edittingItem.siid}
            />
          </DialogContent>
        </Dialog>
      )}
    </DndContext>
  );
};

export default Schedule;
