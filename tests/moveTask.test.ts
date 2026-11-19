import { moveTask } from "../src/utils/moveTask";
import type { Task } from "../src/types/task";

const tasks: Task[] = [
  { id: 1, type: "todo", startDay: 1, endDay: 2, text: "Первая" },
  { id: 2, type: "in_progress", startDay: 3, endDay: 4, text: "Вторая" },
];

describe("moveTask", () => {
  it("меняет статус задачи и не трогает остальные поля", () => {
    const result = moveTask(tasks, 1, "review");
    expect(result[0]).toEqual({ ...tasks[0], type: "review" });
    expect(result[1]).toBe(tasks[1]);
  });

  it("не мутирует исходный массив", () => {
    moveTask(tasks, 1, "done");
    expect(tasks[0].type).toBe("todo");
  });

  it("возвращает тот же массив, если статус не меняется", () => {
    expect(moveTask(tasks, 2, "in_progress")).toBe(tasks);
  });

  it("возвращает тот же массив, если задачи с таким id нет", () => {
    expect(moveTask(tasks, 42, "done")).toBe(tasks);
  });
});
