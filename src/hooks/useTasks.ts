import { useState } from "react";
import type { Task } from "../types/task";
import initialTasks from "../data/tasks.json";

export const useTasks = () => {
  const [tasks] = useState<Task[]>(initialTasks as Task[]);

  return { tasks };
};
