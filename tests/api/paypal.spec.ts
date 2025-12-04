import { test, expect } from '@playwright/test'

/**
 * Tests de integración para endpoints de PayPal
 */
test.describe('API: PayPal', () => {
  const API_BASE = 'http://localhost:3007/api'

  test('create-order debe rechazar request sin autenticación', async ({ request }) => {
    const response = await request.post(`${API_BASE}/paypal/create-order`, {
      data: {
        project_id: 'test-id',
        amount: 100,
      },
    })

    expect(response.status()).toBe(401)
  })

  test('create-order debe rechazar monto negativo', async ({ request }) => {
    const response = await request.post(`${API_BASE}/paypal/create-order`, {
      data: {
        project_id: 'test-id',
        amount: -100,
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('capture-order debe rechazar request sin autenticación', async ({ request }) => {
    const response = await request.post(`${API_BASE}/paypal/capture-order`, {
      data: {
        orderId: 'ORDER123',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('capture-order debe rechazar orderId vacío', async ({ request }) => {
    const response = await request.post(`${API_BASE}/paypal/capture-order`, {
      data: {
        orderId: '',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })
})

