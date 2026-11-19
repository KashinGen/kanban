import { isOverdue } from "../src/utils/isOverdue";

const NOW = new Date(2024, 5, 15, 14, 30).getTime();
const day = (d: number, h = 12) => new Date(2024, 5, d, h).getTime();

describe("isOverdue", () => {
  it("дедлайн в прошлом — просрочена", () => {
    expect(isOverdue({ type: "todo", endDay: day(10) }, NOW)).toBe(true);
  });

  it("дедлайн вчера в 23:00 — просрочена", () => {
    expect(isOverdue({ type: "in_progress", endDay: day(14, 23) }, NOW)).toBe(true);
  });

  it("дедлайн сегодня (даже если время уже прошло) — не просрочена", () => {
    expect(isOverdue({ type: "review", endDay: day(15, 0) }, NOW)).toBe(false);
    expect(isOverdue({ type: "review", endDay: day(15, 9) }, NOW)).toBe(false);
  });

  it("дедлайн в будущем — не просрочена", () => {
    expect(isOverdue({ type: "todo", endDay: day(20) }, NOW)).toBe(false);
  });

  it("задача в статусе 'done' не бывает просроченной", () => {
    expect(isOverdue({ type: "done", endDay: day(1) }, NOW)).toBe(false);
  });

  it.each(["todo", "in_progress", "review"] as const)(
    "статус %s с прошедшим дедлайном — просрочена",
    (type) => {
      expect(isOverdue({ type, endDay: day(1) }, NOW)).toBe(true);
    },
  );

  it("по умолчанию сравнивает с текущей датой", () => {
    const DAY = 24 * 60 * 60 * 1000;
    expect(isOverdue({ type: "todo", endDay: Date.now() - 3 * DAY })).toBe(true);
    expect(isOverdue({ type: "todo", endDay: Date.now() + DAY })).toBe(false);
  });
});
