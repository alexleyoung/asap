import {
  ScheduleItem as SI,
  ViewType as VT,
  EventPost as EP,
  TaskPost as TP,
} from "@/lib/types";

declare global {
  type ScheduleItem = SI;
  type ViewType = VT;
  type EventPost = EP;
  type TaskPost = TP;
}
