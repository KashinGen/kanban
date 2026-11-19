import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import type { Task, TaskType } from "../types/task";
import initialTasksJson from "../data/tasks.json";
import { loadTasks, saveTasks } from "../utils/taskStorage";
import { tasksReducer } from "./tasksReducer";

export interface TasksActions {
  deleteTask: (id: Task["id"]) => void;
  updateTask: (task: Task) => void;
  moveTask: (id: Task["id"], to: TaskType) => void;
}

const TasksStateContext = createContext<Task[] | null>(null);
const TasksActionsContext = createContext<TasksActions | null>(null);

const getInitialTasks = (): Task[] => loadTasks() ?? (initialTasksJson as Task[]);

interface ProviderProps {
  children: ReactNode;
  initialTasks?: Task[];
}

export const TasksProvider = ({ children, initialTasks }: ProviderProps) => {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks,
    (preset) => preset ?? getInitialTasks(),
  );

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const actions = useMemo<TasksActions>(
    () => ({
      deleteTask: (id) => dispatch({ type: "delete", id }),
      updateTask: (task) => dispatch({ type: "update", task }),
      moveTask: (id, to) => dispatch({ type: "move", id, to }),
    }),
    [],
  );

  return (
    <TasksActionsContext.Provider value={actions}>
      <TasksStateContext.Provider value={tasks}>{children}</TasksStateContext.Provider>
    </TasksActionsContext.Provider>
  );
};

export const useTasksState = (): Task[] => {
  const tasks = useContext(TasksStateContext);
  if (tasks === null) throw new Error("useTasksState must be used within TasksProvider");
  return tasks;
};

export const useTasksActions = (): TasksActions => {
  const actions = useContext(TasksActionsContext);
  if (actions === null) throw new Error("useTasksActions must be used within TasksProvider");
  return actions;
};
