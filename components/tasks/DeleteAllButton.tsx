import { useMemo } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import type { AppColors } from '@/constants/theme';
import { tokens } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface DeleteAllButtonProps {
  onPress: () => void;
}

export default function DeleteAllButton({ onPress }: DeleteAllButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
      hitSlop={6}>
      <Trash2 size={16} color={colors.sidebarLogoutText} />
      <Text style={styles.label}>Delete All</Text>
    </Pressable>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderRadius: tokens.borderRadius,
      paddingVertical: 9.6,
      paddingHorizontal: 16,
    },
    pressed: {
      backgroundColor: colors.sidebarLogoutHover,
    },
    label: {
      fontWeight: '500',
      fontSize: 14,
      color: colors.sidebarLogoutText,
    },
  });
}
