import React from "react";
import { EventCard } from "./EventCard";

type PositionedEvent = {
  item: CalendarEvent;
  left: number;
  width: number;
};

type EventRendererProps = {
  events: PositionedEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventMouseEnter: () => void;
  onEventMouseLeave: () => void;
  onDeleteEvent: (event: CalendarEvent) => Promise<void>;
};

export function EventRenderer({
  events,
  onEventClick,
  onEventMouseEnter,
  onEventMouseLeave,
  onDeleteEvent,
}: EventRendererProps) {
  return (
    <>
      {events.map(({ item: event, left, width }) => (
        <div
          key={event.id}
          className='absolute z-10 cursor-pointer'
          style={{
            top: `${
              ((event.start_date.getHours() * 60 +
                event.start_date.getMinutes()) /
                1440) *
              100
            }%`,
            height: `${
              ((event.end_date.getTime() - event.start_date.getTime()) /
                (24 * 60 * 60 * 1000)) *
              100
            }%`,
            left: `${left * 100}%`,
            width: `${width * 100}%`,
          }}
          onClick={() => onEventClick(event)}
          onMouseEnter={onEventMouseEnter}
          onMouseLeave={onEventMouseLeave}>
          <EventCard event={event} onDeleteEvent={onDeleteEvent} />
        </div>
      ))}
    </>
  );
}
