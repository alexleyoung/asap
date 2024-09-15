"use client";

import { useCurrentDate, useView } from "@/contexts/ScheduleContext";
import { addDays, addMonths, format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Header() {
  const { view, setView } = useView();
  const { currentDate, setCurrentDate } = useCurrentDate();

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
  };

  const handleDateChange = (direction: "prev" | "next") => {
    if (view === "day") {
      setCurrentDate((prevDate) =>
        addDays(prevDate, direction === "prev" ? -1 : 1)
      );
    } else if (view === "week") {
      setCurrentDate((prevDate) =>
        addDays(prevDate, direction === "prev" ? -7 : 7)
      );
    } else {
      setCurrentDate((prevDate) =>
        addMonths(prevDate, direction === "prev" ? -1 : 1)
      );
    }
  };

  return (
    <header className='px-5 py-3 border-b border-border flex items-center justify-between'>
      <h1 className='text-2xl font-bold'>asap.</h1>
      <div className='flex justify-between items-center gap-4'>
        <div className='flex gap-4 items-center'>
          <ChevronLeft
            size={32}
            className='rounded-full hover:bg-muted p-1 transition-colors'
            onClick={() => handleDateChange("prev")}
          />
          <ChevronRight
            size={32}
            className='rounded-full hover:bg-muted p-1 transition-colors'
            onClick={() => handleDateChange("next")}
          />
          <Button variant='outline' onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <h2 className='font-medium text-xl'>
            {view === "day"
              ? format(currentDate, "MMMM d, yyyy")
              : format(currentDate, "MMMM yyyy")}
          </h2>
        </div>
        <div className='flex gap-2'>
          <Select value={view} onValueChange={handleViewChange}>
            <SelectTrigger>
              <SelectValue placeholder='View' className='text-sm' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='day'>Day</SelectItem>
              <SelectItem value='week'>Week</SelectItem>
              <SelectItem value='month'>Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='flex gap-4 items-center'>
        <Popover>
          <PopoverTrigger>
            <Avatar className='hover:cursor-pointer relative group'>
              <div className='absolute size-12 rounded-full bg-black opacity-0 group-hover:opacity-20 transition-all' />
              <AvatarImage
                src='https://github.com/alexleyoung.png'
                alt='@alexleyoung'
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent sideOffset={5} className='mr-4 flex flex-col gap-4'>
            <h3>settings</h3>
            <h3>settings</h3>
            <h3>settings</h3>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
