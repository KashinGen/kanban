import React from "react";
import type { Task } from "../../types/task";
import { formatDate } from "../../utils/date";
import { isOverdue } from "../../utils/isOverdue";
import TrashIcon from "../../assets/icons/trash.svg?react";
import styles from "./TaskCard.module.css";

interface Props {
  task: Task;
  onDelete: (id: Task["id"]) => void;
}

export const TaskCard = ({ task, onDelete }: Props) => {
  const overdue = isOverdue(task);

  const handleDelete = () => {
    if (window.confirm(`Удалить задачу «${task.text}»?`)) {
      onDelete(task.id);
    }
  };

  return (
    <article
      className={overdue ? `${styles.card} ${styles.overdue}` : styles.card}
      title={overdue ? "Задача просрочена" : undefined}
    >
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.action} ${styles.delete}`}
          data-action="delete"
          onClick={handleDelete}
          aria-label={`Удалить задачу: ${task.text}`}
          title="Удалить"
        >
          <TrashIcon aria-hidden="true" />
        </button>
      </div>
      <dl className={styles.fields}>
        <div className={styles.row}>
          <dt className={styles.label}>Начало:</dt>
          <dd className={styles.value}>{formatDate(task.startDay)}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>Окончание:</dt>
          <dd className={`${styles.value} ${styles.deadline}`}>
            {formatDate(task.endDay)}
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>Описание:</dt>
          <dd className={styles.value}>{task.text}</dd>
        </div>
      </dl>
    </article>
  );
};
