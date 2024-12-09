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
import { EventPost } from "@/lib/types";
import { useCalendars } from "@/contexts/CalendarsContext";

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

type EventFormProps = {
  onSubmit: (data: EventPost) => void;
  loading: boolean;
};

export function EventForm({ onSubmit, loading = false }: EventFormProps) {
  const [startString, setStartString] = useState(
    new Date().toISOString().substring(0, 14) + "00"
  );
  const [endString, setEndString] = useState(
    new Date(Date.now() + 60 * 60 * 1000).toISOString().substring(0, 14) + "00"
  );
  const { calendars } = useCalendars();

  const now = new Date();
  // Round to nearest 30 minutes
  now.setMinutes(Math.round(now.getMinutes() / 30) * 30);
  now.setSeconds(0);
  now.setMilliseconds(0);

  const oneHourLater = new Date(now);
  oneHourLater.setHours(now.getHours() + 1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      start: now,
      end: oneHourLater,
      category: "",
      frequency: "",
      location: "",
      color: "blue",
      userID: -1,
      calendarID: calendars[0].id, // temp default
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      start: new Date(values.start),
      end: new Date(values.end),
    });
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

        <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 w-full'>
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
                    value={startString}
                    onChange={(e) => {
                      setStartString(e.target.value);
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
                    value={endString}
                    onChange={(e) => {
                      setEndString(e.target.value);
                      field.onChange(new Date(e.target.value));
                    }}
                  />
                </FormControl>
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
