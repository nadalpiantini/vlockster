import { test, expect } from '@playwright/test'

/**
 * Tests de integración para endpoints de usuario (GDPR)
 */
test.describe('API: User (GDPR)', () => {
  const API_BASE = 'http://localhost:3007/api'

  test('export debe rechazar request sin autenticación', async ({ request }) => {
    const response = await request.get(`${API_BASE}/user/export`)

    expect(response.status()).toBe(401)
  })

  test('delete debe rechazar request sin autenticación', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/user/delete`, {
      data: {
        confirm: 'DELETE_MY_ACCOUNT',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('delete debe rechazar sin confirmación', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/user/delete`, {
      data: {},
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })
})

