"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Textarea } from "@/components/ui/textarea";
import { format, setHours, setMinutes } from "date-fns";
import { CalendarIcon, Sparkles } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

export const formSchema = z.object({
  user_id: z.string(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  content: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "asap"]),
  status: z.enum(["todo", "in-progress", "completed"]),
  duration: z.number().int().positive(),
  auto_schedule: z.boolean(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  deadline: z.date().optional(),
});

type TaskCreationFormProps = {
  user: PubUser;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  initialData?: { user_id: string; start_date: Date; end_date: Date } | null;
};

export default function TaskCreationForm({
  user,
  onSubmit,
  initialData,
}: TaskCreationFormProps) {
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [showTimeStart, setShowTimeStart] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: String(user.id),
      title: "",
      description: "",
      content: "",
      priority: "medium",
      status: "todo",
      start_date: initialData?.start_date,
      end_date: new Date(
        (initialData?.start_date || new Date()).getTime() + 30 * 60 * 1000
      ),
      auto_schedule: true,
      duration: 30,
    },
  });

  return (
    <div className='w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex'>
          <div className='flex-1 p-6 space-y-4'>
            <h3 className='text-lg font-semibold mb-4'>Create New Task</h3>
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
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter task description' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter task details'
                      className='min-h-[180px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='w-64 border-l p-6 space-y-4'>
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
                      <SelectItem value='low'>
                        <div className='flex items-center gap-2'>
                          <div className='size-3 bg-green-500 rounded-full' />
                          Low
                        </div>
                      </SelectItem>
                      <SelectItem value='medium'>
                        <div className='flex items-center gap-2'>
                          <div className='size-3 bg-yellow-500 rounded-full' />
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value='high'>
                        <div className='flex items-center gap-2'>
                          <div className='size-3 bg-red-500 rounded-full' />
                          High
                        </div>
                      </SelectItem>
                      <SelectItem value='asap'>
                        <div className='flex items-center gap-2'>
                          <div className='size-3 bg-red-500 rounded-full' />
                          ASAP!
                        </div>
                      </SelectItem>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='todo'>
                        <div className='flex items-center gap-2'>
                          <div className='size-3 border border-primary' />
                          Todo
                        </div>
                      </SelectItem>
                      <SelectItem value='in-progress'>
                        <div className='flex items-center gap-2'>
                          <div className='size-3 border border-highlight' />
                          In-Progress
                        </div>
                      </SelectItem>
                      <SelectItem value='completed'>
                        <div className='flex items-center gap-2'>
                          <div className='size-3 border border-green-500' />
                          Completed
                        </div>
                      </SelectItem>
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
                <FormItem className='flex flex-col'>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if (value === "custom") {
                          setShowCustomDuration(true);
                        } else {
                          setShowCustomDuration(false);
                          field.onChange(parseInt(value));
                          form.setValue(
                            "end_date",
                            new Date(
                              (
                                form.getValues("start_date") || new Date()
                              ).getTime() +
                                parseInt(value) * 60000
                            )
                          );
                        }
                      }}
                      defaultValue={field.value.toString()}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select duration' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='15'>15 minutes</SelectItem>
                        <SelectItem value='30'>30 minutes</SelectItem>
                        <SelectItem value='60'>60 minutes</SelectItem>
                        <SelectItem value='90'>90 minutes</SelectItem>
                        <SelectItem value='custom'>Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {showCustomDuration && (
                    <Input
                      type='number'
                      min={1}
                      placeholder='Enter custom duration'
                      onChange={(e) => {
                        if (e) {
                          field.onChange(parseInt(e.target.value));
                        }
                      }}
                      value={field.value}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='deadline'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}>
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='auto_schedule'
              render={({ field }) => (
                <FormItem className='flex items-center gap-3'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        if (typeof checked === "boolean") {
                          setShowTimeStart(!checked);
                        }
                        field.onChange(checked);
                      }}
                    />
                  </FormControl>
                  <FormLabel className='flex items-center -translate-y-1 gap-1'>
                    Auto Schedule <Sparkles size='16' />
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showTimeStart && (
              <FormField
                control={form.control}
                name='start_date'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}>
                            {field.value ? (
                              format(field.value, "PPP 'at' h:mm a")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <div className='flex flex-col space-y-4 p-4'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                const currentHour = field.value
                                  ? field.value.getHours()
                                  : 0;
                                const currentMinute = field.value
                                  ? Math.floor(field.value.getMinutes() / 5) * 5
                                  : 0;
                                const updatedDate = setMinutes(
                                  setHours(date, currentHour),
                                  currentMinute
                                );
                                field.onChange(updatedDate);
                                form.setValue(
                                  "end_date",
                                  new Date(
                                    updatedDate.getTime() +
                                      (form.getValues("duration") || 0) * 60000
                                  )
                                );
                                console.log(form.getValues("duration"));
                              }
                            }}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                          <div className='flex space-x-2'>
                            <Select
                              value={
                                field.value
                                  ? (
                                      field.value.getHours() % 12 || 12
                                    ).toString() +
                                    (field.value.getHours() < 12
                                      ? " AM"
                                      : " PM")
                                  : "12 AM"
                              }
                              onValueChange={(value) => {
                                const [hour, period] = value.split(" ");
                                let newHour = parseInt(hour);
                                if (period === "PM" && newHour !== 12)
                                  newHour += 12;
                                if (period === "AM" && newHour === 12)
                                  newHour = 0;
                                const newDate = setHours(
                                  field.value || new Date(),
                                  newHour
                                );
                                field.onChange(newDate);
                                form.setValue(
                                  "end_date",
                                  new Date(
                                    newDate.getTime() +
                                      (form.getValues("duration") || 0) * 60000
                                  )
                                );
                              }}>
                              <SelectTrigger className='w-[110px]'>
                                <SelectValue placeholder='Select hour' />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={`${i % 12 || 12} ${
                                      i < 12 ? "AM" : "PM"
                                    }`}>
                                    {`${i % 12 || 12} ${i < 12 ? "AM" : "PM"}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={
                                field.value
                                  ? (
                                      Math.floor(field.value.getMinutes() / 5) *
                                      5
                                    )
                                      .toString()
                                      .padStart(2, "0")
                                  : "00"
                              }
                              onValueChange={(value) => {
                                const newDate = setMinutes(
                                  field.value || new Date(),
                                  parseInt(value)
                                );
                                field.onChange(newDate);
                                form.setValue(
                                  "end_date",
                                  new Date(
                                    newDate.getTime() +
                                      (form.getValues("duration") || 0) * 60000
                                  )
                                );
                              }}>
                              <SelectTrigger className='w-[80px]'>
                                <SelectValue placeholder='Min' />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={(i * 5).toString().padStart(2, "0")}>
                                    {(i * 5).toString().padStart(2, "0")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type='submit' className='w-full'>
              Create Task
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
