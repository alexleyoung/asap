"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useReducer,
  useState,
} from "react";
import { testScheduleItems } from "@/lib/consts";

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
  items: ScheduleItem[];
  setItems: Dispatch<SetStateAction<ScheduleItem[]>>;
}
const ScheduleItemsContext = createContext<
  ScheduleItemsContextType | undefined
>(undefined);

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [items, setItems] = useState<ScheduleItem[]>([]);

  return (
    <ViewContext.Provider value={{ view, setView }}>
      <CurrentDateContext.Provider value={{ currentDate, setCurrentDate }}>
        <ScheduleItemsContext.Provider value={{ items, setItems }}>
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
