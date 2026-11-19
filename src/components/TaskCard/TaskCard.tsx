import React, { memo, useEffect, useRef, useState } from "react";
import type { Task } from "../../types/task";
import { formatDate } from "../../utils/date";
import { isOverdue } from "../../utils/isOverdue";
import { useTasksActions } from "../../state/TasksContext";
import { useDragActions } from "../Board/DragContext";
import { TaskEditForm } from "../TaskEditForm/TaskEditForm";
import EditIcon from "../../assets/icons/edit.svg?react";
import TrashIcon from "../../assets/icons/trash.svg?react";
import styles from "./TaskCard.module.css";

interface Props {
  task: Task;
  isDragging: boolean;
  onDelete: (id: Task["id"]) => void;
}

export const TaskCard = memo(function TaskCard({ task, isDragging, onDelete }: Props) {
  const { updateTask } = useTasksActions();
  const { startDrag, endDrag } = useDragActions();

  const [isEditing, setIsEditing] = useState(false);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);

  const overdue = isOverdue(task);

  useEffect(() => {
    if (!isEditing && restoreFocusRef.current) {
      restoreFocusRef.current = false;
      editButtonRef.current?.focus();
    }
  }, [isEditing]);

  const closeEditor = () => {
    restoreFocusRef.current = true;
    setIsEditing(false);
  };

  const handleSave = (updated: Task) => {
    updateTask(updated);
    closeEditor();
  };

  const handleDelete = () => {
    if (window.confirm(`Удалить задачу «${task.text}»?`)) {
      onDelete(task.id);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", String(task.id));
    e.dataTransfer.effectAllowed = "move";
    startDrag(task);
  };

  const className = [
    styles.card,
    styles.editable,
    isEditing && styles.editing,
    isDragging && styles.dragging,
    overdue && styles.overdue,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={className}
      title={overdue && !isEditing ? "Задача просрочена" : undefined}
      draggable={!isEditing}
      onDragStart={isEditing ? undefined : handleDragStart}
      onDragEnd={endDrag}
    >
      {isEditing ? (
        <TaskEditForm task={task} onSave={handleSave} onCancel={closeEditor} />
      ) : (
        <>
          <div className={styles.actions}>
            <button
              ref={editButtonRef}
              type="button"
              className={`${styles.action} ${styles.edit}`}
              onClick={() => setIsEditing(true)}
              aria-label={`Редактировать задачу: ${task.text}`}
              title="Редактировать"
            >
              <EditIcon aria-hidden="true" />
            </button>

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
              <dd className={`${styles.value} ${styles.deadline}`}>{formatDate(task.endDay)}</dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.label}>Описание:</dt>
              <dd className={styles.value}>{task.text}</dd>
            </div>
          </dl>
        </>
      )}
    </article>
  );
});
