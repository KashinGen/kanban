import React from "react";
import type { Task } from "../../types/task";
import { formatDate } from "../../utils/date";
import { isOverdue } from "../../utils/isOverdue";
import styles from "./TaskCard.module.css";

interface Props {
  task: Task;
}

export const TaskCard = ({ task }: Props) => {
  const overdue = isOverdue(task);

  return (
    <article
      className={overdue ? `${styles.card} ${styles.overdue}` : styles.card}
      title={overdue ? "Задача просрочена" : undefined}
    >
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
