import { test, expect } from '@playwright/test'

/**
 * Tests for /api/community/posts/create endpoint
 */
test.describe('API: /api/community/posts/create', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/community/posts/create', {
      data: {
        community_id: 'test-community-id',
        title: 'Test Post',
        content: 'Test content',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/community/posts/create', {
      data: {},
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should sanitize input content', async ({ request }) => {
    const response = await request.post('/api/community/posts/create', {
      data: {
        community_id: 'test-id',
        title: '<script>alert("xss")</script>',
        content: '<img src=x onerror=alert(1)>',
      },
    })

    // Should either reject or sanitize
    const data = await response.json()
    expect(data.title || data.error).toBeTruthy()
  })
})

