import { createContext, useContext, useMemo, useState } from 'react';
import type { Category, CategoryIcon, Tag, Task } from '@/types';
import { MOCK_CATEGORIES, MOCK_TAGS, MOCK_TASKS } from '@/data/mockTasks';

export interface AddTaskInput {
  title: string;
  description: string;
  categoryId: number | null;
  tagIds: number[];
}

export type UpdateTaskInput = AddTaskInput;

export interface AddCategoryInput {
  name: string;
  color: string;
  icon: CategoryIcon | string;
}

export interface AddTagInput {
  name: string;
  color: string;
}

interface TasksContextValue {
  tasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  categories: Category[];
  tags: Tag[];
  addTask: (input: AddTaskInput) => void;
  updateTask: (id: number, input: UpdateTaskInput) => void;
  setTaskScheduled: (id: number, scheduled: string | null) => void;
  addCategory: (input: AddCategoryInput) => Category;
  addTag: (input: AddTagInput) => Tag;
  deleteCategory: (id: number) => void;
  deleteTag: (id: number) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  deleteAllActive: () => void;
  deleteAllCompleted: () => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [tags, setTags] = useState<Tag[]>(MOCK_TAGS);

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

  const addCategory = ({ name, color, icon }: AddCategoryInput): Category => {
    const nextId = categories.reduce((max, c) => Math.max(max, c.id), 0) + 1;
    const category: Category = {
      id: nextId,
      name: name.trim(),
      color,
      icon,
    };
    setCategories((prev) => [...prev, category]);
    return category;
  };

  const addTag = ({ name, color }: AddTagInput): Tag => {
    const nextId = tags.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    const tag: Tag = {
      id: nextId,
      name: name.trim(),
      color,
    };
    setTags((prev) => [...prev, tag]);
    return tag;
  };

  const deleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setTasks((prev) =>
      prev.map((t) =>
        t.categoryId === id ? { ...t, categoryId: null, category: null } : t
      )
    );
  };

  const deleteTag = (id: number) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        tags: (t.tags ?? []).filter((tag) => tag.id !== id),
      }))
    );
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
        addCategory,
        addTag,
        deleteCategory,
        deleteTag,
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
