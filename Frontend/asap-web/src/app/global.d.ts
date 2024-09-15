declare type ScheduleItem = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
};

declare type ViewType = "day" | "week" | "month";
