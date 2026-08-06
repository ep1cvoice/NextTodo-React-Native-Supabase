import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Waves } from 'lucide-react-native';
import { brand } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

/** Once per JS session (like NextTodo sessionStorage). */
let splashShownThisSession = false;

const HOLD_MS = 1500;
const FADE_MS = 500;

export default function AppSplash() {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(() => !splashShownThisSession);
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(14)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;

    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();

    const fadeTimer = setTimeout(() => {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    }, HOLD_MS);

    const hideTimer = setTimeout(() => {
      splashShownThisSession = true;
      setVisible(false);
    }, HOLD_MS + FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [visible, logoOpacity, logoScale, titleOpacity, titleTranslateY, overlayOpacity]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.overlay,
        { backgroundColor: colors.bgSurface, opacity: overlayOpacity },
      ]}>
      <View style={styles.content}>
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }}>
          <Waves size={72} strokeWidth={2} color={colors.primary} />
        </Animated.View>
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          }}>
          <Text style={[styles.title, { color: colors.primary }]}>{brand.name}</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
