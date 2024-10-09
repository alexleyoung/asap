export type ScheduleItem = {
  siid: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  category: string;
  frequency: string;
  uid: string;
  cid: string;
  color: string;
} & (ScheduleEvent | ScheduleTask);

export type ScheduleEvent = {
  location: string;
};

export type ScheduleTask = {
  due: Date;
  priority: string;
  difficulty: string;
  duration: string;
  flexible: boolean;
  auto: boolean;
};

export type ViewType = "day" | "week" | "month";

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
  start: string;
  end: string;
  description: string;
  category: string;
  frequency: string;
  due: string;
  priority: string;
  difficulty: string;
  duration: string;
  flexible: string;
  auto: boolean;
  uid: string;
  cid: string;
};
export type EventFormData = {
  title: string;
  start: Date;
  end: Date;
  description: string;
  category: string;
  frequency: string;
  location: string;
  uid: number;
  calendarID: number;
};
