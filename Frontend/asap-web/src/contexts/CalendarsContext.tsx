"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Calendar } from "@/lib/types";

// Define the context type
interface CalendarContextType {
  calendars: Calendar[];
  setCalendars: React.Dispatch<React.SetStateAction<Calendar[]>>;
  selectedCalendars: Calendar[];
  toggleCalendar: (calendar: Calendar) => void;
}

// Create the context
const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

// Provider component
export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<Calendar[]>([]);

  const toggleCalendar = (calendar: Calendar) => {
    setSelectedCalendars((prevCalendars) => {
      const isSelected = prevCalendars.some((c) => c.id === calendar.id);
      return isSelected
        ? prevCalendars.filter((c) => c.id !== calendar.id)
        : [...prevCalendars, calendar];
    });
  };

  return (
    <CalendarContext.Provider
      value={{
        calendars,
        setCalendars,
        selectedCalendars,
        toggleCalendar,
      }}>
      {children}
    </CalendarContext.Provider>
  );
};

// Custom hook for using the calendar context
export const useCalendars = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider"
    );
  }
  return context;
};
