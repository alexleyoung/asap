import {
  ScheduleItem as SI,
  ViewType as VT,
  EventPost as EP,
} from "@/lib/types";

declare global {
  type ScheduleItem = SI;
  type ViewType = VT;
  type EventPost = EP;
}
