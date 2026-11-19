import { useCallback, useEffect, useState } from "react";
import type { Task, TaskType } from "../types/task";
import initialTasks from "../data/tasks.json";
import { loadTasks, saveTasks } from "../utils/taskStorage";
import { moveTask } from "../utils/moveTask";

const getInitialTasks = (): Task[] => loadTasks() ?? (initialTasks as Task[]);

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const deleteTask = useCallback((id: Task["id"]) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const updateTask = useCallback((updated: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updated.id ? updated : task)));
  }, []);

  const moveTaskTo = useCallback((id: Task["id"], type: TaskType) => {
    setTasks((prev) => moveTask(prev, id, type));
  }, []);

  return { tasks, deleteTask, updateTask, moveTask: moveTaskTo };
};
