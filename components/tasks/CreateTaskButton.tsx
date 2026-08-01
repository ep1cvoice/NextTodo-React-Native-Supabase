import { useMemo } from 'react';
import { Pressable, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Plus } from 'lucide-react-native';
import type { AppColors } from '@/constants/theme';
import { tokens } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

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
      style={({ pressed }) => [
        styles.button,
        isDesktop && styles.buttonDesktop,
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
    },
    buttonDesktop: {
      width: '100%',
      maxWidth: 320,
      alignSelf: 'flex-end',
    },
    pressed: {
      backgroundColor: colors.primaryHover,
    },
    label: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
}
