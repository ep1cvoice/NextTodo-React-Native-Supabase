import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';

export default function ScreenBackground({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const { colors, isDark } = useTheme();

  const gradientColors = useMemo(
    () => [colors.bgPageStart, colors.bgPageMid, colors.bgPageEnd] as const,
    [colors.bgPageStart, colors.bgPageMid, colors.bgPageEnd]
  );

  if (isDark) {
    return (
      <View style={[styles.fill, { backgroundColor: colors.bgContent }, style]}>
        {children}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[...gradientColors]}
      locations={[0, 0.5, 1]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={[styles.fill, style]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
