import React from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Flag,
  CheckSquare,
  Pen,
  Trash,
  X,
} from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";

type TaskDetailsPopoverProps = {
  task: Task;
  onDeleteTask: (task: Task) => Promise<void>;
  children: React.ReactNode;
};

export function TaskDetailsPopover({
  task,
  children,
  onDeleteTask,
}: TaskDetailsPopoverProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "in-progress":
        return "text-blue-500";
      case "todo":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='text-end space-x-1'>
          <Button variant='ghost' className='size-8 p-0'>
            <Pen size={16} />
          </Button>
          <Button
            variant='ghost'
            className='size-8 p-0'
            onClick={() => onDeleteTask(task)}>
            <Trash size={16} />
          </Button>
          <PopoverClose asChild>
            <Button variant='ghost' className='ml-4 size-8 p-0'>
              <X size={16} />
            </Button>
          </PopoverClose>
        </div>
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold'>{task.title}</h3>
          <p className='text-sm text-muted-foreground'>{task.description}</p>
          <div className='flex items-center space-x-2'>
            <Calendar className='h-4 w-4' />
            <span className='text-sm'>
              {format(task.start_date, "MMMM d, yyyy")}
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <Clock className='h-4 w-4' />
            <span className='text-sm'>
              {format(task.start_date, "h:mm a")} -{" "}
              {format(task.end_date, "h:mm a")}
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <Flag className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
            <span className='text-sm capitalize'>{task.priority} Priority</span>
          </div>
          <div className='flex items-center space-x-2'>
            <CheckSquare className={`h-4 w-4 ${getStatusColor(task.status)}`} />
            <span className='text-sm capitalize'>{task.status}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
