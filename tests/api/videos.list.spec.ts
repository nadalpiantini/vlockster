import { test, expect } from '@playwright/test'

/**
 * Tests for /api/videos endpoint (GET - list videos)
 */
test.describe('API: /api/videos', () => {
  test('should return list of public videos', async ({ request }) => {
    const response = await request.get('/api/videos?page=1&limit=10')
    
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('videos')
    expect(Array.isArray(data.videos)).toBe(true)
  })

  test('should handle pagination parameters', async ({ request }) => {
    const response = await request.get('/api/videos?page=2&limit=5')
    
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('pagination')
  })

  test('should filter by visibility=public by default', async ({ request }) => {
    const response = await request.get('/api/videos')
    
    expect(response.status()).toBe(200)
    const data = await response.json()
    // All returned videos should be public
    data.videos?.forEach((video: any) => {
      expect(video.visibility).toBe('public')
    })
  })

  test('should handle invalid page parameter', async ({ request }) => {
    const response = await request.get('/api/videos?page=-1')
    
    // Should either return 400 or default to page 1
    expect([200, 400]).toContain(response.status())
  })

  test('should handle invalid limit parameter', async ({ request }) => {
    const response = await request.get('/api/videos?limit=0')
    
    // Should either return 400 or use default limit
    expect([200, 400]).toContain(response.status())
  })
})

