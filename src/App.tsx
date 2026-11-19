import React from "react";
import { Board } from "./components/Board/Board";
import { useTasks } from "./hooks/useTasks";
import styles from "./App.module.css";

export const App = () => {
  const { tasks } = useTasks();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your tasks</h1>
      </header>
      <main>
        <Board tasks={tasks} />
      </main>
    </div>
  );
};
