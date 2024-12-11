"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TaskPost } from "@/lib/types";
import { useCalendars } from "@/contexts/CalendarsContext";
import { createTask } from "@/lib/scheduleCrud";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  priority: z.enum(["low", "medium", "high"]),
  frequency: z.string(),
  category: z.string(),
  auto: z.boolean(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  completed: z.boolean(),
  flexible: z.boolean(),
  userID: z.number(),
  calendarID: z.number(),
  color: z.string(),
});

interface TaskFormProps {
  onSubmit: (data: TaskPost) => void;
  loading: boolean;
}

export function TaskForm({ onSubmit, loading }: TaskFormProps) {
  const [dateString, setDateString] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const { calendars } = useCalendars();

  const form = useForm<TaskPost>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 30,
      dueDate: new Date(),
      priority: "medium",
      frequency: "",
      category: "",
      difficulty: "medium",
      auto: false,
      flexible: false,
      completed: false,
      userID: -1,
      calendarID: calendars[0].id,
      color: "blue",
    },
  });

  async function onSubmitForm(values: TaskPost) {
    onSubmit({ ...values, completed: false });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className='space-y-8'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter task title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='duration'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={1}
                    placeholder='Enter duration'
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='dueDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input
                    type='date' // Using 'date' type for date selection
                    {...field}
                    value={dateString} // Ensure this is formatted as 'YYYY-MM-DD'
                    onChange={(e) => {
                      setDateString(e.target.value); // Store the string representation
                      field.onChange(new Date(e.target.value)); // Convert to Date for the field
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

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='priority'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select priority' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='low'>Low</SelectItem>
                    <SelectItem value='medium'>Medium</SelectItem>
                    <SelectItem value='high'>High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='difficulty'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select difficulty' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='easy'>Easy</SelectItem>
                    <SelectItem value='medium'>Medium</SelectItem>
                    <SelectItem value='hard'>Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='auto'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id='auto'
                />
              </FormControl>
              <Label
                htmlFor='auto'
                className='flex flex-col space-y-1 leading-none cursor-pointer'>
                <span>Auto Schedule</span>
                <span className='text-sm text-muted-foreground'>
                  Allow the system to automatically schedule this task
                </span>
              </Label>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='flexible'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id='flexible'
                />
              </FormControl>
              <Label
                htmlFor='flexible'
                className='flex flex-col space-y-1 leading-none cursor-pointer'>
                <span>Flexible</span>
                <span className='text-sm text-muted-foreground'>
                  The deadline for this task is soft and can be adjusted if
                  needed
                </span>
              </Label>
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
                <Textarea placeholder='Enter task description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end mt-6'>
          <Button type='submit' disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
