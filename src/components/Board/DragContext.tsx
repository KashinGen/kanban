import React, { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Task } from "../../types/task";

interface DragActions {
  startDrag: (task: Task) => void;
  endDrag: () => void;
}

const DraggedTaskContext = createContext<Task | null | undefined>(undefined);
const DragActionsContext = createContext<DragActions | null>(null);

export const DragProvider = ({ children }: { children: ReactNode }) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const actions = useMemo<DragActions>(
    () => ({
      startDrag: setDraggedTask,
      endDrag: () => setDraggedTask(null),
    }),
    [],
  );

  return (
    <DragActionsContext.Provider value={actions}>
      <DraggedTaskContext.Provider value={draggedTask}>{children}</DraggedTaskContext.Provider>
    </DragActionsContext.Provider>
  );
};

export const useDraggedTask = (): Task | null => {
  const task = useContext(DraggedTaskContext);
  if (task === undefined) throw new Error("useDraggedTask must be used within DragProvider");
  return task;
};

export const useDragActions = (): DragActions => {
  const actions = useContext(DragActionsContext);
  if (actions === null) throw new Error("useDragActions must be used within DragProvider");
  return actions;
};
