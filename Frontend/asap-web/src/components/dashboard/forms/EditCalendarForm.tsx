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
import { Calendar } from "@/lib/types";
import { updateCalendar } from "@/lib/scheduleCrud";
import { getColor } from "@/lib/utils";

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Calendar name is required"),
  description: z.string(),
  timezone: z.string(),
  color: z.string(),
  userID: z.number(),
});

type CalendarFormValues = z.infer<typeof formSchema>;

interface EditCalendarFormProps {
  calendar: Calendar;
  onSave: (arg0: Calendar) => void;
}

export const EditCalendarForm = ({
  calendar,
  onSave,
}: EditCalendarFormProps) => {
  const form = useForm<CalendarFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: calendar.id,
      name: calendar.name,
      description: calendar.description,
      color: calendar.color,
      timezone: calendar.timezone,
      userID: calendar.userID,
    },
  });

  const handleSubmit = async (values: CalendarFormValues) => {
    try {
      // if(membership.permissions !== "ADMIN") {
      //   toast({
      //     title: "Error",
      //     description: "You do not have permission to edit calendar",
      //     duration: 3000,
      //   });
      //   return;
      // }
      const updatedCalendar = await updateCalendar(values);
      if (!updatedCalendar) return;
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
        <FormField
          control={form.control}
          name='color'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calendar Color</FormLabel>
              <FormControl>
                <div className='flex gap-2'>
                  {[
                    "red",
                    "yellow",
                    "green",
                    "blue",
                    "purple",
                    "orange",
                    "lime",
                    "pink",
                    "indigo",
                    "cyan",
                  ].map((color) => (
                    <button
                      key={color}
                      type='button'
                      onClick={() => field.onChange(color)}
                      className={`w-8 h-8 rounded-full bg-${color}-500 ${
                        field.value === color
                          ? `ring-2 ring-offset-2 ring-${color}-500`
                          : ""
                      }`}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
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
