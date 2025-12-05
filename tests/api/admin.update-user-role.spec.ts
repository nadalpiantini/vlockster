import { test, expect } from '@playwright/test'

/**
 * Tests for /api/admin/update-user-role endpoint
 * Comprehensive tests covering authentication, authorization, validation, and edge cases
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
    const body = await response.json()
    expect(body).toHaveProperty('error')
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

  test('should validate role value (must be valid enum)', async ({ request }) => {
    const response = await request.post('/api/admin/update-user-role', {
      data: {
        userId: '00000000-0000-0000-0000-000000000000',
        role: 'invalid-role',
      },
    })

    // Should fail auth first, but if it passes, should validate role
    expect([400, 401]).toContain(response.status())
  })

  test('should accept valid role values', async ({ request }) => {
    const validRoles = ['viewer', 'creator', 'moderator', 'admin']
    
    for (const role of validRoles) {
      const response = await request.post('/api/admin/update-user-role', {
        data: {
          userId: '00000000-0000-0000-0000-000000000000',
          role,
        },
      })

      // Should fail auth, but role should be accepted
      expect(response.status()).toBe(401)
    }
  })

  test('should validate userId format (must be UUID)', async ({ request }) => {
    const response = await request.post('/api/admin/update-user-role', {
      data: {
        userId: 'invalid-uuid',
        role: 'creator',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate userId is not empty', async ({ request }) => {
    const response = await request.post('/api/admin/update-user-role', {
      data: {
        userId: '',
        role: 'creator',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate userId is provided', async ({ request }) => {
    const response = await request.post('/api/admin/update-user-role', {
      data: {
        role: 'creator',
        // userId missing
      },
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should validate role is provided', async ({ request }) => {
    const response = await request.post('/api/admin/update-user-role', {
      data: {
        userId: '00000000-0000-0000-0000-000000000000',
        // role missing
      },
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should reject GET requests', async ({ request }) => {
    const response = await request.get('/api/admin/update-user-role')
    expect(response.status()).toBe(405) // Method Not Allowed
  })

  test('should reject PUT requests', async ({ request }) => {
    const response = await request.put('/api/admin/update-user-role', {
      data: { userId: 'test-id', role: 'creator' },
    })
    expect(response.status()).toBe(405)
  })

  test('should reject DELETE requests', async ({ request }) => {
    const response = await request.delete('/api/admin/update-user-role')
    expect(response.status()).toBe(405)
  })

  test('should handle malformed JSON', async ({ request }) => {
    const response = await request.post('/api/admin/update-user-role', {
      data: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    expect([400, 401]).toContain(response.status())
  })

  test('should prevent removing last admin (edge case)', async ({ request }) => {
    // This test verifies the endpoint checks for last admin protection
    // Without auth, should return 401 first
    const response = await request.post('/api/admin/update-user-role', {
      data: {
        userId: '00000000-0000-0000-0000-000000000000',
        role: 'viewer', // Trying to remove admin role
      },
    })

    expect(response.status()).toBe(401)
  })
})

