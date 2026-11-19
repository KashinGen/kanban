import { filterTasks } from "../src/utils/filterTasks";
import type { Task } from "../src/types/task";

const at = (day: number, month: number, year: number, hour = 12) =>
  new Date(year, month - 1, day, hour).getTime();

const tasks: Task[] = [
  { id: 1, type: "todo", startDay: at(1, 3, 2025), endDay: at(5, 3, 2025), text: "Сверстать шапку" },
  { id: 2, type: "done", startDay: at(5, 3, 2025, 23), endDay: at(9, 3, 2025), text: "Написать тесты" },
  { id: 3, type: "review", startDay: at(10, 3, 2025), endDay: at(12, 3, 2025), text: "Ревью ШАПКИ" },
];

const ids = (list: Task[]) => list.map((task) => task.id);

describe("filterTasks", () => {
  it("пустой запрос возвращает все задачи", () => {
    expect(filterTasks(tasks, "")).toBe(tasks);
    expect(filterTasks(tasks, "   ")).toBe(tasks);
  });

  it("ищет подстроку в описании без учёта регистра", () => {
    expect(ids(filterTasks(tasks, "шапк"))).toEqual([1, 3]);
    expect(ids(filterTasks(tasks, "ТЕСТЫ"))).toEqual([2]);
  });

  it("игнорирует пробелы по краям запроса", () => {
    expect(ids(filterTasks(tasks, "  тесты  "))).toEqual([2]);
  });

  it("по дате дд.мм.гггг находит задачи, у которых совпадает начало или окончание", () => {
    expect(ids(filterTasks(tasks, "05.03.2025"))).toEqual([1, 2]);
    expect(ids(filterTasks(tasks, "12.03.2025"))).toEqual([3]);
  });

  it("сравнивает по дню, а не по точному времени", () => {
    expect(ids(filterTasks(tasks, "09.03.2025"))).toEqual([2]);
  });

  it("дата без совпадений даёт пустой список", () => {
    expect(filterTasks(tasks, "01.01.2030")).toEqual([]);
  });

  it("несуществующая дата ищется как обычный текст", () => {
    expect(filterTasks(tasks, "31.02.2025")).toEqual([]);
  });
});
