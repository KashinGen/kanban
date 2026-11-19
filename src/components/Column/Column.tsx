import React, { useCallback, useLayoutEffect, useRef } from "react";
import type { Task } from "../../types/task";
import { TaskCard } from "../TaskCard/TaskCard";
import styles from "./Column.module.css";

interface Props {
  title: string;
  icon: string;
  tasks: Task[];
  onDelete: (id: Task["id"]) => void;
  onUpdate: (task: Task) => void;
}

export const Column = ({ title, icon, tasks, onDelete, onUpdate }: Props) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  /** Позиция удалённой карточки — куда вернуть фокус после перерисовки. */
  const focusIndexRef = useRef<number | null>(null);

  const handleDelete = useCallback(
    (id: Task["id"]) => {
      focusIndexRef.current = tasks.findIndex((task) => task.id === id);
      onDelete(id);
    },
    [tasks, onDelete],
  );

  useLayoutEffect(() => {
    const index = focusIndexRef.current;
    if (index === null) return;
    focusIndexRef.current = null;

    const buttons = sectionRef.current?.querySelectorAll<HTMLButtonElement>(
      "[data-action='delete']",
    );
    const target = buttons?.[Math.min(index, buttons.length - 1)];
    (target ?? titleRef.current)?.focus();
  }, [tasks]);

  return (
    <section ref={sectionRef} className={styles.column} aria-label={title}>
      <header className={styles.header}>
        <img className={styles.icon} src={icon} width={24} height={24} alt="" />
        <h2 ref={titleRef} className={styles.title} tabIndex={-1}>
          {title}
        </h2>
      </header>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={handleDelete} onUpdate={onUpdate} />
      ))}
    </section>
  );
};
