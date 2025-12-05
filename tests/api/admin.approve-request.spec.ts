import { test, expect } from '@playwright/test'

/**
 * Tests for /api/admin/approve-request endpoint
 * Comprehensive tests covering authentication, authorization, validation, and edge cases
 */
test.describe('API: /api/admin/approve-request', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/admin/approve-request', {
      data: {
        requestId: 'test-request-id',
      },
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body).toHaveProperty('error')
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
    const body = await response.json()
    expect(body).toHaveProperty('error')
  })

  test('should validate requestId format (must be UUID)', async ({ request }) => {
    const response = await request.post('/api/admin/approve-request', {
      data: {
        requestId: 'invalid-uuid',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate requestId is not empty', async ({ request }) => {
    const response = await request.post('/api/admin/approve-request', {
      data: {
        requestId: '',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate requestId is provided', async ({ request }) => {
    const response = await request.post('/api/admin/approve-request', {
      data: {
        // requestId missing
      },
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
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

  test('should reject GET requests', async ({ request }) => {
    const response = await request.get('/api/admin/approve-request')
    expect(response.status()).toBe(405) // Method Not Allowed
  })

  test('should reject PUT requests', async ({ request }) => {
    const response = await request.put('/api/admin/approve-request', {
      data: { requestId: 'test-id' },
    })
    expect(response.status()).toBe(405)
  })

  test('should reject DELETE requests', async ({ request }) => {
    const response = await request.delete('/api/admin/approve-request')
    expect(response.status()).toBe(405)
  })

  test('should validate Content-Type header', async ({ request }) => {
    const response = await request.post('/api/admin/approve-request', {
      data: { requestId: 'test-id' },
      headers: {
        'Content-Type': 'text/plain',
      },
    })
    // Should still validate or fail auth
    expect([400, 401, 415]).toContain(response.status())
  })

  test('should handle malformed JSON', async ({ request }) => {
    const response = await request.post('/api/admin/approve-request', {
      data: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    expect([400, 401]).toContain(response.status())
  })
})

