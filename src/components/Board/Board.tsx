import React, { useCallback, useMemo, useState } from "react";
import type { Task, TaskType } from "../../types/task";
import { COLUMNS } from "../../constants/columns";
import { groupTasksByType } from "../../utils/groupTasks";
import { Column } from "../Column/Column";
import styles from "./Board.module.css";

interface Props {
  tasks: Task[];
  onDelete: (id: Task["id"]) => void;
  onUpdate: (task: Task) => void;
  onMove: (id: Task["id"], type: TaskType) => void;
}

export const Board = ({ tasks, onDelete, onUpdate, onMove }: Props) => {
  const byType = useMemo(() => groupTasksByType(tasks), [tasks]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragEnd = useCallback(() => setDraggedTask(null), []);

  const handleDrop = useCallback(
    (id: Task["id"], type: TaskType) => {
      onMove(id, type);
      setDraggedTask(null);
    },
    [onMove],
  );

  return (
    <div className={styles.board}>
      {COLUMNS.map((column) => (
        <Column
          key={column.type}
          type={column.type}
          title={column.title}
          icon={column.icon}
          tasks={byType[column.type]}
          draggedTask={draggedTask}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onDragStart={setDraggedTask}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
};
