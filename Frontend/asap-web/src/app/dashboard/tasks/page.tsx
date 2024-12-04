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
import { Check, Clock, Pen, Trash } from "lucide-react";
import { deleteTask, getTasks, updateTask } from "@/lib/scheduleCrud";
import { useUser } from "@/contexts/UserContext";
import { useScheduleItems } from "@/contexts/ScheduleContext";
import { Checkbox } from "@/components/ui/checkbox";

export default function Tasks() {
  const { user } = useUser();
  const { tasks, setTasks } = useScheduleItems();

  React.useEffect(() => {
    (async () => {
      if (user) {
        const fetchedTasks = await getTasks(user.id);
        if (!fetchedTasks) {
          return;
        }
        setTasks(fetchedTasks);
      }
    })();
  }, [user, setTasks]);

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
                        console.log(task);
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
                      <Trash className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Mock data for initial rendering
const mockTasks: Task[] = [
  {
    id: 1,
    title: "Complete Project Proposal",
    description: "Write and submit the project proposal document",
    start: new Date("2024-02-20T09:00:00"),
    end: new Date("2024-02-20T11:00:00"),
    dueDate: new Date("2024-02-20T17:00:00"),
    category: "work",
    difficulty: "medium",
    duration: 120,
    frequency: "once",
    completed: false,
    priority: "high",
    auto: false,
    flexible: true,
    userID: 1,
    calendarID: 1,
  },
  {
    id: 2,
    title: "Review Code Changes",
    description: "Review and provide feedback on team's code changes",
    start: null,
    end: null,
    dueDate: new Date("2024-02-21T15:00:00"),
    category: "work",
    difficulty: "hard",
    duration: 60,
    frequency: "daily",
    completed: true,
    priority: "medium",
    auto: true,
    flexible: false,
    userID: 1,
    calendarID: 1,
  },
];

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
