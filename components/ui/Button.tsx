import { useMemo } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import type { AppColors } from '@/constants/theme';
import { tokens } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { webInteractive } from '@/utils/pressableWeb';

interface ButtonProps {
  inner: React.ReactNode;
  to?: string;
  onPress?: () => void | boolean | Promise<void | boolean>;
}

export default function Button({ inner, to, onPress }: ButtonProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handlePress = async () => {
    let shouldNavigate = true;

    if (onPress) {
      const result = await onPress();
      if (result === false) shouldNavigate = false;
    }

    if (to && shouldNavigate) {
      router.push(to as Href);
    }
  };

  return (
    <Pressable
      style={({ pressed, hovered }) => [
        styles.button,
        hovered && styles.buttonHovered,
        pressed && styles.buttonPressed,
      ]}
      onPress={handlePress}>
      {typeof inner === 'string' ? (
        <Text style={styles.buttonText}>{inner}</Text>
      ) : (
        inner
      )}
    </Pressable>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      height: tokens.buttonHeight,
      paddingVertical: 12,
      width: '100%',
      backgroundColor: colors.primary,
      borderRadius: tokens.borderRadius,
      gap: 8,
      ...webInteractive,
    },
    buttonHovered: {
      backgroundColor: colors.primaryHover,
    },
    buttonPressed: {
      backgroundColor: colors.primaryHover,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 4,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
}
