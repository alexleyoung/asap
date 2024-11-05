"use client";

import { useEffect, useState } from "react";

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
import { set } from "date-fns";
import { Calendar } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { fetchCalendars } from "@/lib/scheduleCrud";

export default function CalendarsCollapsible() {
  const [open, setOpen] = useState(true);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<number[]>([]);
  const [isAddingCalendar, setIsAddingCalendar] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState("");

  useEffect(() => {
    const loadCalendars = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("User")!);
        const response = await fetchCalendars(user.id);
        const data = await response.json();
        setCalendars(data);
      } catch (error) {
        console.error("Failed to fetch calendars:", error);
      }
    };
    loadCalendars();
  }, []);

  const handleBoxChange = (calendarId: number) => {
    setSelectedCalendars((prevSelected) => {
      if (prevSelected.includes(calendarId)) {
        return prevSelected.filter((id) => id !== calendarId);
      } else {
        return [...prevSelected, calendarId];
      }
    });
  };

  const handleAddCalendar = async () => {
    if (!newCalendarName) return;

    const newCalendar = { name: newCalendarName };

    try {
      const user = JSON.parse(localStorage.getItem("User")!);
      const response = await fetch(
        `http://localhost:8000/calendars/users/${user.id}/calendars`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ name: newCalendarName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add calendar");
      }

      const addedCalendar: Calendar = await response.json();
      console.log("Added calendar:", addedCalendar);
      setCalendars((prevCalendars) => [...prevCalendars, addedCalendar]);
      setNewCalendarName("");
      setIsAddingCalendar(false);
    } catch (error) {
      console.error("Failed to add calendar:", error);
    }
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <span className="font-semibold">Calendars</span>
          {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="w-[240px] mt-3 px-2 space-y-2">
        {calendars.map((calendar, i) => (
          <Label htmlFor={calendar.id.toString()} key={calendar.id}>
            <div className="flex gap-2 items-center w-full hover:bg-muted transition-colors p-2 rounded-md">
              <Checkbox
                id={calendar.id.toString()}
                checked={selectedCalendars.includes(calendar.id)}
                onChange={() => handleBoxChange(calendar.id)}
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
              <span>{calendar.name}</span>
            </div>
          </Label>
        ))}
        <Button
          variant="ghost"
          className="w-full flex items-center gap-2 mt-2"
          onClick={() => setIsAddingCalendar((prev) => !prev)}
        >
          <Plus className="text-gray-500" /> Add Calendar
        </Button>

        {/* New Calendar Input */}
        {isAddingCalendar && (
          <div className="flex gap-2 items-center mt-2">
            <Input
              placeholder="New Calendar Name"
              value={newCalendarName}
              onChange={(e) => setNewCalendarName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddCalendar} variant="default">
              Add
            </Button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
