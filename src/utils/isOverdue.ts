import type { Task } from "../types/task";
import { startOfDay } from "./date";

export const isOverdue = (
  task: Pick<Task, "type" | "endDay">,
  now: number | Date = Date.now(),
): boolean => {
  if (task.type === "done") return false;
  return task.endDay < startOfDay(now);
};
