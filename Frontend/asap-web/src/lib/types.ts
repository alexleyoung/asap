export type ViewType = "day" | "week" | "month";

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
  start: string;
  end: string;
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
  start: Date;
  end: Date;
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
  auto: boolean;
  calendarID: number;
  category: string;
  description: string;
  difficulty: string;
  dueDate: Date;
  duration: number;
  flexible: boolean;
  frequency: string;
  completed: boolean;
  priority: string;
  title: string;
  userID: number;
};

// Calendars
export type Calendar = {
  id: number;
  name: string;
  color: string;
};
