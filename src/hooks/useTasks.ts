import { useCallback, useEffect, useState } from "react";
import type { Task } from "../types/task";
import initialTasks from "../data/tasks.json";
import { loadTasks, saveTasks } from "../utils/taskStorage";

const getInitialTasks = (): Task[] => loadTasks() ?? (initialTasks as Task[]);

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const deleteTask = useCallback((id: Task["id"]) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  return { tasks, deleteTask };
};
