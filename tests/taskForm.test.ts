import { applyFormValues, toFormValues, validateTaskForm } from "../src/utils/taskForm";
import type { Task } from "../src/types/task";

const task: Task = {
  id: 1,
  type: "todo",
  startDay: new Date(2025, 0, 19, 15, 30).getTime(),
  endDay: new Date(2025, 0, 30, 9, 0).getTime(),
  text: "Сделать тестовое для IP",
};

describe("validateTaskForm", () => {
  it("корректная форма — без ошибок", () => {
    expect(validateTaskForm(toFormValues(task))).toEqual({});
  });

  it("ошибка, если дата не в формате дд.мм.гггг", () => {
    const errors = validateTaskForm({ ...toFormValues(task), startDay: "2025-01-19" });
    expect(errors.startDay).toBeDefined();
  });

  it("ошибка, если окончание раньше начала", () => {
    const errors = validateTaskForm({
      ...toFormValues(task),
      startDay: "30.01.2025",
      endDay: "19.01.2025",
    });
    expect(errors.endDay).toBeDefined();
    expect(errors.startDay).toBeUndefined();
  });

  it("окончание в тот же день, что и начало, — допустимо", () => {
    const errors = validateTaskForm({
      ...toFormValues(task),
      startDay: "19.01.2025",
      endDay: "19.01.2025",
    });
    expect(errors).toEqual({});
  });

  it("ошибка, если описание пустое или из пробелов", () => {
    expect(validateTaskForm({ ...toFormValues(task), text: "   " }).text).toBeDefined();
  });
});

describe("applyFormValues", () => {
  it("сохраняет исходный timestamp, если дата не менялась", () => {
    const updated = applyFormValues(task, toFormValues(task));
    expect(updated.startDay).toBe(task.startDay);
    expect(updated.endDay).toBe(task.endDay);
  });

  it("ставит начало дня, если дату поменяли", () => {
    const updated = applyFormValues(task, { ...toFormValues(task), endDay: "01.02.2025" });
    expect(updated.endDay).toBe(new Date(2025, 1, 1).getTime());
  });

  it("обрезает пробелы в описании и не трогает id и статус", () => {
    const updated = applyFormValues(task, { ...toFormValues(task), text: "  Новое описание  " });
    expect(updated).toMatchObject({ id: task.id, type: task.type, text: "Новое описание" });
  });
});
