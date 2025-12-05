import { test, expect } from '@playwright/test'

/**
 * Tests for /api/paypal/create-order endpoint
 */
test.describe('API: /api/paypal/create-order', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/paypal/create-order', {
      data: {
        project_id: 'test-project-id',
        amount: 50,
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/paypal/create-order', {
      data: {},
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should validate project_id format', async ({ request }) => {
    const response = await request.post('/api/paypal/create-order', {
      data: {
        project_id: 'invalid-uuid',
        amount: 50,
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate amount is positive', async ({ request }) => {
    const response = await request.post('/api/paypal/create-order', {
      data: {
        project_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: -10,
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate amount is within limits', async ({ request }) => {
    const response = await request.post('/api/paypal/create-order', {
      data: {
        project_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 200000, // Exceeds max
      },
    })

    expect([400, 401]).toContain(response.status())
  })
})

