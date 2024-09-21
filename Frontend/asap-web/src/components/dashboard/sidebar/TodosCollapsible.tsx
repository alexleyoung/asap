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

const asaps = [
  "Make CSE meeting announcement",
  "Finish Calc HW 4B",
  "Pre-register for eng career fair",
];

export default function TodosCollapsible() {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant='ghost' className='w-full justify-between'>
          <span className='font-semibold'>ASAPs</span>
          {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className='w-[240px] mt-3 px-2 space-y-2'>
        {asaps.map((asap) => (
          <Label htmlFor={asap} key={asap}>
            <div className='flex gap-2 items-center w-full hover:bg-muted transition-colors p-2 rounded-md truncate'>
              <Checkbox
                id={asap}
                className='data-[state=checked]:bg-blue-300 border-blue-300'
              />
              <span>{asap}</span>
            </div>
          </Label>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
