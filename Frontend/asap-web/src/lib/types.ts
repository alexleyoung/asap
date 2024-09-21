export type ScheduleItem = {
  siid: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  catergory: string;
  frequency: string;
  uid: string;
  cid: string;
  color: string;
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
