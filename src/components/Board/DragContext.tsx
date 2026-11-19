import React, { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Task } from "../../types/task";

interface DragContextValue {
  draggedTask: Task | null;
  startDrag: (task: Task) => void;
  endDrag: () => void;
}

const DragContext = createContext<DragContextValue | null>(null);

export const DragProvider = ({ children }: { children: ReactNode }) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const value = useMemo<DragContextValue>(
    () => ({
      draggedTask,
      startDrag: setDraggedTask,
      endDrag: () => setDraggedTask(null),
    }),
    [draggedTask],
  );

  return <DragContext.Provider value={value}>{children}</DragContext.Provider>;
};

export const useDrag = (): DragContextValue => {
  const value = useContext(DragContext);
  if (value === null) throw new Error("useDrag must be used within DragProvider");
  return value;
};
