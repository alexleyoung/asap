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
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  category: string;
  frequency: string;
  uid: string;
  cid: string;
  due: Date;
  priority: string;
  difficulty: string;
  duration: string;
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
