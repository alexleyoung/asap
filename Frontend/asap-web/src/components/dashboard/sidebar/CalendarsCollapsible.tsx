"use client";

import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const calendars = ["Personal", "CSE Officers", "CS Nerds"];

export default function CalendarsCollapsible() {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant='ghost' className='w-full justify-between'>
          <span className='font-semibold'>Calendars</span>
          {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className='w-[240px] mt-3 px-2 space-y-2'>
        {calendars.map((calendar, i) => (
          <Label htmlFor={calendar} key={i}>
            <div className='flex gap-2 items-center w-full hover:bg-muted transition-colors p-2 rounded-md'>
              <Checkbox
                id={calendar}
                className={cn(
                  "rounded-full",
                  i === 0
                    ? "data-[state=checked]:bg-blue-500 border-blue-500"
                    : i === 1
                    ? "data-[state=checked]:bg-green-500 border-green-500"
                    : "data-[state=checked]:bg-orange-500 border-orange-500"
                )}
                checkmark={false}
              />
              <span>{calendar}</span>
            </div>
          </Label>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
