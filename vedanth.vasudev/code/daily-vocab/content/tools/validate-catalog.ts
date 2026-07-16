#!/usr/bin/env tsx
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LEVELS, type Level, validateCatalog } from './catalogSchema';

const strictCount = process.argv.includes('--strict-count');
const root = resolve(__dirname, '../words');

let failed = false;

for (const level of LEVELS) {
  const filePath = resolve(root, `${level}.json`);
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`FAIL ${level}.json — cannot read/parse: ${String(error)}`);
    failed = true;
    continue;
  }

  const issues = validateCatalog(data, level as Level, { strictCount });
  if (issues.length === 0) {
    const count = (data as { words: unknown[] }).words.length;
    console.log(`OK   ${level}.json (${count} words)`);
  } else {
    failed = true;
    console.error(`FAIL ${level}.json`);
    for (const issue of issues) {
      console.error(`  - ${issue.path}: ${issue.message}`);
    }
  }
}

if (failed) {
  process.exit(1);
}
