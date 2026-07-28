import type { Dispatch, SetStateAction } from 'react';

export interface UserSettings {
  theme?: string;
  notificationType?: string;
  pomodoroTime?: number;
  view?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  settings?: UserSettings;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  logout: () => Promise<void>;
}
