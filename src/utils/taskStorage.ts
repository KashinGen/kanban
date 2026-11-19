import type { Task, TaskType } from "../types/task";

export const TASKS_STORAGE_KEY = "kanban:tasks";

const TASK_TYPES: readonly TaskType[] = ["todo", "in_progress", "review", "done"];

const isTask = (value: unknown): value is Task => {
  if (typeof value !== "object" || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === "number" &&
    typeof t.type === "string" &&
    TASK_TYPES.includes(t.type as TaskType) &&
    typeof t.startDay === "number" &&
    typeof t.endDay === "number" &&
    typeof t.text === "string"
  );
};

/**
 * Читает задачи из хранилища. Возвращает null, если задач нет
 * (ключ отсутствует, список пуст, данные повреждены или хранилище недоступно).
 */
export const loadTasks = (storage: Storage | undefined = globalThis.localStorage): Task[] | null => {
  try {
    const raw = storage?.getItem(TASKS_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(isTask)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const saveTasks = (
  tasks: Task[],
  storage: Storage | undefined = globalThis.localStorage,
): void => {
  try {
    storage?.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Хранилище недоступно (приватный режим, переполнение) — работаем только в памяти.
  }
};
