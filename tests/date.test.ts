import { formatDate, parseDate } from "../src/utils/date";

describe("parseDate", () => {
  it("разбирает дату в формате дд.мм.гггг в начало дня", () => {
    expect(parseDate("19.01.2025")).toBe(new Date(2025, 0, 19).getTime());
  });

  it("игнорирует пробелы по краям", () => {
    expect(parseDate("  19.01.2025 ")).toBe(new Date(2025, 0, 19).getTime());
  });

  it("возвращает null для несуществующей даты", () => {
    expect(parseDate("31.02.2025")).toBeNull();
    expect(parseDate("00.01.2025")).toBeNull();
    expect(parseDate("01.13.2025")).toBeNull();
  });

  it("возвращает null для другого формата", () => {
    expect(parseDate("2025-01-19")).toBeNull();
    expect(parseDate("1.1.2025")).toBeNull();
    expect(parseDate("")).toBeNull();
  });

  it("совместима с formatDate", () => {
    const ts = new Date(2024, 1, 29).getTime();
    expect(parseDate(formatDate(ts))).toBe(ts);
  });
});
