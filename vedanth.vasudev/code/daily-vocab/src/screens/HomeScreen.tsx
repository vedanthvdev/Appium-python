import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LevelButton } from '../components/LevelButton';
import { catalogs } from '../domain/catalog';
import { ensureTodaysWord } from '../domain/ensureTodaysWord';
import type { DailyState, Level } from '../domain/types';
import { pushDailySnapshot } from '../native/widgetBridge';
import {
  loadDailyState,
  loadLevel,
  saveDailyState,
  saveLevel,
} from '../storage/appPreferences';
import { colors } from '../theme/colors';

const LEVELS: Level[] = ['beginner', 'intermediate', 'hard'];

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

export function HomeScreen() {
  const [ready, setReady] = useState(false);
  const [level, setLevel] = useState<Level | null>(null);
  const [today, setToday] = useState<DailyState | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const savedLevel = await loadLevel();
        const savedState = await loadDailyState();
        if (cancelled) return;
        if (savedLevel) {
          const next = ensureTodaysWord({
            level: savedLevel,
            catalog: catalogs,
            state: savedState,
            now: new Date(),
            randomInt,
          });
          setLevel(savedLevel);
          setToday(next);
          await saveDailyState(next);
          await pushDailySnapshot(next);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSelect = useCallback(async (nextLevel: Level) => {
    if (busy) return;
    setBusy(true);
    try {
      const prior = await loadDailyState();
      const rolled = ensureTodaysWord({
        level: nextLevel,
        catalog: catalogs,
        state: prior,
        now: new Date(),
        randomInt,
      });
      // Optimistic UI update so taps feel instant on simulator.
      setLevel(nextLevel);
      setToday(rolled);
      await saveLevel(nextLevel);
      await saveDailyState(rolled);
      await pushDailySnapshot(rolled);
    } finally {
      setBusy(false);
    }
  }, [busy]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  const tip =
    Platform.OS === 'ios'
      ? 'Tip: add the Daily Vocab widget to your Lock Screen.'
      : 'Tip: add the Daily Vocab widget to your home screen (lock screen where supported).';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.brand}>Daily Vocab</Text>
        <Text style={styles.subtitle}>Pick a level. One word a day.</Text>

        <View style={styles.buttons}>
          {LEVELS.map((item, index) => (
            <LevelButton
              key={item}
              level={item}
              index={index}
              selected={level === item}
              onPress={onSelect}
            />
          ))}
        </View>

        {today ? (
          <View style={styles.today}>
            <Text style={styles.todayLabel}>Today</Text>
            <Text style={styles.word}>{today.word}</Text>
            <Text style={styles.oneLiner}>{today.oneLiner}</Text>
            <Text style={styles.tip}>{tip}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  inner: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  brand: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 28,
    fontSize: 17,
    color: colors.inkMuted,
  },
  buttons: {
    marginTop: 8,
  },
  today: {
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C9D0C8',
  },
  todayLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  word: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: '700',
    color: colors.ink,
  },
  oneLiner: {
    marginTop: 6,
    fontSize: 17,
    lineHeight: 24,
    color: colors.tip,
  },
  tip: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkMuted,
  },
});
