"use client";

import React from "react";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Pen, Trash, X } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";

type EventDetailsPopoverProps = {
  event: CalendarEvent;
  onDeleteEvent: (event: CalendarEvent) => Promise<void>;
  children: React.ReactNode;
};

export function EventDetailsPopover({
  event,
  onDeleteEvent,
  children,
}: EventDetailsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='text-end space-x-1'>
          <Button variant='ghost' className='size-8 p-0'>
            <Pen size={16} />
          </Button>
          <Button
            variant='ghost'
            className='size-8 p-0'
            onClick={() => onDeleteEvent(event)}>
            <Trash size={16} />
          </Button>
          <PopoverClose asChild>
            <Button variant='ghost' className='ml-4 size-8 p-0'>
              <X size={16} />
            </Button>
          </PopoverClose>
        </div>
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold'>{event.title}</h3>
          <p className='text-sm text-muted-foreground'>{event.description}</p>
          <div className='flex items-center space-x-2'>
            <Calendar className='h-4 w-4' />
            <span className='text-sm'>
              {format(event.start_date, "MMMM d, yyyy")}
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <Clock className='h-4 w-4' />
            <span className='text-sm'>
              {format(event.start_date, "h:mm a")} -{" "}
              {format(event.end_date, "h:mm a")}
            </span>
          </div>
          {event.location && (
            <div className='flex items-center space-x-2'>
              <MapPin className='h-4 w-4' />
              <span className='text-sm'>{event.location}</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
