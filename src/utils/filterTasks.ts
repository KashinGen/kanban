import type { Task } from "../types/task";
import { parseDate, startOfDay } from "./date";

export const filterTasks = (tasks: Task[], query: string): Task[] => {
  const q = query.trim();
  if (!q) return tasks;

  const date = parseDate(q);
  if (date !== null) {
    return tasks.filter(
      (task) => startOfDay(task.startDay) === date || startOfDay(task.endDay) === date,
    );
  }

  const needle = q.toLowerCase();
  return tasks.filter((task) => task.text.toLowerCase().includes(needle));
};
