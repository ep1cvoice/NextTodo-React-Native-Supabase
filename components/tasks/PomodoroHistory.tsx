import { useMemo, useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, ScrollView } from 'react-native';
import { History, CheckCircle, XCircle, Trash2, X } from 'lucide-react-native';
import type { PomoRecord } from '@/types';
import type { AppColors } from '@/constants/theme';
import { tokens } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { usePomodoro } from '@/context/PomodoroContext';
import { useTheme } from '@/context/ThemeContext';
import { webInteractive } from '@/utils/pressableWeb';

function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

interface PomodoroHistoryProps {
  /** Compact icon button style for the timer row */
  compact?: boolean;
}

export default function PomodoroHistory({ compact = true }: PomodoroHistoryProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user } = useAuth();
  const { history, deleteHistoryRecord } = usePomodoro();
  const [open, setOpen] = useState(false);
  const pomodoroMinutes = Number(user?.settings?.pomodoroTime) || 25;

  const isCompleted = (record: PomoRecord) =>
    record.elapsed >= record.duration * 1000;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={8}
        style={({ pressed, hovered }) => [
          compact ? styles.iconBtn : styles.openBtn,
          (hovered || pressed) && styles.iconBtnPressed,
        ]}
        accessibilityLabel="Pomodoro history">
        <History size={14} color={colors.textSecondary} />
        {!compact ? <Text style={styles.openBtnText}>History</Text> : null}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>History</Text>
                <Text style={styles.subtitle}>{pomodoroMinutes}m set</Text>
              </View>
              <Pressable onPress={() => setOpen(false)} hitSlop={8} style={styles.closeBtn}>
                <X size={18} color={colors.textMuted} />
              </Pressable>
            </View>

            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {history.length === 0 ? (
                <Text style={styles.empty}>No sessions yet</Text>
              ) : (
                history.map((record) => {
                  const done = isCompleted(record);
                  return (
                    <View key={record.id} style={styles.row}>
                      <View style={styles.rowMain}>
                        <View style={styles.rowTop}>
                          {done ? (
                            <CheckCircle size={14} color={colors.green} />
                          ) : (
                            <XCircle size={14} color={colors.red} />
                          )}
                          <Text style={styles.taskName} numberOfLines={1}>
                            {record.taskName}
                          </Text>
                        </View>
                        <Text style={styles.meta}>
                          {formatDate(record.endedAt)} · {formatTime(record.endedAt)} ·{' '}
                          {formatDuration(Math.floor(record.elapsed / 1000))}
                          {done ? ' · Done' : ' · Stopped'}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => deleteHistoryRecord(record.id)}
                        hitSlop={8}
                        style={({ pressed, hovered }) => [
                          styles.deleteBtn,
                          (hovered || pressed) && styles.deleteBtnPressed,
                        ]}
                        accessibilityLabel="Delete session">
                        <Trash2 size={14} color={colors.red} />
                      </Pressable>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    iconBtn: {
      width: 26,
      height: 26,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      ...webInteractive,
    },
    iconBtnPressed: {
      backgroundColor: colors.todoHighlight,
    },
    openBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      ...webInteractive,
    },
    openBtnText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    panel: {
      width: '100%',
      maxWidth: 360,
      maxHeight: '70%',
      backgroundColor: colors.bgContent,
      borderRadius: tokens.borderRadius,
      borderWidth: 1,
      borderColor: colors.borderColor,
      overflow: 'hidden',
      ...tokens.shadow,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
      backgroundColor: colors.bgSurface,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    closeBtn: {
      padding: 6,
      borderRadius: 8,
      ...webInteractive,
    },
    list: {
      padding: 12,
    },
    empty: {
      textAlign: 'center',
      color: colors.textMuted,
      fontSize: 14,
      paddingVertical: 28,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.borderColor,
      backgroundColor: colors.bgSurface,
      marginBottom: 8,
    },
    rowMain: {
      flex: 1,
      minWidth: 0,
      gap: 4,
    },
    rowTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    taskName: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    meta: {
      fontSize: 12,
      color: colors.textMuted,
    },
    deleteBtn: {
      padding: 6,
      borderRadius: 8,
      ...webInteractive,
    },
    deleteBtnPressed: {
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
    },
  });
}
