import { test, expect } from '@playwright/test'

/**
 * Tests de integración para endpoints de admin
 */
test.describe('API: Admin', () => {
  const API_BASE = 'http://localhost:3007/api'

  test.describe('POST /api/admin/approve-request', () => {
    test('debe rechazar request sin autenticación', async ({ request }) => {
      const response = await request.post(`${API_BASE}/admin/approve-request`, {
        data: {
          requestId: '00000000-0000-0000-0000-000000000000',
        },
      })

      expect(response.status()).toBe(401)
      const body = await response.json()
      expect(body.error).toBeDefined()
    })

    test('debe rechazar UUID inválido', async ({ request }) => {
      const response = await request.post(`${API_BASE}/admin/approve-request`, {
        data: {
          requestId: 'not-a-uuid',
        },
      })

      // Primero falla auth, pero si pasara auth, fallaría validación
      expect([400, 401]).toContain(response.status())
    })

    test('debe rechazar request sin requestId', async ({ request }) => {
      const response = await request.post(`${API_BASE}/admin/approve-request`, {
        data: {},
      })

      expect(response.status()).toBe(401)
    })

    test('debe rechazar request con requestId vacío', async ({ request }) => {
      const response = await request.post(`${API_BASE}/admin/approve-request`, {
        data: {
          requestId: '',
        },
      })

      expect([400, 401]).toContain(response.status())
    })

    test('debe rechazar request con body inválido', async ({ request }) => {
      const response = await request.post(`${API_BASE}/admin/approve-request`, {
        data: {
          invalidField: 'value',
        },
      })

      expect(response.status()).toBe(401)
    })
  })

  test.describe('POST /api/admin/reject-request', () => {
    test('debe rechazar request sin autenticación', async ({ request }) => {
      const response = await request.post(`${API_BASE}/admin/reject-request`, {
        data: {
          requestId: '00000000-0000-0000-0000-000000000000',
        },
      })

      expect(response.status()).toBe(401)
      const body = await response.json()
      expect(body.error).toBeDefined()
    })

    test('debe rechazar UUID inválido', async ({ request }) => {
      const response = await request.post(`${API_BASE}/admin/reject-request`, {
        data: {
          requestId: 'not-a-uuid',
        },
      })

      expect([400, 401]).toContain(response.status())
    })

    test('debe rechazar request sin requestId', async ({ request }) => {
      const response = await request.post(`${API_BASE}/admin/reject-request`, {
        data: {},
      })

      expect(response.status()).toBe(401)
    })

    test('debe rechazar request con requestId vacío', async ({ request }) => {
      const response = await request.post(`${API_BASE}/admin/reject-request`, {
        data: {
          requestId: '',
        },
      })

      expect([400, 401]).toContain(response.status())
    })
  })
})

