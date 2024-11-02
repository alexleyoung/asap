"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "@/components/ui/date-picker";
import TimePicker from "@/components/ui/time-picker";
import { Calendar, EventPost } from "@/lib/types";

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

type EventFormProps = {
  onSubmit: (data: EventPost) => void;
  calendars: Calendar[];
  loading: boolean;
};

export function EventForm({
  onSubmit,
  calendars,
  loading = false,
}: EventFormProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(Date.now() + 60 * 60 * 1000)
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      start: startDate,
      end: endDate,
      description: "",
      category: "",
      frequency: "",
      location: "",
      userID: -1,
      calendarID: 1, // temp default
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
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

        <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0'>
          <FormField
            control={form.control}
            name='start'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>Start</FormLabel>
                <div className='flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0'>
                  <DatePicker
                    date={field.value}
                    onDateChange={(date) => {
                      const newDate = new Date(date);
                      newDate.setHours(
                        field.value.getHours(),
                        field.value.getMinutes()
                      );
                      field.onChange(newDate);
                      setStartDate(newDate);
                    }}
                  />
                  <TimePicker
                    date={field.value}
                    onTimeChange={(date) => {
                      const newDate = new Date(field.value);
                      newDate.setHours(date.getHours(), date.getMinutes());
                      field.onChange(newDate);
                      setStartDate(newDate);
                    }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='end'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>End</FormLabel>
                <div className='flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0'>
                  <DatePicker
                    date={field.value}
                    onDateChange={(date) => {
                      const newDate = new Date(date);
                      newDate.setHours(
                        field.value.getHours(),
                        field.value.getMinutes()
                      );
                      field.onChange(newDate);
                      setEndDate(newDate);
                    }}
                  />
                  <TimePicker
                    date={field.value}
                    onTimeChange={(date) => {
                      const newDate = new Date(field.value);
                      newDate.setHours(date.getHours(), date.getMinutes());
                      field.onChange(newDate);
                      setEndDate(newDate);
                    }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder='Event description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='work'>Work</SelectItem>
                  <SelectItem value='personal'>Personal</SelectItem>
                  <SelectItem value='family'>Family</SelectItem>
                  <SelectItem value='other'>Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='frequency'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a frequency' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='once'>Once</SelectItem>
                  <SelectItem value='daily'>Daily</SelectItem>
                  <SelectItem value='weekly'>Weekly</SelectItem>
                  <SelectItem value='monthly'>Monthly</SelectItem>
                  <SelectItem value='yearly'>Yearly</SelectItem>
                </SelectContent>
              </Select>
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
                <Input placeholder='Event location' {...field} />
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
              <FormLabel>Calendar</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a calendar' />
                  </SelectTrigger>
                </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end'>
          <Button type='submit' disabled={loading}>
            {loading ? "Creating Event..." : "Create Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
