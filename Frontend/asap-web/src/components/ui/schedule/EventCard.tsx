import { format, differenceInMinutes } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { EventDetailsPopover } from "@/components/ui/schedule/EventDetailsPopover";
import { formatHour } from "@/lib/utils";

type CalendarEventCardProps = {
  event: CalendarEvent;
  onDeleteEvent: (event: CalendarEvent) => Promise<void>;
  isAllDay?: boolean;
};

export function EventCard({
  event,
  onDeleteEvent,
  isAllDay = false,
}: CalendarEventCardProps) {
  const startMinutes = format(event.start_date, "mm");
  const endMinutes = format(event.end_date, "mm");
  const startTime = formatHour(
    Number(format(event.start_date, "HH")),
    Number(startMinutes)
  );
  const endTime = formatHour(
    Number(format(event.end_date, "HH")),
    Number(endMinutes)
  );
  const duration = differenceInMinutes(event.end_date, event.start_date);

  // Define a threshold for minimum duration to show time (e.g., 30 minutes)
  const MIN_DURATION_TO_SHOW_TIME = 31;

  if (isAllDay) {
    return (
      <Card className='h-full shadow-sm bg-highlight'>
        <CardContent className='p-1 h-full flex items-center'>
          <h3 className='text-xs font-semibold truncate'>{event.title}</h3>
        </CardContent>
      </Card>
    );
  }

  return (
    <EventDetailsPopover event={event} onDeleteEvent={onDeleteEvent}>
      <Card className='h-full z-50 shadow-sm'>
        <CardContent className='p-2 h-full flex flex-col'>
          <h3 className='text-xs font-semibold truncate'>{event.title}</h3>
          {duration >= MIN_DURATION_TO_SHOW_TIME && (
            <span className='text-xs text-muted-foreground mt-1 truncate'>
              {startTime} - {endTime}
            </span>
          )}
        </CardContent>
      </Card>
    </EventDetailsPopover>
  );
}
