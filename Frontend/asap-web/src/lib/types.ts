export type ViewType = "day" | "week" | "month";

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  avatar: string;
};

// Events
export type Event = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  category: string;
  frequency: string;
  userID: number;
  calendarID: number;
  location: string;
  color: string;
};

export type EventPost = {
  title: string;
  start: Date;
  end: Date;
  description: string;
  category: string;
  frequency: string;
  location: string;
  userID: number;
  calendarID: number;
  color: string;
};

// Tasks
export type Task = {
  id: number;
  title: string;
  start: Date | null;
  end: Date | null;
  description: string;
  category: string;
  frequency: string;
  dueDate: Date;
  priority: "high" | "medium" | "low";
  auto: boolean;
  completed: boolean;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  flexible: boolean;
  userID: number;
  calendarID: number;
  color: string;
};

export type TaskPost = {
  title: string;
  description: string;
  start: Date | null;
  end: Date | null;
  dueDate: Date;
  category: string;
  difficulty: string;
  duration: number;
  frequency: string;
  completed: boolean;
  priority: string;
  auto: boolean;
  flexible: boolean;
  userID: number;
  calendarID: number;
  color: string;
};

// Calendars
export type Calendar = {
  id: number;
  name: string;
  description: string;
  timezone: string;
  userID: number;
};

export type CalendarPost = {
  name: string;
  description: string;
  timezone: string;
  userID: number;
};

// Groups
export type Group = {
  id: number;
  title: string;
  calendarID: number;
};

export type GroupPost = {
  title: string;
  calendarID: number;
};

// Membership
export type Membership = {
  id: number;
  groupID: number;
  userID: number;
  permission: "ADMIN" | "VIEWER" | "EDITOR";
};
