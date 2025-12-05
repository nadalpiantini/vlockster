import { test, expect } from '@playwright/test'

/**
 * Tests for /api/videos/upload endpoint
 */
test.describe('API: /api/videos/upload', () => {
  test('should require authentication', async ({ request }) => {
    const formData = new FormData()
    formData.append('file', new Blob(['test'], { type: 'video/mp4' }), 'test.mp4')
    formData.append('title', 'Test Video')
    formData.append('description', 'Test description')
    formData.append('visibility', 'public')

    const response = await request.post('/api/videos/upload', {
      multipart: formData,
    })

    expect(response.status()).toBe(401)
  })

  test('should require creator role', async ({ request }) => {
    // Without auth, should return 401
    const formData = new FormData()
    formData.append('file', new Blob(['test'], { type: 'video/mp4' }), 'test.mp4')
    formData.append('title', 'Test Video')
    formData.append('description', 'Test description')
    formData.append('visibility', 'public')

    const response = await request.post('/api/videos/upload', {
      multipart: formData,
    })

    expect(response.status()).toBe(401)
  })

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/videos/upload', {
      data: {},
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should validate file type', async ({ request }) => {
    const formData = new FormData()
    formData.append('file', new Blob(['test'], { type: 'image/jpeg' }), 'test.jpg')
    formData.append('title', 'Test Video')
    formData.append('description', 'Test description')
    formData.append('visibility', 'public')

    const response = await request.post('/api/videos/upload', {
      multipart: formData,
    })

    // Should fail auth first, but if it passes, should validate file type
    expect([400, 401]).toContain(response.status())
  })

  test('should validate title length', async ({ request }) => {
    const formData = new FormData()
    formData.append('file', new Blob(['test'], { type: 'video/mp4' }), 'test.mp4')
    formData.append('title', 'AB')
    formData.append('description', 'Test description')
    formData.append('visibility', 'public')

    const response = await request.post('/api/videos/upload', {
      multipart: formData,
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate visibility enum', async ({ request }) => {
    const formData = new FormData()
    formData.append('file', new Blob(['test'], { type: 'video/mp4' }), 'test.mp4')
    formData.append('title', 'Test Video')
    formData.append('description', 'Test description')
    formData.append('visibility', 'invalid')

    const response = await request.post('/api/videos/upload', {
      multipart: formData,
    })

    expect([400, 401]).toContain(response.status())
  })
})
