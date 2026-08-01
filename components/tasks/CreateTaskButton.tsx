import { useMemo } from 'react';
import { Pressable, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Plus } from 'lucide-react-native';
import type { AppColors } from '@/constants/theme';
import { tokens } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { webInteractive } from '@/utils/pressableWeb';

interface CreateTaskButtonProps {
  onPress: () => void;
  label?: string;
}

export default function CreateTaskButton({
  onPress,
  label = 'Create New Task',
}: CreateTaskButtonProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= tokens.desktopBreakpoint;
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      style={({ pressed, hovered }) => [
        styles.button,
        isDesktop && styles.buttonDesktop,
        hovered && styles.hovered,
        pressed && styles.pressed,
      ]}
      onPress={onPress}>
      <Plus size={20} color="#fff" />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      paddingVertical: 12,
      paddingHorizontal: 26,
      backgroundColor: colors.primary,
      borderRadius: tokens.borderRadius,
      gap: 8,
      width: '100%',
      ...webInteractive,
    },
    buttonDesktop: {
      width: '100%',
      maxWidth: 320,
      alignSelf: 'flex-end',
    },
    hovered: {
      backgroundColor: colors.primaryHover,
    },
    pressed: {
      backgroundColor: colors.primaryHover,
      opacity: 0.92,
    },
    label: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
}
