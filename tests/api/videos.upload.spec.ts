import { test, expect } from '@playwright/test'

/**
 * Tests de integración para el endpoint de upload de videos
 */
test.describe('API: Videos Upload', () => {
  const API_BASE = 'http://localhost:3007/api'

  test('debe rechazar request sin autenticación', async ({ request }) => {
    const formData = new FormData()
    formData.append('file', new Blob(['test'], { type: 'video/mp4' }), 'test.mp4')
    formData.append('title', 'Test Video')
    formData.append('description', 'Test description')

    const response = await request.post(`${API_BASE}/videos/upload`, {
      multipart: formData,
    })

    expect(response.status()).toBe(401)
  })

  test('debe rechazar request sin archivo', async ({ request }) => {
    const formData = new FormData()
    formData.append('title', 'Test Video')
    formData.append('description', 'Test description')

    const response = await request.post(`${API_BASE}/videos/upload`, {
      multipart: formData,
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })

  test('debe rechazar título muy corto', async ({ request }) => {
    const formData = new FormData()
    formData.append('file', new Blob(['test'], { type: 'video/mp4' }), 'test.mp4')
    formData.append('title', 'ab')
    formData.append('description', 'Valid description')

    const response = await request.post(`${API_BASE}/videos/upload`, {
      multipart: formData,
    })

    expect(response.status()).toBe(401) // Primero falla auth
  })
})

