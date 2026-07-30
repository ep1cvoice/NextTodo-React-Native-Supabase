import { createContext, useContext, useMemo, useState } from 'react';
import type { Task } from '@/types';
import { MOCK_TASKS } from '@/data/mockTasks';

interface TasksContextValue {
  tasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  deleteAllActive: () => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const activeTasks = useMemo(
    () => tasks.filter((t) => !t.done).sort((a, b) => a.sortOrder - b.sortOrder),
    [tasks]
  );

  const completedTasks = useMemo(
    () => tasks.filter((t) => t.done).sort((a, b) => a.sortOrder - b.sortOrder),
    [tasks]
  );

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const deleteAllActive = () => {
    setTasks((prev) => prev.filter((t) => t.done));
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        activeTasks,
        completedTasks,
        toggleTask,
        deleteTask,
        deleteAllActive,
      }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
}
