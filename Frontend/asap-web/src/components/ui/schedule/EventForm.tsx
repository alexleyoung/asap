import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parse, set } from "date-fns";

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
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

const eventFormSchema = z.object({
  user_id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  start_date: dateSchema,
  end_date: dateSchema,
});

export type EventFormData = z.infer<typeof eventFormSchema>;

type EventFormProps = {
  onSubmit: (data: EventFormData) => void;
  initialData: Partial<EventFormData>;
};

export function EventForm({ onSubmit, initialData }: EventFormProps) {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      user_id: initialData.user_id || "",
      title: initialData.title || "",
      description: initialData.description || "",
      location: initialData.location || "",
      start_date: initialData.start_date || new Date(),
      end_date: initialData.end_date || new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const renderDateTimeFields = (
    name: "start_date" | "end_date",
    label: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          <FormLabel>{label}</FormLabel>
          <div className='flex space-x-2'>
            <FormControl>
              <Input
                type='date'
                value={format(field.value, "yyyy-MM-dd")}
                onChange={(e) => {
                  const date = parse(e.target.value, "yyyy-MM-dd", new Date());
                  const newDateTime = set(field.value, {
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    date: date.getDate(),
                  });
                  field.onChange(newDateTime);
                }}
              />
            </FormControl>
            <FormControl>
              <Input
                type='time'
                value={format(field.value, "HH:mm")}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value
                    .split(":")
                    .map(Number);
                  const newDateTime = set(field.value, { hours, minutes });
                  field.onChange(newDateTime);
                }}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter event title' {...field} />
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
                <Textarea placeholder='Enter event description' {...field} />
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
                <Input placeholder='Enter event location' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {renderDateTimeFields("start_date", "Start Date and Time")}
        {renderDateTimeFields("end_date", "End Date and Time")}
        <DialogFooter>
          <Button type='submit'>Create Event</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
