import {
  ScheduleItem as SI,
  ScheduleEvent as SE,
  ScheduleTask as ST,
  ViewType as VT,
  EventPost as EP,
  TaskPost as TP,
} from "@/lib/types";

declare global {
  type ScheduleItem = SI;
  type ScheduleEvent = SE;
  type ScheduleTask = ST;
  type ViewType = VT;
  type EventPost = EP;
  type TaskPost = TP;
}
