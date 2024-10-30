"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, parse } from "date-fns";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarType,
  EventFormData,
  ScheduleEvent,
} from "@/lib/types";
import Schedule from "@/components/dashboard/schedule";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z.string({
    required_error: "Start date is required",
  }),
  startTime: z.string({
    required_error: "Start time is required",
  }),
  endDate: z.string({
    required_error: "End date is required",
  }),
  endTime: z.string({
    required_error: "End time is required",
  }),
  location: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  frequency: z.string().optional(),
  calendarID: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  onItemCreate: (newItem: ScheduleItem) => void;
}

export function EventForm({ onSubmit, onItemCreate }: EventFormProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [calendars, setCalendars] = useState<CalendarType[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      description: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      startTime: format(new Date(), "HH:mm"),
      endDate: format(new Date(), "yyyy-MM-dd"),
      endTime: format(new Date(), "HH:mm"),
      calendarID: 1,
    },
  });

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch("/api/calendars");
        const data = await response.json();
        setCalendars(data);
      } catch (error) {
        console.error("Failed to fetch calendars:", error);
      }
    };
    fetchCalendars();
  }, []);

  const handleSubmit = (data: FormValues) => {
    const start = new Date(`${data.startDate}T${data.startTime}`);
    const end = new Date(`${data.endDate}T${data.endTime}`);
    const userData = JSON.parse(localStorage.getItem("User") || "{}");
    const userId = Number(userData.id); // Ensure user.id is converted to a number
    const eventID = Math.floor(Math.random() * 1000); // Generate a random event ID
    const newEvent: EventFormData & ScheduleEvent & { color: string } = {
      type: "event",
      title: data.title,
      start: start,
      end: end,
      location: data.location || "",
      description: data.description || "",
      category: data.category || "",
      frequency: data.frequency || "",
      uid: userId,
      calendarID: data.calendarID,
      siid: eventID,
      color: "#000000", // Add a default color or modify as needed
    };
    console.log("New event:", newEvent);
    onSubmit(newEvent);
    console.log("onitem creating in eventform");
    onItemCreate(newEvent);
  };

  const handleDateChange = (
    field: "startDate" | "endDate",
    date: Date | undefined
  ) => {
    if (date) {
      form.setValue(field, format(date, "yyyy-MM-dd"));
      if (field === "startDate") setStartDate(date);
      if (field === "endDate") setEndDate(date);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 w-full max-w-md mx-auto"
      >
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
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Start Date</FormLabel>
                <div className="flex items-center">
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value
                          ? format(new Date(field.value), "MMM. d, yyyy")
                          : ""
                      }
                      onChange={(e) => {
                        const date = parse(
                          e.target.value,
                          "MMM. d, yyyy",
                          new Date()
                        );
                        field.onChange(format(date, "yyyy-MM-dd"));
                        setStartDate(date);
                      }}
                      placeholder="MMM. DD, YYYY"
                    />
                  </FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "ml-2 w-10 p-0",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => handleDateChange("startDate", date)}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>End Date</FormLabel>
                <div className="flex items-center">
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value
                          ? format(new Date(field.value), "MMM. d, yyyy")
                          : ""
                      }
                      onChange={(e) => {
                        const date = parse(
                          e.target.value,
                          "MMM. d, yyyy",
                          new Date()
                        );
                        field.onChange(format(date, "yyyy-MM-dd"));
                        setEndDate(date);
                      }}
                      placeholder="MMM. DD, YYYY"
                    />
                  </FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "ml-2 w-10 p-0",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => handleDateChange("endDate", date)}
                        disabled={(date) => {
                          const today = new Date(
                            new Date().setHours(0, 0, 0, 0)
                          );
                          return (
                            date < today ||
                            (startDate ? date < startDate : false)
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Event location" {...field} />
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
                <Textarea
                  placeholder="Event description (optional)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can provide additional details about the event here.
              </FormDescription>
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
        <div className="flex justify-end">
          <Button type="submit" variant="secondary">
            Create Event
          </Button>
        </div>
      </form>
    </Form>
  );
}
