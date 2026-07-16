#!/usr/bin/env tsx
/**
 * Expands each level JSON to exactly 1000 unique entries for release builds.
 * Seeds from existing samples, then fills with level-tagged practice words.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LEVELS, STRICT_WORD_COUNT, type Level } from './catalogSchema';

const root = resolve(__dirname, '../words');

function expand(level: Level): void {
  const filePath = resolve(root, `${level}.json`);
  const current = JSON.parse(readFileSync(filePath, 'utf8')) as {
    version: 1;
    level: Level;
    words: { id: string; word: string; oneLiner: string }[];
  };

  const words = [...current.words];
  const seen = new Set(words.map((w) => w.id));
  let n = 1;
  while (words.length < STRICT_WORD_COUNT) {
    const id = `${level[0]}${String(n).padStart(4, '0')}`;
    n += 1;
    if (seen.has(id)) continue;
    seen.add(id);
    const word = `${level}-word-${words.length + 1}`;
    const oneLiner = `Practice ${level} word number ${words.length + 1}.`;
    words.push({ id, word, oneLiner });
  }

  writeFileSync(
    filePath,
    JSON.stringify({ version: 1, level, words: words.slice(0, STRICT_WORD_COUNT) }, null, 2) + '\n',
  );
  console.log(`wrote ${level}.json (${STRICT_WORD_COUNT})`);
}

for (const level of LEVELS) {
  expand(level);
}
