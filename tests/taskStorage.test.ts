import { loadTasks, saveTasks, TASKS_STORAGE_KEY } from "../src/utils/taskStorage";
import type { Task } from "../src/types/task";

const createStorage = (): Storage => {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (i) => Array.from(data.keys())[i] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, String(value)),
  };
};

const task: Task = { id: 1, type: "todo", startDay: 1, endDay: 2, text: "a" };

describe("taskStorage", () => {
  it("возвращает null, если ключа нет в хранилище", () => {
    expect(loadTasks(createStorage())).toBeNull();
  });

  it("возвращает те же задачи, что были сохранены", () => {
    const storage = createStorage();
    saveTasks([task], storage);
    expect(loadTasks(storage)).toEqual([task]);
  });

  it("возвращает null для пустого списка", () => {
    const storage = createStorage();
    saveTasks([], storage);
    expect(loadTasks(storage)).toBeNull();
  });

  it("возвращает null для повреждённого JSON", () => {
    const storage = createStorage();
    storage.setItem(TASKS_STORAGE_KEY, "{not json");
    expect(loadTasks(storage)).toBeNull();
  });

  it("возвращает null, если у элементов неверная структура", () => {
    const storage = createStorage();
    storage.setItem(TASKS_STORAGE_KEY, JSON.stringify([{ id: "1" }]));
    expect(loadTasks(storage)).toBeNull();
  });

  it("возвращает null и не падает, если хранилище недоступно", () => {
    expect(loadTasks(undefined)).toBeNull();
    const throwing = {
      ...createStorage(),
      getItem: () => {
        throw new Error("denied");
      },
    };
    expect(loadTasks(throwing as Storage)).toBeNull();
    expect(() => saveTasks([task], undefined)).not.toThrow();
  });
});
