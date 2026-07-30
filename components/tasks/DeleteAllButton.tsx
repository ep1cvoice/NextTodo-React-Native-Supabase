import { Pressable, Text, StyleSheet } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { colors, tokens } from '@/constants/theme';

interface DeleteAllButtonProps {
  onPress: () => void;
}

export default function DeleteAllButton({ onPress }: DeleteAllButtonProps) {
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

const styles = StyleSheet.create({
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
