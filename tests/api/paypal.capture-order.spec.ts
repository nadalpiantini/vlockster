import { test, expect } from '@playwright/test'

/**
 * Tests for /api/paypal/capture-order endpoint
 */
test.describe('API: /api/paypal/capture-order', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/paypal/capture-order', {
      data: {
        orderId: 'test-order-id',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/paypal/capture-order', {
      data: {},
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should validate orderId format', async ({ request }) => {
    const response = await request.post('/api/paypal/capture-order', {
      data: {
        orderId: '',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should handle invalid orderId', async ({ request }) => {
    const response = await request.post('/api/paypal/capture-order', {
      data: {
        orderId: 'invalid-order-id',
      },
    })

    // Should fail auth first
    expect(response.status()).toBe(401)
  })
})

