import { addDays, setHours, setMinutes } from "date-fns";

const today = new Date();

export const testScheduleItems: ScheduleItem[] = [
  {
    id: "1",
    title: "Morning Meeting",
    start: setMinutes(setHours(today, 9), 0),
    end: setMinutes(setHours(today, 10), 30),
    color: "#3b82f6", // blue
  },
  {
    id: "2",
    title: "Lunch Break",
    start: setMinutes(setHours(today, 12), 0),
    end: setMinutes(setHours(today, 13), 0),
    color: "#10b981", // green
  },
  {
    id: "3",
    title: "Project Review",
    start: setMinutes(setHours(addDays(today, 1), 14), 0),
    end: setMinutes(setHours(addDays(today, 1), 16), 0),
    color: "#f59e0b", // yellow
  },
  {
    id: "4",
    title: "Team Building",
    start: setMinutes(setHours(addDays(today, 2), 15), 0),
    end: setMinutes(setHours(addDays(today, 2), 17), 0),
    color: "#ef4444", // red
  },
  {
    id: "5",
    title: "Client Call",
    start: setMinutes(setHours(addDays(today, 3), 11), 0),
    end: setMinutes(setHours(addDays(today, 3), 12), 0),
    color: "#8b5cf6", // purple
  },
  {
    id: "6",
    title: "Workshop",
    start: setMinutes(setHours(addDays(today, 4), 13), 0),
    end: setMinutes(setHours(addDays(today, 4), 17), 0),
    color: "#ec4899", // pink
  },
  {
    id: "7",
    title: "Brainstorming Session",
    start: setMinutes(setHours(addDays(today, 5), 10), 0),
    end: setMinutes(setHours(addDays(today, 5), 11), 30),
    color: "#14b8a6", // teal
  },
  {
    id: "8",
    title: "Product Demo",
    start: setMinutes(setHours(addDays(today, 6), 15), 0),
    end: setMinutes(setHours(addDays(today, 6), 16), 0),
    color: "#f97316", // orange
  },
  {
    id: "9",
    title: "Training Session",
    start: setMinutes(setHours(addDays(today, 7), 9), 0),
    end: setMinutes(setHours(addDays(today, 7), 12), 0),
    color: "#06b6d4", // cyan
  },
  {
    id: "10",
    title: "Code Review",
    start: setMinutes(setHours(addDays(today, 8), 14), 0),
    end: setMinutes(setHours(addDays(today, 8), 15), 30),
    color: "#84cc16", // lime
  },
  {
    id: "11",
    title: "All-Hands Meeting",
    start: setMinutes(setHours(addDays(today, 9), 16), 0),
    end: setMinutes(setHours(addDays(today, 9), 17), 0),
    color: "#a855f7", // fuchsia
  },
  {
    id: "12",
    title: "Planning Session",
    start: setMinutes(setHours(addDays(today, 10), 10), 0),
    end: setMinutes(setHours(addDays(today, 10), 12), 0),
    color: "#64748b", // slate
  },
];
