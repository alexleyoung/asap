"use client";

import { useState } from "react";
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
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string({
    required_error: "Due date is required",
  }),
  dueTime: z.string({
    required_error: "Due time is required",
  }),
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Difficulty is required",
  }),

  description: z.string().optional(),
  duration: z
    .number({
      required_error: "Duration is required",
    })
    .min(0, "Duration must be a positive number"),
  priority: z.enum(["low", "normal", "high, asap"]),
  flexible: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  onSubmit: (data: TaskPost) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [dueDate, setDueDate] = useState<Date>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      duration: 0,
      priority: "normal",
      description: "",
      flexible: false,
      difficulty: "easy",
      dueTime: format(new Date(), "HH:mm"),
      dueDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const handleSubmit = (data: FormValues) => {
    const due = new Date(`${data.dueDate}T${data.dueTime}`);

    onSubmit({
      title: data.title,
      due: due.toISOString(),
      description: data.description || "",
      user_id: "default-user-id", // This would be replaced with actual user ID
      calendar_id: "default-calendar-id", // This would be replaced with actual calendar ID
    });
  };
  const handleDateChange = (field: "dueDate", date: Date | undefined) => {
    if (date) {
      form.setValue(field, format(date, "yyyy-MM-dd"));
      if (field === "dueDate") setDueDate(date);
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
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Due Date</FormLabel>
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
                        setDueDate(date);
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
                        selected={dueDate}
                        onSelect={(date) => {
                          handleDateChange("dueDate", date);
                        }}
                        className="rounded-md border"
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
            name="dueTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Due Time</FormLabel>
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
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (in minutes)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Duration" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-[5.5rem] ">
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="asap">ASAP</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                You can provide additional details about the task here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-64">
          <FormField
            control={form.control}
            name="flexible"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormLabel className="m-0">Flexible?</FormLabel>
                  <FormControl>
                    <Checkbox />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" variant="secondary">
              Create Task
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
export default TaskForm;
