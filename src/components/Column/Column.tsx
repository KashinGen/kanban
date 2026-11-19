import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { Task, TaskType } from "../../types/task";
import { TaskCard } from "../TaskCard/TaskCard";
import styles from "./Column.module.css";

interface Props {
  type: TaskType;
  title: string;
  icon: string;
  tasks: Task[];
  draggedTask: Task | null;
  onDelete: (id: Task["id"]) => void;
  onUpdate: (task: Task) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onDrop: (id: Task["id"], type: TaskType) => void;
}

export const Column = ({
  type,
  title,
  icon,
  tasks,
  draggedTask,
  onDelete,
  onUpdate,
  onDragStart,
  onDragEnd,
  onDrop,
}: Props) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  /** Позиция удалённой карточки — куда вернуть фокус после перерисовки. */
  const focusIndexRef = useRef<number | null>(null);
  const [isDropTarget, setIsDropTarget] = useState(false);

  const canDrop = draggedTask !== null && draggedTask.type !== type;

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

    const buttons =
      sectionRef.current?.querySelectorAll<HTMLButtonElement>("[data-action='delete']");
    const target = buttons?.[Math.min(index, buttons.length - 1)];
    (target ?? titleRef.current)?.focus();
  }, [tasks]);

  useLayoutEffect(() => {
    if (!draggedTask) setIsDropTarget(false);
  }, [draggedTask]);

  const handleDragOver = (e: React.DragEvent) => {
    if (!canDrop) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!isDropTarget) setIsDropTarget(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsDropTarget(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(false);
    if (canDrop) onDrop(draggedTask.id, type);
  };

  return (
    <section
      ref={sectionRef}
      className={isDropTarget ? `${styles.column} ${styles.dropTarget}` : styles.column}
      aria-label={title}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className={styles.header}>
        <img className={styles.icon} src={icon} width={24} height={24} alt="" />
        <h2 ref={titleRef} className={styles.title} tabIndex={-1}>
          {title}
        </h2>
      </header>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isDragging={draggedTask?.id === task.id}
          onDelete={handleDelete}
          onUpdate={onUpdate}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </section>
  );
};
