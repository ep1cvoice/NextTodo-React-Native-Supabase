import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PomoData, PomoRecord } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TasksContext';

const ACTIVE_KEY = 'activePomodoroSession';
const HISTORY_KEY = 'pomodoroHistory';
const MAX_HISTORY = 5;

interface PomodoroContextValue {
  activeTaskId: number | null;
  activePomo: PomoData | null;
  history: PomoRecord[];
  canStart: boolean;
  startPomo: (taskId: number) => void;
  pausePomo: () => void;
  resumePomo: () => void;
  endPomo: () => void;
  deleteHistoryRecord: (id: number) => void;
  getElapsedSeconds: (pomo?: PomoData | null) => number;
}

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

function computeElapsedMs(pomo: PomoData, now = Date.now()): number {
  const base = Number(pomo.elapsed) || 0;
  if (pomo.pausedAt || pomo.endedAt) return base;
  const startedAt = new Date(pomo.startedAt).getTime();
  if (Number.isNaN(startedAt)) return base;
  return base + Math.max(0, now - startedAt);
}

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [activePomo, setActivePomo] = useState<PomoData | null>(null);
  const [history, setHistory] = useState<PomoRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const activeTaskId = activePomo?.taskId ?? null;
  const canStart = activePomo === null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rawActive, rawHistory] = await Promise.all([
          AsyncStorage.getItem(ACTIVE_KEY),
          AsyncStorage.getItem(HISTORY_KEY),
        ]);
        if (cancelled) return;
        if (rawActive) {
          const parsed = JSON.parse(rawActive) as PomoData;
          if (parsed && parsed.endedAt === null) {
            setActivePomo(parsed);
          } else {
            await AsyncStorage.removeItem(ACTIVE_KEY);
          }
        }
        if (rawHistory) {
          setHistory(JSON.parse(rawHistory) as PomoRecord[]);
        }
      } catch {
        // ignore corrupt storage
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (activePomo) {
      AsyncStorage.setItem(ACTIVE_KEY, JSON.stringify(activePomo)).catch(() => {});
    } else {
      AsyncStorage.removeItem(ACTIVE_KEY).catch(() => {});
    }
  }, [activePomo, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history)).catch(() => {});
  }, [history, hydrated]);

  const getElapsedSeconds = useCallback((pomo?: PomoData | null) => {
    if (!pomo) return 0;
    return Math.floor(computeElapsedMs(pomo) / 1000);
  }, []);

  const startPomo = useCallback(
    (taskId: number) => {
      if (activePomo) return;
      const minutes = Number(user?.settings?.pomodoroTime);
      const durationSec = (Number.isFinite(minutes) && minutes > 0 ? minutes : 25) * 60;
      const now = new Date().toISOString();
      const nextId =
        Math.max(0, ...history.map((h) => h.id), activePomo?.id ?? 0) + 1;
      setActivePomo({
        id: nextId,
        taskId,
        duration: durationSec,
        startedAt: now,
        pausedAt: null,
        elapsed: 0,
        endedAt: null,
      });
    },
    [activePomo, history, user?.settings?.pomodoroTime]
  );

  const pausePomo = useCallback(() => {
    setActivePomo((prev) => {
      if (!prev || prev.pausedAt) return prev;
      const elapsed = computeElapsedMs(prev);
      return {
        ...prev,
        elapsed,
        pausedAt: new Date().toISOString(),
      };
    });
  }, []);

  const resumePomo = useCallback(() => {
    setActivePomo((prev) => {
      if (!prev || !prev.pausedAt) return prev;
      return {
        ...prev,
        pausedAt: null,
        startedAt: new Date().toISOString(),
      };
    });
  }, []);

  const endPomo = useCallback(() => {
    if (!activePomo) return;
    const elapsed = computeElapsedMs(activePomo);
    const endedAt = new Date().toISOString();
    const taskName =
      tasks.find((t) => t.id === activePomo.taskId)?.title ?? 'Deleted task';
    const record: PomoRecord = {
      id: activePomo.id,
      taskId: activePomo.taskId,
      taskName,
      startedAt: activePomo.startedAt,
      endedAt,
      elapsed,
      duration: activePomo.duration,
    };
    setHistory((h) => [record, ...h].slice(0, MAX_HISTORY));
    setActivePomo(null);
  }, [activePomo, tasks]);

  const deleteHistoryRecord = useCallback((id: number) => {
    setHistory((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      activeTaskId,
      activePomo,
      history,
      canStart,
      startPomo,
      pausePomo,
      resumePomo,
      endPomo,
      deleteHistoryRecord,
      getElapsedSeconds,
    }),
    [
      activeTaskId,
      activePomo,
      history,
      canStart,
      startPomo,
      pausePomo,
      resumePomo,
      endPomo,
      deleteHistoryRecord,
      getElapsedSeconds,
    ]
  );

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}

export function usePomodoro(): PomodoroContextValue {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error('usePomodoro must be used within PomodoroProvider');
  return ctx;
}
