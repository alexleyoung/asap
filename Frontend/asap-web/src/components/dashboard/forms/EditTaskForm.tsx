"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Task } from "@/lib/types";
import { updateTask } from "@/lib/scheduleCrud";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  start: z.date().nullable(),
  end: z.date().nullable(),
  dueDate: z.date(),
  category: z.string(),
  frequency: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  flexible: z.boolean(),
  auto: z.boolean(),
  userID: z.number(),
  calendarID: z.number(),
  completed: z.boolean(),
  color: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface EditTaskFormProps {
  task: Task;
  onSuccess?: () => void;
}

export function EditTaskForm({ task, onSuccess }: EditTaskFormProps) {
  // Format for datetime-local input (YYYY-MM-DDThh:mm)
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const now = new Date();
  // Round to nearest 30 minutes
  now.setMinutes(Math.round(now.getMinutes() / 30) * 30);
  now.setSeconds(0);
  now.setMilliseconds(0);

  const oneHourLater = new Date(now);
  oneHourLater.setHours(now.getHours() + 1);

  const [startString, setStartString] = useState(formatDateForInput(now));
  const [endString, setEndString] = useState(formatDateForInput(oneHourLater));
  const { setTasks } = useScheduleItems();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      start: task.start ? new Date(task.start) : null,
      end: task.end ? new Date(task.end) : null,
      dueDate: new Date(task.dueDate),
      category: task.category,
      frequency: task.frequency,
      priority: task.priority,
      difficulty: task.difficulty,
      duration: task.duration,
      flexible: task.flexible,
      auto: task.auto,
      userID: task.userID,
      calendarID: task.calendarID,
      completed: task.completed,
      color: task.color,
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const taskData = {
        ...data,
        id: task.id,
      };
      const updatedTask = await updateTask(taskData);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;
    const data = form.getValues();
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form className='space-y-6'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='col-span-1 space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} className='resize-none h-96' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='col-span-1 space-y-4'>
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

            <FormField
              control={form.control}
              name='duration'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
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
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select frequency' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='once'>Once</SelectItem>
                      <SelectItem value='daily'>Daily</SelectItem>
                      <SelectItem value='weekly'>Weekly</SelectItem>
                      <SelectItem value='monthly'>Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className='flex flex-col gap-4'>
              <FormField
                control={form.control}
                name='auto'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Auto Schedule</FormLabel>
                      <FormDescription>
                        Allow the system to automatically schedule this task?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              /> */}
            <FormField
              control={form.control}
              name='flexible'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <span className='text-base'>Flexible</span>
                      <FormDescription>
                        Can this task be rescheduled if needed?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormLabel>
                </FormItem>
              )}
            />
            {/* </div> */}

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
          </div>
        </div>
        <Button type='button' onClick={handleSubmit} className='mt-4'>
          Update Task
        </Button>
      </form>
    </Form>
  );
}
