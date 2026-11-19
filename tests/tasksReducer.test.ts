import { tasksReducer } from "../src/state/tasksReducer";
import type { Task } from "../src/types/task";

const tasks: Task[] = [
  { id: 1, type: "todo", startDay: 1, endDay: 2, text: "a" },
  { id: 2, type: "review", startDay: 3, endDay: 4, text: "b" },
];

describe("tasksReducer", () => {
  it("delete удаляет задачу по id", () => {
    expect(tasksReducer(tasks, { type: "delete", id: 1 })).toEqual([tasks[1]]);
  });

  it("update заменяет задачу с тем же id", () => {
    const updated = { ...tasks[0], text: "new" };
    expect(tasksReducer(tasks, { type: "update", task: updated })).toEqual([updated, tasks[1]]);
  });

  it("move меняет статус задачи", () => {
    const next = tasksReducer(tasks, { type: "move", id: 1, to: "done" });
    expect(next[0].type).toBe("done");
  });

  it("возвращает тот же массив, если ничего не изменилось", () => {
    expect(tasksReducer(tasks, { type: "move", id: 2, to: "review" })).toBe(tasks);
  });

  it("не мутирует исходное состояние", () => {
    const copy = structuredClone(tasks);
    tasksReducer(tasks, { type: "delete", id: 1 });
    tasksReducer(tasks, { type: "move", id: 1, to: "done" });
    expect(tasks).toEqual(copy);
  });
});
