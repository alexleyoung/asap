import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, CalendarPost } from "@/lib/types";
import { updateCalendar } from "@/lib/scheduleCrud";

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Calendar name is required"),
  description: z.string(),
  timezone: z.string(),
  userID: z.number(),
});

type CalendarFormValues = z.infer<typeof formSchema>;

interface EditCalendarFormProps {
  calendar: Calendar;
  onSave: (arg0: CalendarPost) => void;
}

const EditCalendarForm = ({ calendar, onSave }: EditCalendarFormProps) => {
  const form = useForm<CalendarFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: calendar.id,
      name: calendar.name,
      description: calendar.description,
      timezone: calendar.timezone,
      userID: calendar.userID,
    },
  });

  const handleSubmit = async (values: CalendarFormValues) => {
    try {
      const updatedCalendar = await updateCalendar(values);
      onSave(updatedCalendar);
    } catch {
      console.error("Failed to update calendar");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calendar Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter a calendar name' {...field} />
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
                <Input placeholder='Enter a description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Input placeholder="Enter a timezone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calendar Color</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a color' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='red'>Red</SelectItem>
                    <SelectItem value='green'>Green</SelectItem>
                    <SelectItem value='blue'>Blue</SelectItem>
                    <SelectItem value='yellow'>Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <div className='flex justify-end'>
          <Button type='submit' variant='secondary'>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCalendarForm;
