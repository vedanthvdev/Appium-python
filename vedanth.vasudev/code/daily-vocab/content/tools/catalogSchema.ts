import { z } from 'zod';

export const LEVELS = ['beginner', 'intermediate', 'hard'] as const;
export type Level = (typeof LEVELS)[number];

export const ONE_LINER_MAX = 80;
export const STRICT_WORD_COUNT = 1000;

export const WordEntrySchema = z.object({
  id: z.string().min(1),
  word: z.string().min(1),
  oneLiner: z.string().min(1).max(ONE_LINER_MAX),
});

export const CatalogSchema = z.object({
  version: z.literal(1),
  level: z.enum(LEVELS),
  words: z.array(WordEntrySchema).min(1),
});

export type WordEntry = z.infer<typeof WordEntrySchema>;
export type Catalog = z.infer<typeof CatalogSchema>;

export type ValidationIssue = { path: string; message: string };

export function validateCatalog(
  data: unknown,
  expectedLevel: Level,
  options: { strictCount?: boolean } = {},
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const parsed = CatalogSchema.safeParse(data);

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      issues.push({
        path: issue.path.join('.') || '(root)',
        message: issue.message,
      });
    }
    return issues;
  }

  const catalog = parsed.data;
  if (catalog.level !== expectedLevel) {
    issues.push({
      path: 'level',
      message: `expected "${expectedLevel}", got "${catalog.level}"`,
    });
  }

  const seen = new Set<string>();
  for (const [index, entry] of catalog.words.entries()) {
    if (seen.has(entry.id)) {
      issues.push({
        path: `words[${index}].id`,
        message: `duplicate id "${entry.id}"`,
      });
    }
    seen.add(entry.id);
  }

  if (options.strictCount && catalog.words.length !== STRICT_WORD_COUNT) {
    issues.push({
      path: 'words',
      message: `expected ${STRICT_WORD_COUNT} words, got ${catalog.words.length}`,
    });
  }

  return issues;
}
