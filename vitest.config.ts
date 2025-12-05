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
      'external', // Excluir archivos externos que causan errores
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
        'external/', // Excluir archivos externos
        '**/*.config.{ts,js}',
        '**/*.d.ts',
        '**/types/**',
        '**/tests/**',
        '**/playwright.config.ts',
        '**/vitest.config.ts',
      ],
      thresholds: {
        lines: 80, // Target: 80%+ (Epic 4 requirement)
        functions: 80,
        branches: 75, // Algunas ramas son casos edge (config Redis)
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})

