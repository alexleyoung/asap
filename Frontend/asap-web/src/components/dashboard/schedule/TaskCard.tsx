import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "@/lib/types"; // Import the Task type

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  const handleDelete = () => {
    onDelete(task.id);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Due: {task.dueDate.toLocaleDateString()}
        </CardDescription>
        <CardDescription>Priority: {task.priority}</CardDescription>
        <CardDescription>Category: {task.category}</CardDescription>
        <CardDescription>
          Status: {task.completed ? "Completed" : "Pending"}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleEdit}>Edit</button>
      </CardFooter>
    </Card>
  );
}

export default TaskCard;
