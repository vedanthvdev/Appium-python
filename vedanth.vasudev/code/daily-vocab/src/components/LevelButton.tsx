import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { Level } from '../domain/types';
import { colors } from '../theme/colors';

const LABELS: Record<Level, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  hard: 'Hard',
};

const FILL: Record<Level, string> = {
  beginner: colors.beginner,
  intermediate: colors.intermediate,
  hard: colors.hard,
};

type Props = {
  level: Level;
  selected: boolean;
  index: number;
  onPress: (level: Level) => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function LevelButton({ level, selected, index, onPress }: Props) {
  const enter = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    enter.value = withDelay(index * 90, withTiming(1, { duration: 420 }));
  }, [enter, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateY: (1 - enter.value) * 18 },
      { scale: scale.value },
    ],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 14, stiffness: 220 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 220 });
      }}
      onPress={() => onPress(level)}
      style={[
        styles.button,
        { backgroundColor: FILL[level] },
        selected && styles.selected,
        animatedStyle,
      ]}
    >
      <Text style={styles.label}>{LABELS[level]}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 28,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  selected: {
    borderWidth: 3,
    borderColor: colors.ink,
  },
  label: {
    color: colors.buttonText,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
