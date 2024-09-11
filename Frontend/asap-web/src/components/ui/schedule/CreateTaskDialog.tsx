import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskCreationForm, { formSchema } from "./TaskCreationForm";

type CreateTaskDialogProps = {
  user: PubUser;
  onSubmit: (task: z.infer<typeof formSchema>) => void;
  isTaskDialogOpen: boolean;
  setIsTaskDialogOpen: (isOpen: boolean) => void;
};

export default function CreateTaskDialog({
  user,
  onSubmit,
  isTaskDialogOpen,
  setIsTaskDialogOpen,
}: CreateTaskDialogProps) {
  return (
    <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>
          <Plus className='mr-2 h-4 w-4' />
          New Task (T)
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[800px]'>
        <DialogTitle>Create a new task</DialogTitle>
        <DialogDescription>Fill in the task details</DialogDescription>
        <TaskCreationForm user={user!} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
