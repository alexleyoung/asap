"use client";

import { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn, getColor } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { createCalendar, getCalendars } from "@/lib/scheduleCrud";
import { useCalendars } from "@/contexts/CalendarsContext";
import { useUser } from "@/contexts/UserContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogDescription } from "@radix-ui/react-dialog";

const colorClasses = {
  red: "rounded-full data-[state=checked]:bg-red-500 border-red-500",
  yellow: "rounded-full data-[state=checked]:bg-yellow-500 border-yellow-500",
  green: "rounded-full data-[state=checked]:bg-green-500 border-green-500",
  blue: "rounded-full data-[state=checked]:bg-blue-500 border-blue-500",
  purple: "rounded-full data-[state=checked]:bg-purple-500 border-purple-500",
  orange: "rounded-full data-[state=checked]:bg-orange-500 border-orange-500",
  lime: "rounded-full data-[state=checked]:bg-lime-500 border-lime-500",
  pink: "rounded-full data-[state=checked]:bg-pink-500 border-pink-500",
  indigo: "rounded-full data-[state=checked]:bg-indigo-500 border-indigo-500",
  cyan: "rounded-full data-[state=checked]:bg-cyan-500 border-cyan-500",
};

const formSchema = z.object({
  name: z.string().min(1, "Calendar name is required"),
  description: z.string(),
  timezone: z.string(),
  color: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CalendarsCollapsible() {
  const [open, setOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { selectedCalendars, calendars, setCalendars, toggleCalendar } =
    useCalendars();
  const { user } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      timezone: "UTC",
      color: "blue",
    },
  });

  useEffect(() => {
    if (!user) return;

    const fetchCalendars = async () => {
      try {
        const calendarArray = await getCalendars(user.id);
        setCalendars(calendarArray);
      } catch (error) {
        console.error("Error fetching calendars:", error);
      }
    };

    fetchCalendars();
  }, [user, setCalendars]);

  const onSubmit = async (data: FormValues) => {
    if (!user) return;

    try {
      const calendar = await createCalendar({
        ...data,
        userID: user.id,
      });
      setCalendars((prevCalendars) => [...prevCalendars, calendar]);
      setDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to add calendar:", error);
    }
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant='ghost' className='w-full justify-between'>
          <span className='font-semibold'>Calendars</span>
          {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className='w-[240px] mt-3 px-2 space-y-2'>
        {calendars.map((calendar) => {
          return (
            <Label htmlFor={calendar.id.toString()} key={calendar.id}>
              <div className='flex gap-2 items-center w-full hover:bg-muted transition-colors p-2 rounded-md'>
                <Checkbox
                  id={calendar.id.toString()}
                  checked={selectedCalendars.some((c) => c.id === calendar.id)}
                  onCheckedChange={() => toggleCalendar(calendar)}
                  className={
                    colorClasses[calendar.color as keyof typeof colorClasses] ||
                    colorClasses.blue
                  }
                />
                <span>{calendar.name}</span>
              </div>
            </Label>
          );
        })}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant='ghost'
              className='w-full flex items-center gap-2 mt-2'>
              <Plus className='text-gray-500' /> Add Calendar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Calendar</DialogTitle>
              <DialogDescription className='sr-only'>
                Add a new calendar to your schedule.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 mt-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Calendar name' {...field} />
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
                        <Input placeholder='Calendar description' {...field} />
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a color' />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex justify-end'>
                  <Button type='submit'>Create Calendar</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CollapsibleContent>
    </Collapsible>
  );
}
