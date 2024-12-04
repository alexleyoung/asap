"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Archive, Pen } from "lucide-react";
import { deleteTask, getTasks, updateTask } from "@/lib/scheduleCrud";
import { useUser } from "@/contexts/UserContext";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditTaskForm } from "@/components/dashboard/forms/EditTaskForm";
import { Pagination } from "@/components/dashboard/pagination/Pagination";

export default function Tasks() {
  const { user } = useUser();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    (async () => {
      if (user) {
        const fetchedTasks = await getTasks(
          user.id,
          itemsPerPage,
          (currentPage - 1) * itemsPerPage
        );
        if (!fetchedTasks) {
          return;
        }
        setTasks(fetchedTasks.tasks);
        setTotalPages(Math.ceil(fetchedTasks.total / itemsPerPage));
      }
    })();
  }, [user, currentPage]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Tasks</h1>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className='w-[100px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => {
                      updateTask({
                        ...task,
                        completed: checked ? true : false,
                      });
                      setTasks(
                        tasks.map((t) =>
                          t.id === task.id
                            ? { ...t, completed: checked ? true : false }
                            : t
                        )
                      );
                    }}
                  />
                </TableCell>
                <TableCell className='font-medium'>{task.title}</TableCell>
                <TableCell>
                  {format(task.dueDate, "MMM d, yyyy h:mm a")}
                </TableCell>
                <TableCell>{task.duration} min</TableCell>
                <TableCell>
                  <Badge
                    variant='secondary'
                    className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant='secondary'
                    className={getDifficultyColor(task.difficulty)}>
                    {task.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant='outline' className='capitalize'>
                    {task.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => {
                        setSelectedTask(task);
                        setDialogOpen(true);
                      }}>
                      <Pen className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => {
                        deleteTask(task);
                        setTasks(tasks.filter((t) => t.id !== task.id));
                      }}>
                      <span className='sr-only'>Archive</span>
                      <Archive className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription className='sr-only'>
              Edit task form
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <EditTaskForm
              task={selectedTask}
              onSuccess={() => setDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className='mt-4'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "low":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "hard":
      return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
    case "medium":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "easy":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
}
