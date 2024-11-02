"use client";

import React, { useState, useRef, useEffect } from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export default function DatePicker({ date, onDateChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(format(date, "EEEE, MMMM d"));
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      onDateChange(newDate);
      setInputValue(format(newDate, "EEEE, MMMM d"));
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const inputDate = parse(inputValue, "EEEE, MMMM d", new Date());
    if (inputDate && !isNaN(inputDate.getTime())) {
      handleDateSelect(inputDate);
    } else {
      setInputValue(format(date, "EEEE, MMMM d"));
    }
  };

  const handleInputFocus = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  useEffect(() => {
    setInputValue(format(date, "EEEE, MMMM d"));
  }, [date]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(handleInputFocus, 0);
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          onClick={() => setIsOpen(true)}>
          <CalendarIcon className='mr-2 h-4 w-4' />
          <input
            ref={inputRef}
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className='bg-transparent outline-none w-full cursor-pointer'
            readOnly
            aria-label='Date input'
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
