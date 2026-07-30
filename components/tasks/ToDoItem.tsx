import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  Alert,
  StyleSheet,
  useWindowDimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronDown,
  CirclePlus,
  Pencil,
  Trash2,
  X,
  Briefcase,
  Home,
  Book,
  Heart,
  Star,
  ShoppingCart,
  Dumbbell,
  Code,
  Music,
  Camera,
  Plane,
  Car,
  Coffee,
  Gamepad2,
  Palette,
  Globe,
  Leaf,
  Zap,
  Target,
  Users,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { CategoryIcon, Task } from '@/types';
import { colors, tokens } from '@/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ICON_MAP: Record<CategoryIcon, LucideIcon> = {
  Briefcase,
  Home,
  Book,
  Heart,
  Star,
  ShoppingCart,
  Dumbbell,
  Code,
  Music,
  Camera,
  Plane,
  Car,
  Coffee,
  Gamepad2,
  Palette,
  Globe,
  Leaf,
  Zap,
  Target,
  Users,
};

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

interface ToDoItemProps {
  task: Task;
  index?: number;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ToDoItem({ task, index = 0, onToggle, onDelete }: ToDoItemProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < tokens.desktopBreakpoint;

  const [isExpanded, setIsExpanded] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);

  const category = task.category;
  const tags = task.tags ?? [];
  const CategoryIconComp =
    category ? ICON_MAP[category.icon as CategoryIcon] ?? Briefcase : null;

  const dueDate = task.scheduled ? new Date(task.scheduled) : null;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const isToday = (() => {
    if (!dueDate) return false;
    const d = new Date(dueDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === todayStart.getTime();
  })();

  const isPast = (() => {
    if (!dueDate) return false;
    const d = new Date(dueDate);
    d.setHours(0, 0, 0, 0);
    return d < todayStart;
  })();

  const categoryGradientColors = category
    ? (() => {
        const { r, g, b } = hexToRgb(category.color);
        return [`rgba(${r},${g},${b},0)`, `rgba(${r},${g},${b},0.3)`] as const;
      })()
    : null;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((v) => !v);
  };

  const handleEdit = () => {
    Alert.alert('Nie można edytować zadań w tej wersji.');
  };

  return (
    <>
      <Pressable
        onPress={toggleExpand}
        style={({ pressed }) => [
          styles.todoItem,
          category && !isMobile ? styles.hasCategory : null,
          pressed ? styles.pressed : null,
        ]}>
        {categoryGradientColors && (
          <LinearGradient
            colors={[...categoryGradientColors]}
            start={{ x: 0.35, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.categoryGradient}
            pointerEvents="none"
          />
        )}

        {!isMobile && CategoryIconComp && category && (
          <View style={[styles.categoryBgIcon, { opacity: 0.2 }]} pointerEvents="none">
            <CategoryIconComp size={35} strokeWidth={1.5} color={category.color} />
          </View>
        )}

        <View style={[styles.todoMainRow, isExpanded && styles.todoMainRowExpanded]}>
          <Pressable
            style={[styles.todoCheckbox, task.done && styles.checked]}
            onPress={() => onToggle(task.id)}
            hitSlop={6}>
            {task.done ? <Text style={styles.checkmark}>✓</Text> : null}
          </Pressable>

          <View style={[styles.todoText, isExpanded && styles.todoTextExpanded]}>
            <Text
              style={[styles.titleText, task.done && styles.done]}
              numberOfLines={isExpanded ? undefined : isMobile ? 2 : 1}>
              {task.title}
            </Text>
            <View style={isExpanded ? styles.rotated : undefined}>
              <ChevronDown size={16} color={colors.textMuted} />
            </View>
          </View>

          <View style={styles.todoIndicators}>
            {dueDate && (
              <View
                style={[
                  styles.todoDate,
                  isToday && styles.todoDateToday,
                  isPast && styles.todoDatePast,
                ]}>
                <Text
                  style={[
                    styles.todoDateText,
                    isToday && styles.todoDateTextToday,
                    isPast && styles.todoDateTextPast,
                  ]}>
                  {dueDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </Text>
              </View>
            )}
          </View>

          {!isMobile && (
            <View style={styles.todoActions}>
              {!task.done && (
                <Pressable
                  style={({ pressed }) => [styles.todoActionBtn, pressed && styles.actionPressed]}
                  onPress={handleEdit}
                  hitSlop={6}>
                  <Pencil size={18} color={colors.textSecondary} />
                </Pressable>
              )}
              <Pressable
                style={({ pressed }) => [styles.todoActionBtn, pressed && styles.actionPressed]}
                onPress={() => onDelete(task.id)}
                hitSlop={6}>
                <Trash2 size={18} color={colors.textSecondary} />
              </Pressable>
            </View>
          )}

          {isMobile && (
            <View style={styles.mobileRight}>
              {CategoryIconComp && category && (
                <View style={{ opacity: 0.5 }}>
                  <CategoryIconComp size={20} strokeWidth={1.5} color={category.color} />
                </View>
              )}
              {!task.done ? (
                <Pressable
                  style={styles.mobilePlus}
                  onPress={() => setShowMobileActions(true)}
                  hitSlop={8}>
                  <CirclePlus size={20} color={colors.textPrimary} />
                </Pressable>
              ) : (
                <Pressable
                  style={styles.mobilePlus}
                  onPress={() => onDelete(task.id)}
                  hitSlop={8}>
                  <Trash2 size={20} color={colors.textPrimary} />
                </Pressable>
              )}
            </View>
          )}
        </View>

        {tags.length > 0 && (
          <View style={styles.tagChipRow}>
            {tags.map((tag) => (
              <View key={tag.id} style={[styles.tagChip, { borderColor: tag.color }]}>
                <Text style={[styles.tagChipText, { color: tag.color }]}>#{tag.name}</Text>
              </View>
            ))}
          </View>
        )}

        {isExpanded && !!task.description && (
          <View style={styles.descriptionWrapper}>
            <Text style={[styles.todoDescription, task.done && styles.done]}>
              {task.description}
            </Text>
          </View>
        )}
      </Pressable>

      <Modal
        visible={showMobileActions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMobileActions(false)}>
        <Pressable style={styles.mobileOverlay} onPress={() => setShowMobileActions(false)}>
          <Pressable style={styles.mobileActionsModal} onPress={(e) => e.stopPropagation()}>
            <Pressable
              style={styles.mobileActionRow}
              onPress={() => {
                setShowMobileActions(false);
                handleEdit();
              }}>
              <Pencil size={18} color={colors.textPrimary} />
              <Text style={styles.mobileActionText}>Edit</Text>
            </Pressable>

            <Pressable
              style={styles.mobileActionRow}
              onPress={() => {
                setShowMobileActions(false);
                onDelete(task.id);
              }}>
              <Trash2 size={18} color={colors.textPrimary} />
              <Text style={styles.mobileActionText}>Delete</Text>
            </Pressable>

            <Pressable
              style={[styles.mobileActionRow, styles.mobileClose]}
              onPress={() => setShowMobileActions(false)}>
              <X size={18} color={colors.red} />
              <Text style={[styles.mobileActionText, { color: colors.red }]}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.bgTodoItem,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: tokens.borderRadius,
    minHeight: 36,
    gap: 4.8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  hasCategory: {
    paddingRight: 50,
  },
  pressed: {
    backgroundColor: colors.todoHighlight,
    borderColor: 'rgba(13, 148, 136, 0.2)',
  },
  categoryGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  categoryBgIcon: {
    position: 'absolute',
    right: 10,
    top: 5,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    minWidth: 0,
  },
  todoMainRowExpanded: {
    alignItems: 'flex-start',
  },
  todoCheckbox: {
    width: 24,
    height: 24,
    minWidth: 24,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  checkmark: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  todoText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
    overflow: 'hidden',
  },
  todoTextExpanded: {
    alignItems: 'flex-start',
  },
  titleText: {
    flex: 1,
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  rotated: {
    transform: [{ rotate: '180deg' }],
  },
  done: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
    opacity: 0.7,
  },
  todoIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  todoDate: {
    paddingHorizontal: 6,
    height: 22,
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: tokens.borderRadius,
  },
  todoDateToday: {
    backgroundColor: colors.pink,
  },
  todoDatePast: {
    backgroundColor: colors.bgContent,
  },
  todoDateText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  todoDateTextToday: {
    color: colors.red,
  },
  todoDateTextPast: {
    color: colors.textMuted,
  },
  todoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  todoActionBtn: {
    padding: 6,
    borderRadius: tokens.borderRadius,
  },
  actionPressed: {
    backgroundColor: colors.sidebarLogoutHover,
  },
  mobileRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    flexShrink: 0,
  },
  mobilePlus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    zIndex: 2,
  },
  tagChip: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    maxWidth: 160,
  },
  tagChipText: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 15.4,
  },
  descriptionWrapper: {
    marginLeft: 34,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
    paddingLeft: 10,
    paddingTop: 4,
    paddingBottom: 2,
  },
  todoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 19.6,
  },
  mobileOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mobileActionsModal: {
    width: '100%',
    maxWidth: 420,
    marginHorizontal: 12,
    marginBottom: 16,
    backgroundColor: colors.bgContent,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: tokens.borderRadius,
    padding: 14,
    gap: 10,
    ...tokens.shadow,
  },
  mobileActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.bgSurface,
  },
  mobileClose: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  mobileActionText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
