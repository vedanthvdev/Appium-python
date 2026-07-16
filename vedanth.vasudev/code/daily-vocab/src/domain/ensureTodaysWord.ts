import type { CatalogByLevel, DailyState, Level } from './types';
import { formatLocalDate } from './localDate';

export type EnsureTodaysWordInput = {
  level: Level;
  catalog: CatalogByLevel;
  state: DailyState | null;
  now: Date;
  /** Returns an integer in [0, maxExclusive). */
  randomInt: (maxExclusive: number) => number;
  timeZone?: string;
};

export function ensureTodaysWord(input: EnsureTodaysWordInput): DailyState {
  const { level, catalog, state, now, randomInt, timeZone } = input;
  const words = catalog[level];
  if (!words?.length) {
    throw new Error(`Catalog for level "${level}" is empty`);
  }

  const today = formatLocalDate(now, timeZone);

  if (state && state.localDate === today && state.level === level) {
    return state;
  }

  const previousId = state?.wordId;
  let index = randomInt(words.length);
  if (words.length > 1 && previousId) {
    let guard = 0;
    while (words[index].id === previousId && guard < 8) {
      index = randomInt(words.length);
      guard += 1;
    }
    if (words[index].id === previousId) {
      index = (index + 1) % words.length;
    }
  }

  const entry = words[index];
  return {
    level,
    localDate: today,
    wordId: entry.id,
    word: entry.word,
    oneLiner: entry.oneLiner,
  };
}
