import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { TaskPost } from "@/types/event";
import React from "react";

interface TaskCardProps {
  task: TaskPost;
}

export function TaskCard({ task }: TaskCardProps) {
  const [selectedTask, setSelectedTask] = React.useState<TaskPost | null>(null);
  //when task is clicked, data is pulled to display in the card
  const handleClick = (task: TaskPost) => {
    setSelectedTask(task);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>THIS SHOULD BE TASK TITLE</CardTitle>
        <CardDescription>THIS SHOULD BE TASK DESCRIPTION</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>THIS SHOULD BE TASK DATE</CardDescription>
        <CardDescription>THIS SHOULD BE TASK LOCATION</CardDescription>
      </CardContent>
      <CardFooter>
        <button>THIS SHOULD BE EDIT BUTTON</button>
      </CardFooter>
    </Card>
  );
}

export default TaskCard;
