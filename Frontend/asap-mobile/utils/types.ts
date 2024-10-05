export interface ScheduleItem {
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
}

export interface ScheduleEvent extends ScheduleItem {
  location: string;
}

export interface ScheduleTask extends ScheduleItem {
  due: Date;
  priority: string;
  difficulty: string;
  duration: string;
  flexible: boolean;
  auto: boolean;
  completed: boolean;
}

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
