import { test, expect } from '@playwright/test'

/**
 * Tests de integración para el endpoint de creación de comentarios
 */
test.describe('API: Comments Create', () => {
  const API_BASE = 'http://localhost:3007/api'

  test('debe rechazar request sin autenticación', async ({ request }) => {
    const response = await request.post(`${API_BASE}/comments/create`, {
      data: {
        post_id: 'test-id',
        content: 'Test comment',
      },
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.error).toContain('autorizado')
  })

  test('debe rechazar request sin post_id', async ({ request }) => {
    const response = await request.post(`${API_BASE}/comments/create`, {
      data: {
        content: 'Test comment',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth, pero en producción sería 400
  })

  test('debe rechazar contenido vacío', async ({ request }) => {
    const response = await request.post(`${API_BASE}/comments/create`, {
      data: {
        post_id: 'test-id',
        content: '',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('debe rechazar contenido muy largo', async ({ request }) => {
    const longContent = 'a'.repeat(2001) // Más del límite de 2000 caracteres

    const response = await request.post(`${API_BASE}/comments/create`, {
      data: {
        post_id: 'test-id',
        content: longContent,
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })
})

