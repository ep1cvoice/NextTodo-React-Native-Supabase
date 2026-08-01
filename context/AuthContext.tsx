import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthContextValue, User } from '@/types';

const STORAGE_KEY = 'flowtodo.user';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw) as User;
          if (parsed?.id && parsed?.email) setUserState(parsed);
        } catch {
          // ignore corrupt session
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const setUser: Dispatch<SetStateAction<User | null>> = (value) => {
    setUserState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      if (next) {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      } else {
        AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      }
      return next;
    });
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        setUser,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
