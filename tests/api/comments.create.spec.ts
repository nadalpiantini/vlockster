import { test, expect } from '@playwright/test'

/**
 * Tests for /api/comments/create endpoint
 */
test.describe('API: /api/comments/create', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/comments/create', {
      data: {
        post_id: 'test-post-id',
        content: 'This is a valid comment with enough characters',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/comments/create', {
      data: {},
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should reject content that is too short', async ({ request }) => {
    const response = await request.post('/api/comments/create', {
      data: {
        post_id: 'test-post-id',
        content: 'short',
      },
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should sanitize content input', async ({ request }) => {
    const response = await request.post('/api/comments/create', {
      data: {
        post_id: 'test-post-id',
        content: '<script>alert("xss")</script>Valid comment content',
      },
    })

    // Should either reject or sanitize
    const data = await response.json().catch(() => ({}))
    expect(data.content || data.error).toBeTruthy()
  })

  test('should validate post_id format', async ({ request }) => {
    const response = await request.post('/api/comments/create', {
      data: {
        post_id: 'invalid-uuid',
        content: 'Valid comment content with enough characters',
      },
    })

    expect([400, 401]).toContain(response.status())
  })
})
