/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App";
import { TasksProvider } from "../src/state/TasksContext";
import type { Task } from "../src/types/task";
import * as dateUtils from "../src/utils/date";

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();
const TASKS: Task[] = [
  { id: 1, type: "todo", startDay: now - 3 * DAY, endDay: now + DAY, text: "Первая" },
  { id: 2, type: "todo", startDay: now - 2 * DAY, endDay: now + DAY, text: "Вторая" },
  { id: 3, type: "todo", startDay: now - DAY, endDay: now + DAY, text: "Третья" },
  { id: 4, type: "review", startDay: now - DAY, endDay: now + DAY, text: "Четвёртая" },
];

const renderedCards = (spy: jest.SpyInstance) => spy.mock.calls.length / 2;

const setup = () => {
  render(
    <TasksProvider initialTasks={TASKS}>
      <App />
    </TasksProvider>,
  );
  const spy = jest.spyOn(dateUtils, "formatDate");
  return spy;
};

const card = (text: string) => screen.getByText(text).closest("article") as HTMLElement;
const dataTransfer = { setData: jest.fn(), effectAllowed: "", dropEffect: "" };

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

describe("лишние перерисовки карточек", () => {
  it("начало перетаскивания перерисовывает только перетаскиваемую карточку", () => {
    const spy = setup();

    fireEvent.dragStart(card("Вторая"), { dataTransfer });

    expect(renderedCards(spy)).toBe(1);
  });

  it("удаление карточки не перерисовывает остальные", async () => {
    const user = userEvent.setup();
    jest.spyOn(window, "confirm").mockReturnValue(true);
    const spy = setup();

    await user.click(screen.getByRole("button", { name: "Удалить задачу: Вторая" }));

    expect(renderedCards(spy)).toBe(0);
  });

  it("перенос в другую колонку перерисовывает только перенесённую карточку", () => {
    const spy = setup();

    fireEvent.dragStart(card("Вторая"), { dataTransfer });
    fireEvent.dragOver(screen.getByRole("region", { name: "Review" }), { dataTransfer });
    fireEvent.drop(screen.getByRole("region", { name: "Review" }), { dataTransfer });

    // dragStart (1) + монтирование в новой колонке (1)
    expect(renderedCards(spy)).toBe(2);
  });
});
