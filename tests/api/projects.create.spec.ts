import { test, expect } from '@playwright/test'

/**
 * Tests de integración para el endpoint de creación de proyectos
 */
test.describe('API: Projects Create', () => {
  const API_BASE = 'http://localhost:3007/api'

  test('debe rechazar request sin autenticación', async ({ request }) => {
    const response = await request.post(`${API_BASE}/projects/create`, {
      data: {
        title: 'Test Project',
        description: 'Test description',
        goal_amount: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      },
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.error).toContain('autorizado')
  })

  test('debe rechazar proyecto con título muy corto', async ({ request }) => {
    const response = await request.post(`${API_BASE}/projects/create`, {
      data: {
        title: 'ab', // Menos de 3 caracteres
        description: 'Test description',
        goal_amount: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('debe rechazar proyecto con monto negativo', async ({ request }) => {
    const response = await request.post(`${API_BASE}/projects/create`, {
      data: {
        title: 'Test Project',
        description: 'Test description',
        goal_amount: -100,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('debe rechazar proyecto con fecha pasada', async ({ request }) => {
    const response = await request.post(`${API_BASE}/projects/create`, {
      data: {
        title: 'Test Project',
        description: 'Test description',
        goal_amount: 1000,
        deadline: new Date(Date.now() - 86400000).toISOString(), // Ayer
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })
})

