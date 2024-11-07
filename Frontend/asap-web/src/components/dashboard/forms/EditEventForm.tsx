import { EventFormData } from "@/lib/types";
import React, { use, useEffect, useState } from "react";
import { fetchCalendars, updateEvent } from "@/lib/scheduleCrud";
import { deleteEvent } from "@/lib/scheduleCrud";
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

interface EditEventFormProps {
  eventId: number;
  onClose: () => void;
  eventData: EventFormData;
  onSubmit: (updatedEvent: EventFormData) => void;
  ws?: WebSocket;
}

export type OmittedEventFormData = Omit<
  EventFormData,
  "siid" | "uid" | "calendarID" | "type"
>;
export interface OrderedEventFormData {
  title: string;
  start: Date; // Adjust this type as needed
  end: Date; // Adjust this type as needed
  description: string;
  category: string;
  frequency: string;
  location: string;
  calendarID: number; // Adjust this type as needed
}

const eventSchema = z.object({
  title: z.string().min(1, "title is required"),
  start: z.date(),
  end: z.date(),
  description: z.string(),
  category: z.string(),
  frequency: z.string(),
  location: z.string(),
  calendarID: z.number(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export function EditEventForm({
  eventId,
  onClose,
  eventData,
  onSubmit,
  ws,
}: EditEventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      description: eventData.description,
      category: eventData.category,
      frequency: eventData.frequency,
      location: eventData.location,
      calendarID: eventData.calendarID,
    },
  });
  const [title, setTitle] = useState(eventData.title);
  const [description, setDescription] = useState(eventData.description);
  const [start, setStartDate] = useState(new Date(eventData.start));
  const [end, setEndDate] = useState(new Date(eventData.end));
  const [location, setLocation] = useState(eventData.location);
  const [loading, setLoading] = useState(false);
  const [newEventData, setEventData] = useState<EventFormData | null>(null);
  const [calendars, setCalendars] = useState<any[]>([]); // Adjust type as needed

  useEffect(() => {
    const loadCalendars = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("User")!);
        const response = await fetchCalendars(user.id);
        setCalendars(response);
      } catch (error) {
        console.error("Failed to fetch calendars:", error);
      }
    };
    loadCalendars();
  }, []);

  useEffect(() => {
    form.reset({
      ...eventData,
      start: eventData.start,
      end: eventData.end,
    });
  }, [eventData]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        setLoading(true);
        await deleteEvent(eventId); // Call the delete handler with eventId

        // Send WebSocket message to notify other clients of the deletion
        if (ws) {
          ws.send(
            JSON.stringify({ action: "delete_event", data: { eventId } })
          );
        }

        onClose(); // Close the form after deletion
      } catch (error) {
        console.error("Failed to delete event:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (data: OrderedEventFormData) => {
    try {
      // Create the updated event object with the correct types
      const updatedEvent = {
        ...data,
      };
      console.log("Updated event before submission:", updatedEvent);

      // Call the update handler
      handleUpdate(updatedEvent);
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event data");
        }
        const data = await response.json();
        setEventData(data);
      } catch (error) {
        console.error("Failed to fetch event data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, deleteEvent]);

  const handleUpdate = async (updatedEvent: OrderedEventFormData) => {
    try {
      setLoading(true);

      // Format start and end to ISO string if required by the backend
      const formattedEvent = {
        title: updatedEvent.title,
        start: new Date(updatedEvent.start),
        end: new Date(updatedEvent.end),
        description: updatedEvent.description,
        category: updatedEvent.category,
        frequency: updatedEvent.frequency,
        location: updatedEvent.location,
        calendarID: updatedEvent.calendarID,
      };
      console.log(
        "Formatted event data being sent to backend:",
        formattedEvent
      );

      const response = await updateEvent(formattedEvent, eventId);
      console.log("Response status from backend:", response.status);

      // Check if the response is OK
      if (!response.ok) {
        // Log detailed error information
        const errorDetails = await response.json(); // Assuming the backend returns JSON errors
        console.error("Failed to update event!:", errorDetails);
        throw new Error(`Error: ${errorDetails.message || "Unknown error"}`);
      }

      const fullEvent = {
        ...formattedEvent,
        siid: eventId,
        uid: eventData.uid,
        type: eventData.type,
        // calendarID: eventData.calendarID,
      };
      onSubmit({
        ...fullEvent,
        start: new Date(fullEvent.start),
        end: new Date(fullEvent.end),
      });
      console.log("Event updated successfully:", fullEvent);
    } catch (error) {
      console.error("Failed to update eventP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Event Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  placeholder="Event Start Date"
                  {...field}
                  value={field.value.toISOString().split("T")[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input
                  placeholder="Event End Date"
                  {...field}
                  value={field.value.toISOString().split("T")[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Event Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="calendarID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Calendar</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a calendar" />
                  </SelectTrigger>
                  <SelectContent>
                    {calendars.map((calendar) => (
                      <SelectItem
                        key={calendar.id}
                        value={calendar.id.toString()}
                      >
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

        <Button type="submit" variant="secondary" className="mr-2">
          Save Changes
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          variant="destructive"
        >
          Delete Event
        </Button>
      </form>
    </Form>
  );
}

export default EditEventForm;
