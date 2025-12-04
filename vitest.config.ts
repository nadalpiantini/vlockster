import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'test-results',
      'playwright-report',
      'tests/**/*.spec.ts', // Excluir tests de Playwright
      'tests/landing.spec.ts',
      'tests/user-journey.spec.ts',
      'tests/integration/full-flow.spec.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'test-results/',
        'playwright-report/',
        '**/*.config.{ts,js}',
        '**/*.d.ts',
        '**/types/**',
        '**/tests/**',
        '**/playwright.config.ts',
        '**/vitest.config.ts',
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 75, // Algunas ramas son casos edge (config Redis)
        statements: 100,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})

