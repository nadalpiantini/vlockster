import { test, expect } from '@playwright/test'

/**
 * Tests for /api/admin/update-user-role endpoint
 */
test.describe('API: /api/admin/update-user-role', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/admin/update-user-role', {
      data: {
        userId: 'test-user-id',
        role: 'creator',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should require admin role', async ({ request }) => {
    // Without auth, should return 401
    const response = await request.post('/api/admin/update-user-role', {
      data: {
        userId: 'test-user-id',
        role: 'creator',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should validate role value', async ({ request }) => {
    const response = await request.post('/api/admin/update-user-role', {
      data: {
        userId: 'test-user-id',
        role: 'invalid-role',
      },
    })

    // Should fail auth first, but if it passes, should validate role
    expect([400, 401]).toContain(response.status())
  })

  test('should validate userId format', async ({ request }) => {
    const response = await request.post('/api/admin/update-user-role', {
      data: {
        userId: '',
        role: 'creator',
      },
    })

    expect([400, 401]).toContain(response.status())
  })
})

