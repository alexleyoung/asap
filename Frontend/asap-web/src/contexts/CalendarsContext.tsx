"use client";
import { Calendar } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useEffect } from "react";

interface CalendarContextType {
  selectedCalendars: Calendar[];
  toggleCalendar: (calendar: Calendar) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCalendars, setSelectedCalendars] = useState<Calendar[]>([]);

  useEffect(() => {
    const storedCalendars = JSON.parse(
      localStorage.getItem("selectedCalendars") || "[]"
    );
    setSelectedCalendars(storedCalendars);
  }, []);

  // Save selected calendars to localStorage every time they change
  useEffect(() => {
    if (selectedCalendars.length > 0) {
      localStorage.setItem(
        "selectedCalendars",
        JSON.stringify(selectedCalendars)
      );
    }
  }, [selectedCalendars]);

  const toggleCalendar = (calendar: Calendar) => {
    setSelectedCalendars((prevCalendars) => {
      const isCalendarSelected = prevCalendars.some(
        (c) => c.id === calendar.id
      );
      const updatedCalendars = isCalendarSelected
        ? prevCalendars.filter((c) => c.id !== calendar.id) // Remove calendar if already selected
        : [...prevCalendars, calendar]; // Add calendar if not selected

      localStorage.setItem(
        "selectedCalendars",
        JSON.stringify(updatedCalendars)
      ); // Save to localStorage
      return updatedCalendars;
    });
  };

  useEffect(() => {
    console.log("selectedCalendars:", selectedCalendars);
  }, [selectedCalendars]);

  return (
    <CalendarContext.Provider value={{ selectedCalendars, toggleCalendar }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider"
    );
  }
  return context;
};
