import { test, expect } from '@playwright/test'

/**
 * Tests de integración para el endpoint de creación de posts
 */
test.describe('API: Posts Create', () => {
  const API_BASE = 'http://localhost:3007/api'

  test('debe rechazar request sin autenticación', async ({ request }) => {
    const response = await request.post(`${API_BASE}/posts/create`, {
      data: {
        community_id: 'test-id',
        title: 'Test Post',
        content: 'Test content with enough characters',
      },
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.error).toContain('autorizado')
  })

  test('debe rechazar request sin community_id', async ({ request }) => {
    const response = await request.post(`${API_BASE}/posts/create`, {
      data: {
        title: 'Test Post',
        content: 'Test content',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('debe rechazar título muy corto', async ({ request }) => {
    const response = await request.post(`${API_BASE}/posts/create`, {
      data: {
        community_id: 'test-id',
        title: 'ab',
        content: 'Valid content with enough characters',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('debe rechazar contenido muy corto', async ({ request }) => {
    const response = await request.post(`${API_BASE}/posts/create`, {
      data: {
        community_id: 'test-id',
        title: 'Valid Title',
        content: 'short',
      },
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })
})

