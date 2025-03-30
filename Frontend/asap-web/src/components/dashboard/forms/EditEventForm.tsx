"use client";

import { Event } from "@/lib/types";
import React, { useState } from "react";
import { updateEvent, deleteEvent } from "@/lib/scheduleCrud";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditEventFormProps {
  onClose: () => void;
  eventData: Event;
  onSubmit: (updatedEvent: Event) => void;
}

const eventSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required"),
  start: z.date(),
  end: z.date(),
  description: z.string(),
  category: z.string(),
  frequency: z.string(),
  location: z.string(),
  color: z.string(),
  userID: z.number(),
  calendarID: z.number(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export function EditEventForm({
  onClose,
  eventData,
  onSubmit,
}: EditEventFormProps) {
  const [loading, setLoading] = useState(false);

  // Format for datetime-local input (YYYY-MM-DDThh:mm)
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const { setEvents, events } = useScheduleItems();
  const { toast } = useToast();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      id: eventData.id,
      title: eventData.title,
      start: new Date(eventData.start),
      end: new Date(eventData.end),
      description: eventData.description,
      category: eventData.category,
      frequency: eventData.frequency,
      location: eventData.location,
      color: eventData.color,
      userID: eventData.userID,
      calendarID: eventData.calendarID,
    },
  });

  const handleDelete = async () => {
    try {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventData.id)
      );
      await deleteEvent(eventData.id);
      onClose(); // Close the form after deletion
      toast({
        title: "Event deleted",
        description: "Your event has been deleted.",
      });
    } catch (error) {
      setEvents((prevEvents) => [...prevEvents, eventData]);
      toast({
        title: "Event deletion failed",
        description: "Failed to delete your event.",
        variant: "destructive",
      });
      console.error("Failed to delete event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: EventFormValues) => {
    try {
      // if(membership.permissions !== "ADMIN" || membership.permissions !== "EDITOR") {
      //   toast({
      //     title: "Error",
      //     description: "You do not have permission to edit event",
      //     duration: 3000,
      //   });
      //   return;
      // }
      setLoading(true);
      const response = await updateEvent(data);
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails.message || "Unknown error"}`);
      }
      setEvents(
        events.map((event) => {
          if (event.id == data.id) {
            return data;
          }
          return event;
        })
      );
      onSubmit(data);
    } catch (error) {
      console.error("Failed to update event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Event title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder='Event Description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='start'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  type='datetime-local'
                  {...field}
                  value={formatDateForInput(field.value)}
                  onChange={(e) => {
                    field.onChange(new Date(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='end'
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input
                  type='datetime-local'
                  {...field}
                  value={formatDateForInput(field.value)}
                  onChange={(e) => {
                    field.onChange(new Date(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder='Event Location' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='color'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Blue' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='red'>
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded-full bg-red-500' />
                        Red
                      </div>
                    </SelectItem>
                    <SelectItem value='yellow'>
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded-full bg-yellow-500' />
                        Yellow
                      </div>
                    </SelectItem>
                    <SelectItem value='green'>
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded-full bg-green-500' />
                        Green
                      </div>
                    </SelectItem>
                    <SelectItem value='blue'>
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded-full bg-blue-500' />
                        Blue
                      </div>
                    </SelectItem>
                    <SelectItem value='purple'>
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded-full bg-purple-500' />
                        Purple
                      </div>
                    </SelectItem>
                    <SelectItem value='orange'>
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded-full bg-orange-500' />
                        Orange
                      </div>
                    </SelectItem>
                    <SelectItem value='lime'>
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded-full bg-lime-500' />
                        Lime
                      </div>
                    </SelectItem>
                    <SelectItem value='pink'>
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded-full bg-pink-500' />
                        Pink
                      </div>
                    </SelectItem>
                    <SelectItem value='indigo'>
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded-full bg-indigo-500' />
                        Indigo
                      </div>
                    </SelectItem>
                    <SelectItem value='cyan'>
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded-full bg-cyan-500' />
                        Cyan
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name='calendarID'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Calendar</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a calendar' />
                  </SelectTrigger>
                  <SelectContent>
                    {calendars.map((calendar) => (
                      <SelectItem
                        key={calendar.id}
                        value={calendar.id.toString()}>
                        {calendar.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <div className='flex justify-between'>
          <Button type='submit' variant='secondary' disabled={loading}>
            Save Changes
          </Button>
          <Button
            type='button'
            onClick={handleDelete}
            disabled={loading}
            variant='destructive'>
            Delete Event
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default EditEventForm;
