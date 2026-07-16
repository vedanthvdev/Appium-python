import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyState, Level } from '../domain/types';

const LEVEL_KEY = 'dailyvocab.level';
const STATE_KEY = 'dailyvocab.dailyState';

export async function loadLevel(): Promise<Level | null> {
  const value = await AsyncStorage.getItem(LEVEL_KEY);
  if (value === 'beginner' || value === 'intermediate' || value === 'hard') {
    return value;
  }
  return null;
}

export async function saveLevel(level: Level): Promise<void> {
  await AsyncStorage.setItem(LEVEL_KEY, level);
}

export async function loadDailyState(): Promise<DailyState | null> {
  const raw = await AsyncStorage.getItem(STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DailyState;
  } catch {
    return null;
  }
}

export async function saveDailyState(state: DailyState): Promise<void> {
  await AsyncStorage.setItem(STATE_KEY, JSON.stringify(state));
}
