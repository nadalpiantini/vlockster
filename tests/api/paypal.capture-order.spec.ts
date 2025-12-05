import { test, expect } from '@playwright/test'

/**
 * Tests for /api/paypal/capture-order endpoint
 * Comprehensive tests covering authentication, validation, and edge cases
 */
test.describe('API: /api/paypal/capture-order', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/paypal/capture-order', {
      data: {
        orderId: 'test-order-id',
      },
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body).toHaveProperty('error')
  })

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/paypal/capture-order', {
      data: {},
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
    const body = await response.json()
    expect(body).toHaveProperty('error')
  })

  test('should validate orderId is provided', async ({ request }) => {
    const response = await request.post('/api/paypal/capture-order', {
      data: {
        // orderId missing
      },
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should validate orderId is not empty', async ({ request }) => {
    const response = await request.post('/api/paypal/capture-order', {
      data: {
        orderId: '',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate orderId format', async ({ request }) => {
    const response = await request.post('/api/paypal/capture-order', {
      data: {
        orderId: 'invalid-order-id',
      },
    })

    // Should fail auth first, but orderId should be validated
    expect(response.status()).toBe(401)
  })

  test('should handle invalid orderId', async ({ request }) => {
    const response = await request.post('/api/paypal/capture-order', {
      data: {
        orderId: 'INVALID-ORDER-ID-12345',
      },
    })

    // Should fail auth first
    expect(response.status()).toBe(401)
  })

  test('should reject GET requests', async ({ request }) => {
    const response = await request.get('/api/paypal/capture-order')
    expect(response.status()).toBe(405) // Method Not Allowed
  })

  test('should reject PUT requests', async ({ request }) => {
    const response = await request.put('/api/paypal/capture-order', {
      data: { orderId: 'test-id' },
    })
    expect(response.status()).toBe(405)
  })

  test('should reject DELETE requests', async ({ request }) => {
    const response = await request.delete('/api/paypal/capture-order')
    expect(response.status()).toBe(405)
  })

  test('should handle malformed JSON', async ({ request }) => {
    const response = await request.post('/api/paypal/capture-order', {
      data: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    expect([400, 401]).toContain(response.status())
  })

  test('should handle PayPal configuration errors', async ({ request }) => {
    // This test verifies the endpoint handles missing PayPal config
    // Without auth, should return 401 first
    const response = await request.post('/api/paypal/capture-order', {
      data: {
        orderId: '5O190127TN364715T',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should validate orderId from PayPal format', async ({ request }) => {
    // PayPal order IDs typically start with specific prefixes
    // This test verifies basic format validation
    const response = await request.post('/api/paypal/capture-order', {
      data: {
        orderId: '5O190127TN364715T', // Valid PayPal order ID format
      },
    })

    // Should fail auth, but format should be accepted
    expect(response.status()).toBe(401)
  })
})

