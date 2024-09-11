import { isSameDay, isWithinInterval } from "date-fns";

import { EventCard } from "./EventCard";
import { isAllDayEvent } from "@/lib/utils";

type AllDayRowProps = {
  events: CalendarEvent[];
  start_date: Date;
  onEventClick: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => Promise<void>;
};

export function AllDayRow({
  events,
  start_date,
  onEventClick,
  onDeleteEvent,
}: AllDayRowProps) {
  const allDayEvents = events.filter(isAllDayEvent);

  return (
    <div className='flex border-b bg-background'>
      <div className='w-16 border-r text-xs p-1 flex-shrink-0 text-muted-foreground'>
        All-day
      </div>
      <div className='flex-1 flex'>
        {Array.from({ length: 7 }).map((_, index) => {
          const day = new Date(start_date);
          day.setDate(start_date.getDate() + index);
          const dayEvents = allDayEvents.filter((event) =>
            isWithinInterval(day, {
              start: event.start_date,
              end: event.end_date,
            })
          );
          return (
            <div key={index} className='flex-1 border-l p-1 min-h-[2.5rem]'>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className='mb-1'
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}>
                  <EventCard
                    event={event}
                    isAllDay={true}
                    onDeleteEvent={onDeleteEvent}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
