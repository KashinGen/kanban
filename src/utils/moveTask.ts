import type { Task, TaskType } from "../types/task";

export const moveTask = (tasks: Task[], id: Task["id"], type: TaskType): Task[] => {
  const task = tasks.find((t) => t.id === id);
  if (!task || task.type === type) return tasks;
  return tasks.map((t) => (t.id === id ? { ...t, type } : t));
};
