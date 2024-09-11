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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

const taskFormSchema = z.object({
  user_id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in-progress", "completed"]),
  duration: z.number(),
  start_date: dateSchema,
  end_date: dateSchema,
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

type TaskFormProps = {
  onSubmit: (data: TaskFormData) => void;
  initialData: Partial<TaskFormData>;
};

export function TaskForm({ onSubmit, initialData }: TaskFormProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      user_id: initialData.user_id || "",
      title: initialData.title || "",
      description: initialData.description || "",
      priority: initialData.priority || "medium",
      status: initialData.status || "todo",
      duration: initialData.duration || 1,
      start_date: initialData.start_date || new Date(),
      end_date: initialData.end_date || new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const renderDateTimeFields = (
    name: "start_date" | "end_date",
    label: string
  ) => (
    <>
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
                    const date = parse(
                      e.target.value,
                      "yyyy-MM-dd",
                      new Date()
                    );
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
      <FormField
        control={form.control}
        name='duration'
        render={({ field }) => (
          <FormItem className='hidden'>
            <FormLabel>Duration (in hours)</FormLabel>
            <FormControl>
              <Input type='number' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter task title' {...field} />
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
                <Textarea placeholder='Enter task description' {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='todo'>To Do</SelectItem>
                  <SelectItem value='in-progress'>In Progress</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {renderDateTimeFields("start_date", "Start Date and Time")}
        {renderDateTimeFields("end_date", "End Date and Time")}
        <DialogFooter>
          <Button type='submit'>Create Task</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
