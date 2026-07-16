import beginner from '../../content/words/beginner.json';
import intermediate from '../../content/words/intermediate.json';
import hard from '../../content/words/hard.json';
import type { CatalogByLevel, Level, WordEntry } from './types';

export const catalogs: CatalogByLevel = {
  beginner: beginner.words as WordEntry[],
  intermediate: intermediate.words as WordEntry[],
  hard: hard.words as WordEntry[],
};

export function wordsForLevel(level: Level): WordEntry[] {
  return catalogs[level];
}
