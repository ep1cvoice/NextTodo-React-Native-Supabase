import { Pressable, Text, StyleSheet } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { colors, tokens } from '@/constants/theme';

interface ButtonProps {
  inner: React.ReactNode;
  to?: string;
  onPress?: () => void | boolean | Promise<void | boolean>;
}

export default function Button({ inner, to, onPress }: ButtonProps) {
  const router = useRouter();

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
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={handlePress}>
      {typeof inner === 'string' ? (
        <Text style={styles.buttonText}>{inner}</Text>
      ) : (
        inner
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: tokens.buttonHeight,
    paddingVertical: 12,
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: tokens.borderRadius,
    gap: 8,
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
