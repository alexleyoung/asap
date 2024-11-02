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
  priority: string;
  auto: boolean;
  completed: boolean;
  difficulty: string;
  duration: number;
  flexible: boolean;
  userID: number;
  calendarID: number;
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
};

// Calendars
export type Calendar = {
  id: number;
  name: string;
  color: string;
};
