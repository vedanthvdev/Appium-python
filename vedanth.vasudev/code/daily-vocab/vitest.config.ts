import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'content/tools/**/*.test.ts',
      'src/**/*.test.ts',
    ],
  },
});
