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
import { useCalendarContext } from "@/contexts/CalendarsContext";

export default function CalendarsCollapsible() {
  const [open, setOpen] = useState(true);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const { selectedCalendars, toggleCalendar } = useCalendarContext();
  const [isAddingCalendar, setIsAddingCalendar] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState("");

  useEffect(() => {
    const loadCalendars = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("User")!);
        const response = await fetchCalendars(user.id);
        console.log("response:", response);
        setCalendars(response);
      } catch (error) {
        console.error("Failed to fetch calendars:", error);
      }
    };
    loadCalendars();
  }, [calendars]);

  const handleBoxChange = (calendar: Calendar) => {
    toggleCalendar(calendar);
  };

  const handleAddCalendar = async () => {
    if (!newCalendarName) return;

    const newCalendar = {
      name: newCalendarName,
      description: "",
      timezone: "UTC",
    };

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
          body: JSON.stringify({
            name: newCalendarName,
            description: "",
            timezone: "UTC",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add calendar");
      }

      const addedCalendar = await response.json();
      const mergedCalendar = {
        ...newCalendar,
        id: addedCalendar.id,
        color: "blue",
      };

      setCalendars((prevCalendars) => [...prevCalendars, mergedCalendar]);
      console.log("calendars:", calendars);
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
                checked={selectedCalendars.some((c) => c.id === calendar.id)}
                onCheckedChange={() => handleBoxChange(calendar)}
                className={cn(
                  "rounded-full",
                  i === 0
                    ? "data-[state=checked]:bg-blue-500 border-blue-500"
                    : i === 1
                    ? "data-[state=checked]:bg-green-500 border-green-500"
                    : "data-[state=checked]:bg-orange-500 border-orange-500"
                )}
                // checkmark={false}
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
