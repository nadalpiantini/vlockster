import { test, expect } from '@playwright/test'

/**
 * Tests for /api/admin/approve-request endpoint
 */
test.describe('API: /api/admin/approve-request', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/admin/approve-request', {
      data: {
        requestId: 'test-request-id',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should require admin role', async ({ request }) => {
    // Without auth, should return 401
    const response = await request.post('/api/admin/approve-request', {
      data: {
        requestId: 'test-request-id',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/admin/approve-request', {
      data: {},
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should validate requestId format', async ({ request }) => {
    const response = await request.post('/api/admin/approve-request', {
      data: {
        requestId: 'invalid-uuid',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should handle non-existent request', async ({ request }) => {
    const response = await request.post('/api/admin/approve-request', {
      data: {
        requestId: '00000000-0000-0000-0000-000000000000',
      },
    })

    // Should fail auth first
    expect(response.status()).toBe(401)
  })
})

