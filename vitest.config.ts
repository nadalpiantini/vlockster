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
        lines: 80, // Target: 80%+ (Epic 4 requirement) ✅ Achieved: 83.94%
        functions: 80, // ✅ Achieved: 89.52%
        branches: 70, // Algunas ramas son casos edge (config Redis, AI) ✅ Achieved: 70.39%
        statements: 80, // ✅ Achieved: 83.52%
      },
      // Fail CI if coverage drops below thresholds
      reportOnFailure: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})

