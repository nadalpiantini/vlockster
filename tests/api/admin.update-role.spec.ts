import { test, expect } from '@playwright/test'

/**
 * Tests para el endpoint de actualización de roles de usuario
 */
test.describe('API: Admin Update User Role', () => {
  const API_BASE = 'http://localhost:3007/api'

  test('debe rechazar request sin autenticación', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/update-user-role`, {
      data: {
        userId: '00000000-0000-0000-0000-000000000000',
        role: 'creator',
      },
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.error).toContain('autorizado')
  })

  test('debe rechazar request sin userId', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/update-user-role`, {
      data: {
        role: 'creator',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('debe rechazar request sin role', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/update-user-role`, {
      data: {
        userId: '00000000-0000-0000-0000-000000000000',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('debe rechazar role inválido', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/update-user-role`, {
      data: {
        userId: '00000000-0000-0000-0000-000000000000',
        role: 'invalid_role',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('debe rechazar userId inválido (no UUID)', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/update-user-role`, {
      data: {
        userId: 'not-a-uuid',
        role: 'creator',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })
})

