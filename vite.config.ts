import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    css: { include: [/src\/themes\/.+\.css/] },
    projects: [
      {
        extends: true,
        test: {
          name: 'logic',
          include: ['src/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'components',
          include: ['src/**/*.test.tsx'],
          environment: 'jsdom',
        },
      },
    ],
  },
});
