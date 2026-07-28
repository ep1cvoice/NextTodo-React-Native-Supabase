import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, tokens } from '@/constants/theme';

interface AuthLayoutProps {
  children: React.ReactNode;
  gap?: number;
  overlay?: React.ReactNode;
}

export default function AuthLayout({ children, gap = 48, overlay }: AuthLayoutProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= tokens.desktopBreakpoint;

  return (
    <LinearGradient
      colors={[colors.bgPageStart, colors.bgPageMid, colors.bgPageEnd]}
      locations={[0, 0.45, 1]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.gradient}>
      <SafeAreaView style={styles.authLayout}>
        {overlay}
        <View
          style={[
            styles.card,
            { gap },
            isDesktop ? styles.cardDesktop : styles.cardMobile,
          ]}>
          {children}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export function LoggingInOverlay() {
  return (
    <View style={styles.loggingInOverlay}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loggingInText}>Logging in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  authLayout: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardMobile: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  cardDesktop: {
    width: '100%',
    maxWidth: tokens.authCardMaxWidth,
    padding: 32,
    backgroundColor: colors.bgAuthCard,
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.12)',
    borderRadius: tokens.borderRadius,
    ...tokens.shadow,
  },
  loggingInOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    backgroundColor: 'rgba(240, 253, 250, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  loggingInText: {
    margin: 0,
    fontSize: 25,
    fontWeight: '500',
    lineHeight: 40,
    color: colors.textSecondary,
  },
});
