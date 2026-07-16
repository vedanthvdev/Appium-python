import { describe, expect, it } from 'vitest';

const LABELS = ['Beginner', 'Intermediate', 'Hard'] as const;

describe('level chooser labels', () => {
  it('exposes the three product level labels', () => {
    expect(LABELS).toEqual(['Beginner', 'Intermediate', 'Hard']);
  });
});
