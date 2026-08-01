import { createContext, useContext, useMemo, useState } from 'react';
import type { Category, Tag, Task } from '@/types';
import { MOCK_CATEGORIES, MOCK_TAGS, MOCK_TASKS } from '@/data/mockTasks';

export interface AddTaskInput {
  title: string;
  description: string;
  categoryId: number | null;
  tagIds: number[];
}

export type UpdateTaskInput = AddTaskInput;

interface TasksContextValue {
  tasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  categories: Category[];
  tags: Tag[];
  addTask: (input: AddTaskInput) => void;
  updateTask: (id: number, input: UpdateTaskInput) => void;
  setTaskScheduled: (id: number, scheduled: string | null) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  deleteAllActive: () => void;
  deleteAllCompleted: () => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const categories = MOCK_CATEGORIES;
  const tags = MOCK_TAGS;

  const activeTasks = useMemo(
    () => tasks.filter((t) => !t.done).sort((a, b) => a.sortOrder - b.sortOrder),
    [tasks]
  );

  const completedTasks = useMemo(
    () => tasks.filter((t) => t.done).sort((a, b) => a.sortOrder - b.sortOrder),
    [tasks]
  );

  const addTask = ({ title, description, categoryId, tagIds }: AddTaskInput) => {
    const category = categories.find((c) => c.id === categoryId) ?? null;
    const selectedTags = tags.filter((t) => tagIds.includes(t.id));
    const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    const minSort = activeTasks.length
      ? Math.min(...activeTasks.map((t) => t.sortOrder)) - 1
      : 0;

    const newTask: Task = {
      id: nextId,
      title: title.trim(),
      description: description.trim(),
      done: false,
      scheduled: null,
      created: new Date().toISOString(),
      categoryId,
      category,
      sortOrder: minSort,
      tags: selectedTags,
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: number, { title, description, categoryId, tagIds }: UpdateTaskInput) => {
    const category = categories.find((c) => c.id === categoryId) ?? null;
    const selectedTags = tags.filter((t) => tagIds.includes(t.id));

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: title.trim(),
              description: description.trim(),
              categoryId,
              category,
              tags: selectedTags,
            }
          : t
      )
    );
  };

  const setTaskScheduled = (id: number, scheduled: string | null) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, scheduled } : t)));
  };

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const deleteAllActive = () => {
    setTasks((prev) => prev.filter((t) => t.done));
  };

  const deleteAllCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.done));
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        activeTasks,
        completedTasks,
        categories,
        tags,
        addTask,
        updateTask,
        setTaskScheduled,
        toggleTask,
        deleteTask,
        deleteAllActive,
        deleteAllCompleted,
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
