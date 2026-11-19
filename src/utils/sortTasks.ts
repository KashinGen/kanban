import type { Task } from "../types/task";

export const sortTasks = (tasks: Task[]): Task[] =>
  [...tasks].sort((a, b) => a.startDay - b.startDay || a.id - b.id);
