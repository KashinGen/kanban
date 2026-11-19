import type { Task, TaskType } from "../types/task";
import { sortTasks } from "./sortTasks";

export const groupTasksByType = (tasks: Task[]): Record<TaskType, Task[]> => {
  const groups: Record<TaskType, Task[]> = {
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };
  sortTasks(tasks).forEach((task) => groups[task.type]?.push(task));
  return groups;
};
