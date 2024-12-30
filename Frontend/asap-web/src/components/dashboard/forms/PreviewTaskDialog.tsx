import React from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Pen, Trash, Tag, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PreviewTaskPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  taskData: Task | null;
  onEditTask: (task: Task | null) => void;
  onDeleteTask: (task: Task | null) => void;
}

export default function PreviewTaskDialog({
  isOpen,
  onClose,
  taskData,
  onEditTask,
  onDeleteTask,
}: PreviewTaskPopoverProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-xl space-y-4'>
        <DialogHeader>
          <div className='flex justify-end -mt-[.125rem] mr-4'>
            <Button variant='ghost' onClick={() => onEditTask(taskData)}>
              <Pen size={14} />
            </Button>
            <Button variant='ghost' onClick={() => onDeleteTask(taskData)}>
              <Trash size={14} className='text-red-500' />
            </Button>
          </div>
        </DialogHeader>
        <DialogTitle className='text-2xl flex gap-4 items-center'>
          <div className={`size-5 rounded-lg mt-1 bg-${taskData?.color}-500`} />
          {taskData?.title}
        </DialogTitle>
        <DialogDescription className='flex flex-col gap-4 text-base'>
          <div className='flex gap-4'>
            <Clock size={22} className='mt-1' />
            <div className='flex flex-col gap-1'>
              <span>
                {new Date(taskData?.start || "").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>
                {taskData?.start &&
                  new Date(taskData?.start).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                -
                {taskData?.end &&
                  new Date(taskData?.end).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
              </span>
            </div>
          </div>
          {taskData?.category && (
            <div className='flex gap-4 items-center'>
              <Tag size={22} className='mt-1' />
              <span>{taskData?.category}</span>
            </div>
          )}
          {taskData?.priority && (
            <div className='flex gap-4 items-center'>
              <Star size={22} className='mt-1' />
              <Badge>{taskData?.priority}</Badge>
            </div>
          )}
          {taskData?.difficulty && (
            <div className='flex gap-4 items-center'>
              <Star size={22} className='mt-1' />
              <Badge>{taskData?.difficulty}</Badge>
            </div>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
