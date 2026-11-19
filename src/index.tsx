import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { TasksProvider } from "./state/TasksContext";
import "./styles/global.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

createRoot(container).render(
  <React.StrictMode>
    <TasksProvider>
      <App />
    </TasksProvider>
  </React.StrictMode>,
);
