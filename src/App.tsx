import React, { useMemo, useState } from "react";
import { Board } from "./components/Board/Board";
import { SearchField } from "./components/SearchField/SearchField";
import { useTasks } from "./hooks/useTasks";
import { filterTasks } from "./utils/filterTasks";
import styles from "./App.module.css";

export const App = () => {
  const { tasks, deleteTask, updateTask, moveTask } = useTasks();
  const [query, setQuery] = useState("");

  const visibleTasks = useMemo(() => filterTasks(tasks, query), [tasks, query]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your tasks</h1>
        <SearchField className={styles.search} value={query} onChange={setQuery} />
      </header>
      <main>
        <Board
          tasks={visibleTasks}
          onDelete={deleteTask}
          onUpdate={updateTask}
          onMove={moveTask}
        />
      </main>
    </div>
  );
};
