import React, { useMemo } from "react";
import type { Task } from "../../types/task";
import { COLUMNS } from "../../constants/columns";
import { groupTasksByType } from "../../utils/groupTasks";
import { Column } from "../Column/Column";
import { DragProvider } from "./DragContext";
import styles from "./Board.module.css";

interface Props {
  tasks: Task[];
}

export const Board = ({ tasks }: Props) => {
  const byType = useMemo(() => groupTasksByType(tasks), [tasks]);

  return (
    <DragProvider>
      <div className={styles.board}>
        {COLUMNS.map((column) => (
          <Column
            key={column.type}
            type={column.type}
            title={column.title}
            icon={column.icon}
            tasks={byType[column.type]}
          />
        ))}
      </div>
    </DragProvider>
  );
};
