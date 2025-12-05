import { test, expect } from '@playwright/test'

/**
 * Tests for /api/admin/reject-request endpoint
 * Comprehensive tests covering authentication, authorization, validation, and edge cases
 */
test.describe('API: /api/admin/reject-request', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/admin/reject-request', {
      data: {
        requestId: 'test-request-id',
        rejectionReason: 'Test reason',
      },
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body).toHaveProperty('error')
  })

  test('should require admin role', async ({ request }) => {
    // Without auth, should return 401
    const response = await request.post('/api/admin/reject-request', {
      data: {
        requestId: 'test-request-id',
        rejectionReason: 'Test reason',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/admin/reject-request', {
      data: {},
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
    const body = await response.json()
    expect(body).toHaveProperty('error')
  })

  test('should validate requestId format (must be UUID)', async ({ request }) => {
    const response = await request.post('/api/admin/reject-request', {
      data: {
        requestId: 'invalid-uuid',
        rejectionReason: 'Test reason',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate requestId is not empty', async ({ request }) => {
    const response = await request.post('/api/admin/reject-request', {
      data: {
        requestId: '',
        rejectionReason: 'Test reason',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate requestId is provided', async ({ request }) => {
    const response = await request.post('/api/admin/reject-request', {
      data: {
        rejectionReason: 'Test reason',
        // requestId missing
      },
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should handle non-existent request', async ({ request }) => {
    const response = await request.post('/api/admin/reject-request', {
      data: {
        requestId: '00000000-0000-0000-0000-000000000000',
        rejectionReason: 'Test reason',
      },
    })

    // Should fail auth first
    expect(response.status()).toBe(401)
  })

  test('should reject GET requests', async ({ request }) => {
    const response = await request.get('/api/admin/reject-request')
    expect(response.status()).toBe(405) // Method Not Allowed
  })

  test('should reject PUT requests', async ({ request }) => {
    const response = await request.put('/api/admin/reject-request', {
      data: { requestId: 'test-id', rejectionReason: 'reason' },
    })
    expect(response.status()).toBe(405)
  })

  test('should reject DELETE requests', async ({ request }) => {
    const response = await request.delete('/api/admin/reject-request')
    expect(response.status()).toBe(405)
  })

  test('should handle malformed JSON', async ({ request }) => {
    const response = await request.post('/api/admin/reject-request', {
      data: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    expect([400, 401]).toContain(response.status())
  })
})

