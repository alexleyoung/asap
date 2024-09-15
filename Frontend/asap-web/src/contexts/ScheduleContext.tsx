import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useReducer,
  useState,
} from "react";

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

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <ViewContext.Provider value={{ view, setView }}>
      <CurrentDateContext.Provider value={{ currentDate, setCurrentDate }}>
        {children}
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
