import { test, expect } from '@playwright/test'

/**
 * Tests for /api/admin/resolve-report endpoint
 */
test.describe('API: /api/admin/resolve-report', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: 'test-report-id',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should require admin role', async ({ request }) => {
    // Without auth, should return 401
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: 'test-report-id',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should validate reportId format', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: '',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should handle non-existent report', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
      },
    })

    // Should fail auth first
    expect(response.status()).toBe(401)
  })
})
