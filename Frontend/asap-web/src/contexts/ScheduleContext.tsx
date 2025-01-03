"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Event, Task } from "@/lib/types";

interface ViewContextType {
  view: string;
  setView: Dispatch<SetStateAction<string>>;
}
const ViewContext = createContext<ViewContextType | undefined>(undefined);

interface CurrentDateContextType {
  currentDate: Date;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
}
const CurrentDateContext = createContext<CurrentDateContextType | undefined>(
  undefined
);

interface ScheduleItemsContextType {
  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
}
const ScheduleItemsContext = createContext<
  ScheduleItemsContextType | undefined
>(undefined);

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <ViewContext.Provider value={{ view, setView }}>
      <CurrentDateContext.Provider value={{ currentDate, setCurrentDate }}>
        <ScheduleItemsContext.Provider
          value={{ events, setEvents, tasks, setTasks }}>
          {children}
        </ScheduleItemsContext.Provider>
      </CurrentDateContext.Provider>
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useView must be used within a ScheduleProvider");
  }
  return context;
}

export function useCurrentDate() {
  const context = useContext(CurrentDateContext);
  if (context === undefined) {
    throw new Error("useCurrentDate must be used within a ScheduleProvider");
  }
  return context;
}

export function useScheduleItems() {
  const context = useContext(ScheduleItemsContext);
  if (context === undefined) {
    throw new Error("useScheduleItems must be used within a ScheduleProvider");
  }
  return context;
}
