import React from "react";
import type { Task } from "../../types/task";
import { TaskCard } from "../TaskCard/TaskCard";
import styles from "./Column.module.css";

interface Props {
  title: string;
  icon: string;
  tasks: Task[];
}

export const Column = ({ title, icon, tasks }: Props) => (
  <section className={styles.column} aria-label={title}>
    <header className={styles.header}>
      <img className={styles.icon} src={icon} width={24} height={24} alt="" />
      <h2 className={styles.title}>{title}</h2>
    </header>
    {tasks.map((task) => (
      <TaskCard key={task.id} task={task} />
    ))}
  </section>
);
