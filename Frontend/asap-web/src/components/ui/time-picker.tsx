"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  format,
  parse,
  addMinutes,
  setMinutes,
  setHours,
  setSeconds,
} from "date-fns";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface TimePickerProps {
  date: Date;
  onTimeChange: (date: Date) => void;
}

export default function TimePicker({ date, onTimeChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(format(date, "h:mma"));
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTimeSelect = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    setHours(newDate, hours);
    setMinutes(newDate, minutes);
    setSeconds(newDate, 0);
    onTimeChange(newDate);
    setInputValue(format(newDate, "h:mma"));
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const inputTime = parse(inputValue, "h:mma", new Date());
    if (inputTime && !isNaN(inputTime.getTime())) {
      handleTimeSelect(format(inputTime, "HH:mm"));
    } else {
      setInputValue(format(date, "h:mma"));
    }
  };

  const handleInputFocus = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  useEffect(() => {
    setInputValue(format(date, "h:mma"));
  }, [date]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(handleInputFocus, 0);
    }
  }, [isOpen]);

  const timeSlots = Array.from({ length: 96 }, (_, i) => {
    const minutes = i * 15;
    const time = addMinutes(setMinutes(setHours(new Date(), 0), 0), minutes);
    return format(time, "HH:mm");
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            "w-[120px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          onClick={() => setIsOpen(true)}>
          <Clock className='mr-2 h-4 w-4' />
          <input
            ref={inputRef}
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className='bg-transparent outline-none w-full cursor-pointer'
            readOnly
            aria-label='Time input'
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-48 p-0'>
        <Command>
          <CommandInput placeholder='Select time...' />
          <CommandList>
            <CommandEmpty>No time found.</CommandEmpty>
            <CommandGroup>
              {timeSlots.map((time) => (
                <CommandItem key={time} onSelect={() => handleTimeSelect(time)}>
                  {format(parse(time, "HH:mm", new Date()), "h:mm a")}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
