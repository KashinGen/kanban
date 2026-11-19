import type { TaskType } from "../types/task";
import todoIcon from "../assets/icons/todo.svg";
import inProgressIcon from "../assets/icons/in-progress.svg";
import reviewIcon from "../assets/icons/review.svg";
import doneIcon from "../assets/icons/done.svg";

export interface ColumnConfig {
  type: TaskType;
  title: string;
  icon: string;
}

export const COLUMNS: ColumnConfig[] = [
  { type: "todo", title: "To Do", icon: todoIcon },
  { type: "in_progress", title: "In Progress", icon: inProgressIcon },
  { type: "review", title: "Review", icon: reviewIcon },
  { type: "done", title: "Done", icon: doneIcon },
];
