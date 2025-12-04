import { test, expect } from '@playwright/test'

/**
 * Tests de integración para endpoints de admin
 */
test.describe('API: Admin', () => {
  const API_BASE = 'http://localhost:3007/api'

  test('approve-request debe rechazar request sin autenticación', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/approve-request`, {
      data: {
        requestId: 'test-id',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('approve-request debe rechazar UUID inválido', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/approve-request`, {
      data: {
        requestId: 'not-a-uuid',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('reject-request debe rechazar request sin autenticación', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/reject-request`, {
      data: {
        requestId: 'test-id',
      },
    })

    expect(response.status()).toBe(401)
  })
})

