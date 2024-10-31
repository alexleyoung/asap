"use client";

import { Event } from "@/lib/types";
import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCalendars } from "@/hooks/useCalendars";

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
  const { calendars, isLoading: isLoadingCalendars } = useCalendars();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      ...eventData,
      start: new Date(eventData.start),
      end: new Date(eventData.end),
    },
  });

  useEffect(() => {
    form.reset({
      ...eventData,
      start: new Date(eventData.start),
      end: new Date(eventData.end),
    });
  }, [eventData, form]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        setLoading(true);
        await deleteEvent(eventData.id);
        onClose();
      } catch (error) {
        console.error("Failed to delete event:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (data: EventFormValues) => {
    try {
      setLoading(true);
      const updatedEvent: Event = {
        ...data,
        start: new Date(data.start),
        end: new Date(data.end),
      };
      const response = await updateEvent(updatedEvent, eventData.id);
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails.message || "Unknown error"}`);
      }
      onSubmit(updatedEvent);
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
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
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
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
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
        />
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
