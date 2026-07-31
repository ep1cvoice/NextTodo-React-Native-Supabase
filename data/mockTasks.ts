import type { Category, Tag, Task } from '@/types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Work', color: '#3b82f6', icon: 'Briefcase' },
  { id: 2, name: 'Personal', color: '#ec4899', icon: 'Heart' },
  { id: 3, name: 'Learning', color: '#8b5cf6', icon: 'Book' },
];

export const MOCK_TAGS: Tag[] = [
  { id: 1, name: 'urgent', color: '#ef4444' },
  { id: 2, name: 'design', color: '#0d9488' },
  { id: 3, name: 'backend', color: '#64748b' },
];

const today = new Date();
today.setHours(12, 0, 0, 0);

const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: 'Test',
    description:
      'Test123',
    done: false,
    scheduled: today.toISOString(),
    created: today.toISOString(),
    categoryId: 1,
    category: MOCK_CATEGORIES[0],
    sortOrder: 0,
    tags: [MOCK_TAGS[0], MOCK_TAGS[1]],
  },
  {
    id: 2,
    title: 'Buy groceries',
    description: 'Milk,eggs, bread, coffee.',
    done: false,
    scheduled: tomorrow.toISOString(),
    created: today.toISOString(),
    categoryId: 2,
    category: MOCK_CATEGORIES[1],
    sortOrder: 1,
    tags: [],
  },
  {
    id: 3,
    title: '12345',
    description: '',
    done: false,
    scheduled: yesterday.toISOString(),
    created: today.toISOString(),
    categoryId: 3,
    category: MOCK_CATEGORIES[2],
    sortOrder: 2,
    tags: [MOCK_TAGS[2]],
  },
  {
    id: 4,
    title: 'Note',
    description: '987654321',
    done: false,
    scheduled: null,
    created: today.toISOString(),
    categoryId: null,
    category: null,
    sortOrder: 3,
    tags: [],
  },
  {
    id: 5,
    title: 'Already finished example',
    description: 'This one shows up under Completed.',
    done: true,
    scheduled: null,
    created: yesterday.toISOString(),
    categoryId: 1,
    category: MOCK_CATEGORIES[0],
    sortOrder: 0,
    tags: [],
  },
];
