import { format, differenceInMinutes } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatHour } from "@/lib/utils";
import { TaskDetailsPopover } from "./TaskDetailsPopover";

type TaskCardProps = {
  task: Task;
  onDeleteTask: (task: Task) => Promise<void>;
};

export function TaskCard({ task, onDeleteTask }: TaskCardProps) {
  const startMinutes = format(task.start_date, "mm");
  const endMinutes = format(task.end_date, "mm");
  const startTime = formatHour(
    Number(format(task.start_date, "HH")),
    Number(startMinutes)
  );
  const endTime = formatHour(
    Number(format(task.end_date, "HH")),
    Number(endMinutes)
  );
  const duration = differenceInMinutes(task.end_date, task.start_date);

  // Define a threshold for minimum duration to show time (e.g., 30 minutes)
  const MIN_DURATION_TO_SHOW_TIME = 30;

  const priorityColors = {
    low: "bg-green-200 text-green-800",
    medium: "bg-yellow-200 text-yellow-800",
    high: "bg-red-200 text-red-800",
  };

  const statusColors = {
    todo: "bg-gray-200 text-gray-800",
    "in-progress": "bg-blue-200 text-blue-800",
    completed: "bg-purple-200 text-purple-800",
  };

  return (
    <TaskDetailsPopover task={task} onDeleteTask={onDeleteTask}>
      <Card className='h-full z-50 shadow-sm border-l-4 border-l-highlight'>
        <CardContent className='p-2 h-full flex flex-col justify-between'>
          <div className='flex flex-col'>
            <h3 className='text-xs font-semibold truncate flex-grow'>
              {task.title}
            </h3>
            {duration >= MIN_DURATION_TO_SHOW_TIME && (
              <span className='text-[10px] text-muted-foreground'>
                {startTime} - {endTime}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </TaskDetailsPopover>
  );
}
