export type ScheduleItem = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
};

export type ViewType = "day" | "week" | "month";

export type EventPost = {
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
  user_id: string;
  calendar_id: string;
};
