import type { Task, TaskType } from "../types/task";
import { moveTask } from "../utils/moveTask";

export type TasksAction =
  | { type: "delete"; id: Task["id"] }
  | { type: "update"; task: Task }
  | { type: "move"; id: Task["id"]; to: TaskType };

export const tasksReducer = (state: Task[], action: TasksAction): Task[] => {
  switch (action.type) {
    case "delete":
      return state.filter((task) => task.id !== action.id);
    case "update":
      return state.map((task) => (task.id === action.task.id ? action.task : task));
    case "move":
      return moveTask(state, action.id, action.to);
    default:
      return state;
  }
};
