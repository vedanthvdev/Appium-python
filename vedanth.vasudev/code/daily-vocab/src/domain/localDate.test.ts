import { describe, expect, it } from 'vitest';
import { formatLocalDate } from './localDate';

describe('formatLocalDate', () => {
  it('uses America/New_York calendar date near UTC midnight', () => {
    // 2026-07-16T04:00:00Z is still July 16 in New York (EDT, UTC-4)
    const date = new Date('2026-07-16T04:00:00.000Z');
    expect(formatLocalDate(date, 'America/New_York')).toBe('2026-07-16');
  });

  it('rolls back before midnight in America/New_York', () => {
    // 2026-07-16T03:00:00Z is July 15 evening in New York
    const date = new Date('2026-07-16T03:00:00.000Z');
    expect(formatLocalDate(date, 'America/New_York')).toBe('2026-07-15');
  });
});
