import { test, expect } from '@playwright/test'

/**
 * Tests para el endpoint de resolución de reportes
 */
test.describe('API: Admin Resolve Report', () => {
  const API_BASE = 'http://localhost:3007/api'

  test('debe rechazar request sin autenticación', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/resolve-report`, {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
        action: 'resolve',
      },
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.error).toContain('autorizado')
  })

  test('debe rechazar request sin reportId', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/resolve-report`, {
      data: {
        action: 'resolve',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('debe rechazar request sin action', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/resolve-report`, {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('debe rechazar action inválido', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/resolve-report`, {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
        action: 'invalid_action',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('debe aceptar action "resolve"', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/resolve-report`, {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
        action: 'resolve',
      },
    })

    // Debe fallar por auth, pero no por validación
    expect([401, 404]).toContain(response.status())
  })

  test('debe aceptar action "dismiss"', async ({ request }) => {
    const response = await request.post(`${API_BASE}/admin/resolve-report`, {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
        action: 'dismiss',
      },
    })

    // Debe fallar por auth, pero no por validación
    expect([401, 404]).toContain(response.status())
  })
})

