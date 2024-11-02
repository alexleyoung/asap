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

const calendarSchema = z.object({
  name: z.string().min(1, "Calendar name is required"),
  color: z.string().min(1, "Calendar color is required"),
});

type CalendarFormValues = z.infer<typeof calendarSchema>;

interface EditCalendarFormProps {
  calendar: {
    id: number;
    name: string;
    color: string;
  };
  onSave: (updatedCalendar: {
    id: number;
    name: string;
    color: string;
  }) => void;
}

const EditCalendarForm = ({ calendar, onSave }: EditCalendarFormProps) => {
  const form = useForm<CalendarFormValues>({
    resolver: zodResolver(calendarSchema),
    defaultValues: {
      name: calendar.name,
      color: calendar.color,
    },
  });

  useEffect(() => {
    form.reset(calendar);
  }, [calendar]);

  const handleSubmit = async (data: Omit<CalendarFormValues, "id">) => {
    try {
      const dataToSend = {
        ...data,
      };

      const response = await fetch(
        `http://localhost:8000/users/${calendar.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating profile:", errorData);

        // Check if errorData has a detail property to give more context
        const errorMessage = errorData.detail
          ? JSON.stringify(errorData.detail)
          : "Failed to update user profile";
        throw new Error(errorMessage);
      }
      const updatedCalendar = await response.json();
      onSave({ ...updatedCalendar, id: calendar.id });
      localStorage.setItem("User", JSON.stringify(updatedCalendar));
    } catch (error) {
      console.error(error);
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
          name='color'
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
        />
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
