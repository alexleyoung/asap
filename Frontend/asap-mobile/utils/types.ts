export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  category: string;
  frequency: string;
  uid: string;
  cid: string;
  location: string;
};

export type Task = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  category: string;
  frequency: string;
  userID: number;
  calendarID: number;
  dueDate: Date;
  priority: string;
  difficulty: string;
  duration: number;
  flexible: boolean;
  auto: boolean;
  completed: boolean;
};

export type ViewType = 'day' | 'week' | 'month';

export type EventPost = {
  title: string;
  start: string;
  end: string;
  description: string;
  category: string;
  frequency: string;
  location: string;
  uid: string;
  cid: string;
};
export type TaskPost = {
  title: string;
  start: Date;
  end: Date;
  description: string;
  category: string;
  frequency: string;
  dueDate: Date;
  priority: string;
  difficulty: string;
  duration: number;
  flexible: boolean;
  auto: boolean;
  completed: boolean;
  userID: number;
  calendarID: number;
};
