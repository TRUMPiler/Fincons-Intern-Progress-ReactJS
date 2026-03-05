import React, { createContext, useContext, useEffect, useState } from "react";
import { GetAllTasks, createTask as createTaskModel, UpdateTask as updateTaskModel, type Task } from "../models/Todo";

type TaskContextType = {
  tasks: Task[] | null;
  refresh: () => void;
  createOpen: boolean;
  setCreateOpen: (v: boolean) => void;
  editOpen: boolean;
  setEditOpen: (v: boolean) => void;
  selectedTask: Task | null;
  setSelectedTask: (t: Task | null) => void;
  createTask: (task: Task) => Task | null;
  updateTask: (task: Task) => Task | null;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[] | null>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const refresh = () => {
    const t = GetAllTasks();
    setTasks(t);
  };

  useEffect(() => {
    refresh();
  }, []);

  const createTask = (task: Task) => {
    const res = createTaskModel(task);
    refresh();
    return res;
  };

  const updateTask = (task: Task) => {
    const res = updateTaskModel(task);
    refresh();
    return res;
  };

  return (
    <TaskContext.Provider value={{ tasks, refresh, createOpen, setCreateOpen, editOpen, setEditOpen, selectedTask, setSelectedTask, createTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};
