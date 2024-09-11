import React from "react";
import { TaskCard } from "./TaskCard";

type PositionedTask = {
  item: Task;
  left: number;
  width: number;
};

type TaskRendererProps = {
  tasks: PositionedTask[];
  onTaskClick: (task: Task) => void;
  onTaskMouseEnter: () => void;
  onTaskMouseLeave: () => void;
  onDeleteTask: (task: Task) => Promise<void>;
};

export function TaskRenderer({
  tasks,
  onTaskClick,
  onTaskMouseEnter,
  onTaskMouseLeave,
  onDeleteTask,
}: TaskRendererProps) {
  return (
    <>
      {tasks.map(({ item: task, left, width }) => (
        <div
          key={task.id}
          className='absolute z-10 cursor-pointer'
          style={{
            top: `${
              ((task.start_date.getHours() * 60 +
                task.start_date.getMinutes()) /
                1440) *
              100
            }%`,
            height: `${
              ((task.end_date.getTime() - task.start_date.getTime()) /
                (24 * 60 * 60 * 1000)) *
              100
            }%`,
            left: `${left * 100}%`,
            width: `${width * 100}%`,
          }}
          onClick={() => onTaskClick(task)}
          onMouseEnter={onTaskMouseEnter}
          onMouseLeave={onTaskMouseLeave}>
          <TaskCard task={task} onDeleteTask={onDeleteTask} />
        </div>
      ))}
    </>
  );
}
