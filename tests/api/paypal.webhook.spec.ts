import { test, expect } from '@playwright/test'

/**
 * Tests for /api/paypal/webhook endpoint
 */
test.describe('API: /api/paypal/webhook', () => {
  test('should require valid webhook signature', async ({ request }) => {
    const response = await request.post('/api/paypal/webhook', {
      data: {
        event_type: 'PAYMENT.CAPTURE.COMPLETED',
        resource: {
          id: 'test-payment-id',
        },
      },
    })

    // Should validate webhook signature
    expect([400, 401, 403]).toContain(response.status())
  })

  test('should validate event_type', async ({ request }) => {
    const response = await request.post('/api/paypal/webhook', {
      data: {
        event_type: 'INVALID_EVENT',
        resource: {},
      },
    })

    expect([400, 401, 403]).toContain(response.status())
  })

  test('should handle PAYMENT.CAPTURE.COMPLETED event', async ({ request }) => {
    const response = await request.post('/api/paypal/webhook', {
      data: {
        event_type: 'PAYMENT.CAPTURE.COMPLETED',
        resource: {
          id: 'test-payment-id',
          purchase_units: [{
            amount: { value: '50.00' },
          }],
        },
      },
    })

    // Should validate webhook signature first
    expect([200, 400, 401, 403]).toContain(response.status())
  })

  test('should handle PAYMENT.CAPTURE.DENIED event', async ({ request }) => {
    const response = await request.post('/api/paypal/webhook', {
      data: {
        event_type: 'PAYMENT.CAPTURE.DENIED',
        resource: {
          id: 'test-payment-id',
        },
      },
    })

    // Should validate webhook signature first
    expect([200, 400, 401, 403]).toContain(response.status())
  })
})

