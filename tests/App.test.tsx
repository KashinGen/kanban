/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App";
import { TasksProvider } from "../src/state/TasksContext";
import type { Task } from "../src/types/task";
import { formatDate } from "../src/utils/date";
import { TASKS_STORAGE_KEY } from "../src/utils/taskStorage";

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

const TASKS: Task[] = [
  { id: 1, type: "todo", startDay: now - 10 * DAY, endDay: now - 5 * DAY, text: "Просроченная" },
  { id: 2, type: "todo", startDay: now - 20 * DAY, endDay: now + 5 * DAY, text: "Написать тесты" },
  { id: 3, type: "done", startDay: now - 30 * DAY, endDay: now - 25 * DAY, text: "Готовая" },
  { id: 4, type: "review", startDay: now - 2 * DAY, endDay: now + 2 * DAY, text: "Проверить PR" },
];

/** По умолчанию — фиксированный набор задач; `fromStorage` — как в проде (localStorage → json). */
const renderApp = ({ fromStorage = false } = {}) =>
  render(
    <TasksProvider initialTasks={fromStorage ? undefined : TASKS}>
      <App />
    </TasksProvider>,
  );

const column = (name: string) => screen.getByRole("region", { name });
const card = (text: string) => screen.getByText(text).closest("article") as HTMLElement;
const cardTexts = (columnName: string) =>
  within(column(columnName))
    .queryAllByRole("article")
    .map((el) => el.querySelectorAll("dd")[2]?.textContent);
const storedIds = () =>
  (JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY) ?? "[]") as Task[]).map((t) => t.id);

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

describe("доска", () => {
  it("раскладывает задачи по колонкам и сортирует по startDay", () => {
    renderApp();
    expect(cardTexts("To Do")).toEqual(["Написать тесты", "Просроченная"]);
    expect(cardTexts("In Progress")).toEqual([]);
    expect(cardTexts("Review")).toEqual(["Проверить PR"]);
    expect(cardTexts("Done")).toEqual(["Готовая"]);
  });

  it("подсвечивает просроченные задачи, кроме выполненных", () => {
    renderApp();
    expect(card("Просроченная")).toHaveClass("overdue");
    expect(card("Написать тесты")).not.toHaveClass("overdue");
    expect(card("Готовая")).not.toHaveClass("overdue");
  });
});

describe("удаление", () => {
  it("после подтверждения удаляет задачу, сохраняет список и переводит фокус", async () => {
    const user = userEvent.setup();
    jest.spyOn(window, "confirm").mockReturnValue(true);
    renderApp();

    await user.click(screen.getByRole("button", { name: "Удалить задачу: Написать тесты" }));

    expect(screen.queryByText("Написать тесты")).not.toBeInTheDocument();
    expect(storedIds()).toEqual([1, 3, 4]);
    expect(screen.getByRole("button", { name: "Удалить задачу: Просроченная" })).toHaveFocus();
  });

  it("при удалении последней карточки колонки фокус уходит на заголовок", async () => {
    const user = userEvent.setup();
    jest.spyOn(window, "confirm").mockReturnValue(true);
    renderApp();

    await user.click(screen.getByRole("button", { name: "Удалить задачу: Проверить PR" }));

    expect(within(column("Review")).getByRole("heading")).toHaveFocus();
  });

  it("при отмене подтверждения ничего не удаляет", async () => {
    const user = userEvent.setup();
    jest.spyOn(window, "confirm").mockReturnValue(false);
    renderApp();

    await user.click(screen.getByRole("button", { name: "Удалить задачу: Написать тесты" }));

    expect(screen.getByText("Написать тесты")).toBeInTheDocument();
    expect(storedIds()).toEqual([1, 2, 3, 4]);
  });
});

describe("редактирование", () => {
  it("сохраняет новое описание", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: "Редактировать задачу: Проверить PR" }));
    const input = screen.getByLabelText("Описание:");
    await user.clear(input);
    await user.type(input, "Смержить PR");
    await user.click(screen.getByRole("button", { name: "Сохранить изменения" }));

    expect(cardTexts("Review")).toEqual(["Смержить PR"]);
    expect(screen.getByRole("button", { name: "Редактировать задачу: Смержить PR" })).toHaveFocus();
  });

  it("не сохраняет, если окончание раньше начала", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: "Редактировать задачу: Проверить PR" }));
    const end = screen.getByLabelText("Окончание:");
    await user.clear(end);
    await user.type(end, "01.01.2000");
    await user.click(screen.getByRole("button", { name: "Сохранить изменения" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Окончание не может быть раньше начала");
    expect(screen.getByLabelText("Окончание:")).toBeInTheDocument();
  });

  it("Escape отменяет изменения", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: "Редактировать задачу: Проверить PR" }));
    await user.type(screen.getByLabelText("Описание:"), " и ещё");
    await user.keyboard("{Escape}");

    expect(cardTexts("Review")).toEqual(["Проверить PR"]);
  });
});

describe("поиск", () => {
  it("фильтрует по подстроке в описании без учёта регистра", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByRole("searchbox"), "ТЕСТ");

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Написать тесты")).toBeInTheDocument();
  });

  it("фильтрует по дате начала или окончания в формате дд.мм.гггг", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByRole("searchbox"), formatDate(TASKS[3].endDay));

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Проверить PR")).toBeInTheDocument();
  });
});

describe("drag & drop", () => {
  const dataTransfer = { setData: jest.fn(), effectAllowed: "", dropEffect: "" };

  it("переносит задачу в другую колонку и сохраняет статус", () => {
    renderApp();

    fireEvent.dragStart(card("Написать тесты"), { dataTransfer });
    fireEvent.dragOver(column("In Progress"), { dataTransfer });
    fireEvent.drop(column("In Progress"), { dataTransfer });

    expect(cardTexts("In Progress")).toEqual(["Написать тесты"]);
    expect(cardTexts("To Do")).toEqual(["Просроченная"]);
    const stored = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY) ?? "[]") as Task[];
    expect(stored.find((t) => t.id === 2)?.type).toBe("in_progress");
  });

  it("сброс в ту же колонку ничего не меняет", () => {
    renderApp();

    fireEvent.dragStart(card("Написать тесты"), { dataTransfer });
    fireEvent.drop(column("To Do"), { dataTransfer });

    expect(cardTexts("To Do")).toEqual(["Написать тесты", "Просроченная"]);
  });
});

describe("localStorage", () => {
  it("восстанавливает задачи из localStorage", () => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([TASKS[3]]));
    renderApp({ fromStorage: true });

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Проверить PR")).toBeInTheDocument();
  });

  it("если в localStorage пусто — показывает задачи из tasks.json", () => {
    renderApp({ fromStorage: true });

    expect(screen.getAllByRole("article").length).toBeGreaterThan(0);
    expect(screen.queryByText("Проверить PR")).not.toBeInTheDocument();
  });
});
