import React, { useMemo } from "react";
import type { Task } from "../../types/task";
import { COLUMNS } from "../../constants/columns";
import { groupTasksByType } from "../../utils/groupTasks";
import { Column } from "../Column/Column";
import styles from "./Board.module.css";

interface Props {
  tasks: Task[];
  onDelete: (id: Task["id"]) => void;
}

export const Board = ({ tasks, onDelete }: Props) => {
  const byType = useMemo(() => groupTasksByType(tasks), [tasks]);

  return (
    <div className={styles.board}>
      {COLUMNS.map((column) => (
        <Column
          key={column.type}
          title={column.title}
          icon={column.icon}
          tasks={byType[column.type]}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
