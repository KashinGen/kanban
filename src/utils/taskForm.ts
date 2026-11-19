import type { Task } from "../types/task";
import { formatDate, parseDate } from "./date";

export interface TaskFormValues {
  startDay: string;
  endDay: string;
  text: string;
}

export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>;

const DATE_FORMAT_ERROR = "Введите дату в формате дд.мм.гггг";

export const toFormValues = (task: Task): TaskFormValues => ({
  startDay: formatDate(task.startDay),
  endDay: formatDate(task.endDay),
  text: task.text,
});

export const validateTaskForm = (values: TaskFormValues): TaskFormErrors => {
  const errors: TaskFormErrors = {};
  const start = parseDate(values.startDay);
  const end = parseDate(values.endDay);

  if (start === null) errors.startDay = DATE_FORMAT_ERROR;
  if (end === null) errors.endDay = DATE_FORMAT_ERROR;
  if (start !== null && end !== null && end < start) {
    errors.endDay = "Окончание не может быть раньше начала";
  }
  if (!values.text.trim()) errors.text = "Введите описание";

  return errors;
};

const applyDate = (original: number, value: string): number =>
  formatDate(original) === value.trim() ? original : (parseDate(value) ?? original);

export const applyFormValues = (task: Task, values: TaskFormValues): Task => ({
  ...task,
  startDay: applyDate(task.startDay, values.startDay),
  endDay: applyDate(task.endDay, values.endDay),
  text: values.text.trim(),
});
