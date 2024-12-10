import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Task } from "@/lib/types"; // Import the Task type
import { EditTaskForm } from "../forms/EditTaskForm"; // Assuming this component exists

type EditTaskDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  taskData: Task | null;
};

export default function EditTaskDialog({
  isOpen,
  onClose,
  taskData,
}: EditTaskDialogProps) {
  if (!taskData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-7xl'>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Edit the details of the selected task.
          </DialogDescription>
        </DialogHeader>
        <EditTaskForm task={{ ...taskData }} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
