import { addDays, setHours, setMinutes } from "date-fns";

const today = new Date();

export const testScheduleItems: ScheduleItem[] = [
  {
    siid: "1",
    title: "Morning Meeting",
    start: setMinutes(setHours(today, 9), 0),
    end: setMinutes(setHours(today, 10), 30),
    description: "Daily morning meeting with the team.",
    category: "Meeting",
    frequency: "Daily",
    uid: "user-1",
    cid: "client-1",
    color: "#3b82f6", // blue
    location: "Conference Room 1",
  },
  {
    siid: "2",
    title: "Lunch Break",
    start: setMinutes(setHours(today, 12), 0),
    end: setMinutes(setHours(today, 13), 0),
    description: "Break time for lunch.",
    category: "Break",
    frequency: "Daily",
    uid: "user-1",
    cid: "client-1",
    color: "#10b981", // green
    location: "",
  },
  {
    siid: "3",
    title: "Project Review",
    start: setMinutes(setHours(addDays(today, 1), 14), 0),
    end: setMinutes(setHours(addDays(today, 1), 16), 0),
    description: "Review of the current project status.",
    category: "Meeting",
    frequency: "Weekly",
    uid: "user-2",
    cid: "client-2",
    color: "#f59e0b", // yellow
    location: "Meeting Room B",
  },
  {
    siid: "4",
    title: "Team Building",
    start: setMinutes(setHours(addDays(today, 2), 15), 0),
    end: setMinutes(setHours(addDays(today, 2), 17), 0),
    description: "Team building activities.",
    category: "Event",
    frequency: "Monthly",
    uid: "user-1",
    cid: "client-1",
    color: "#ef4444", // red
    location: "Outdoor Park",
  },
  {
    siid: "5",
    title: "Client Call",
    start: setMinutes(setHours(addDays(today, 3), 11), 0),
    end: setMinutes(setHours(addDays(today, 3), 12), 0),
    description: "Call with the client to discuss project details.",
    category: "Call",
    frequency: "Ad-hoc",
    uid: "user-2",
    cid: "client-2",
    color: "#8b5cf6", // purple
    location: "Zoom",
  },
  {
    siid: "6",
    title: "Workshop",
    start: setMinutes(setHours(addDays(today, 4), 13), 0),
    end: setMinutes(setHours(addDays(today, 4), 17), 0),
    description: "Workshop on new technologies.",
    category: "Training",
    frequency: "Quarterly",
    uid: "user-3",
    cid: "client-3",
    color: "#ec4899", // pink
    location: "Main Auditorium",
  },
  {
    siid: "7",
    title: "Brainstorming Session",
    start: setMinutes(setHours(addDays(today, 5), 10), 0),
    end: setMinutes(setHours(addDays(today, 5), 11), 30),
    description: "Collaborative brainstorming session.",
    category: "Meeting",
    frequency: "Weekly",
    uid: "user-1",
    cid: "client-1",
    color: "#14b8a6", // teal
    location: "Creative Room",
  },
  {
    siid: "8",
    title: "Product Demo",
    start: setMinutes(setHours(addDays(today, 6), 15), 0),
    end: setMinutes(setHours(addDays(today, 6), 16), 0),
    description: "Demo of the new product features.",
    category: "Demo",
    frequency: "One-time",
    uid: "user-2",
    cid: "client-2",
    color: "#f97316", // orange
    location: "Client Location",
  },
  {
    siid: "9",
    title: "Training Session",
    start: setMinutes(setHours(addDays(today, 7), 9), 0),
    end: setMinutes(setHours(addDays(today, 7), 10), 30),
    description: "Training session for new team members.",
    category: "Training",
    frequency: "Monthly",
    uid: "user-3",
    cid: "client-3",
    color: "#f44336", // red
    location: "Training Room",
  },
];
