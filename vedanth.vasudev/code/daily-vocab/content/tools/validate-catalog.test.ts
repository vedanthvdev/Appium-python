import { describe, expect, it } from 'vitest';
import { validateCatalog, type Catalog } from './catalogSchema';

const sample = (overrides: Partial<Catalog> = {}): Catalog => ({
  version: 1,
  level: 'beginner',
  words: [
    { id: 'b1', word: 'happy', oneLiner: 'Feeling joy or pleasure.' },
    { id: 'b2', word: 'quick', oneLiner: 'Moving with speed.' },
  ],
  ...overrides,
});

describe('validateCatalog', () => {
  it('accepts a valid sample catalog', () => {
    expect(validateCatalog(sample(), 'beginner')).toEqual([]);
  });

  it('rejects duplicate ids', () => {
    const issues = validateCatalog(
      sample({
        words: [
          { id: 'b1', word: 'happy', oneLiner: 'Feeling joy or pleasure.' },
          { id: 'b1', word: 'quick', oneLiner: 'Moving with speed.' },
        ],
      }),
      'beginner',
    );
    expect(issues.some((i) => i.message.includes('duplicate'))).toBe(true);
  });

  it('rejects oneLiner over 80 chars', () => {
    const long = 'x'.repeat(81);
    const issues = validateCatalog(
      sample({
        words: [{ id: 'b1', word: 'long', oneLiner: long }],
      }),
      'beginner',
    );
    expect(issues.length).toBeGreaterThan(0);
  });

  it('rejects wrong level field', () => {
    const issues = validateCatalog(sample({ level: 'hard' }), 'beginner');
    expect(issues.some((i) => i.path === 'level')).toBe(true);
  });

  it('strict-count fails when length is not 1000', () => {
    const issues = validateCatalog(sample(), 'beginner', { strictCount: true });
    expect(issues.some((i) => i.message.includes('1000'))).toBe(true);
  });
});
