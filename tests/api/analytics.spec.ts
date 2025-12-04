import { test, expect } from '@playwright/test'

/**
 * Tests de integración para endpoint de analytics
 */
test.describe('API: Analytics', () => {
  const API_BASE = 'http://localhost:3007/api'

  test('debe rechazar request sin autenticación', async ({ request }) => {
    const response = await request.get(`${API_BASE}/analytics`)

    expect(response.status()).toBe(401)
  })
})

