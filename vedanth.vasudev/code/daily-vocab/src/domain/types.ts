import type { Level, WordEntry } from '../../content/tools/catalogSchema';

export type { Level, WordEntry };

export type DailyState = {
  level: Level;
  localDate: string;
  wordId: string;
  word: string;
  oneLiner: string;
};

export type CatalogByLevel = Record<Level, WordEntry[]>;
