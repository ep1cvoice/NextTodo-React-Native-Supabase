import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Tag } from '@/types';
import { MAX_TAGS_PER_TASK } from '@/types';
import type { AppColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface TagChipPickerProps {
  tags: Tag[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export default function TagChipPicker({ tags, selectedIds, onChange }: TagChipPickerProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (tags.length === 0) return null;

  const atLimit = selectedIds.length >= MAX_TAGS_PER_TASK;

  const toggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
      return;
    }
    if (atLimit) return;
    onChange([...selectedIds, id]);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Tags (optional)</Text>
        {atLimit && <Text style={styles.limitNote}>Max {MAX_TAGS_PER_TASK} per task</Text>}
      </View>
      <View style={styles.chipList}>
        {tags.map((tag) => {
          const selected = selectedIds.includes(tag.id);
          const disabled = !selected && atLimit;
          return (
            <Pressable
              key={tag.id}
              disabled={disabled}
              onPress={() => toggle(tag.id)}
              style={[
                styles.chip,
                { borderColor: tag.color },
                selected && { backgroundColor: `${tag.color}22` },
                disabled && styles.chipDisabled,
              ]}>
              <View style={[styles.dot, { backgroundColor: tag.color }]} />
              <Text style={[styles.chipText, { color: tag.color }, selected && styles.chipTextSelected]}>
                # {tag.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrapper: {
      gap: 8,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    label: {
      color: colors.textSecondary,
      fontSize: 15,
    },
    limitNote: {
      fontSize: 12,
      color: colors.red,
    },
    chipList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: 1.5,
      backgroundColor: colors.bgSurface,
    },
    chipDisabled: {
      opacity: 0.4,
    },
    chipText: {
      fontSize: 13,
    },
    chipTextSelected: {
      fontWeight: '600',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
  });
}
