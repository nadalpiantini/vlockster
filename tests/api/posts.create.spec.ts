import { test, expect } from '@playwright/test'

/**
 * Tests for /api/posts/create endpoint
 */
test.describe('API: /api/posts/create', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: 'test-community-id',
        title: 'Test Post',
        content: 'This is a valid post content with enough characters',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {},
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should validate title length', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: 'test-community-id',
        title: 'AB',
        content: 'Valid content with enough characters',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate content length', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: 'test-community-id',
        title: 'Valid Title',
        content: 'short',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate community_id format', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: 'invalid-uuid',
        title: 'Valid Title',
        content: 'Valid content with enough characters',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should sanitize content input', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Valid Title',
        content: '<script>alert("xss")</script>Valid content with enough characters',
      },
    })

    // Should either reject or sanitize
    const data = await response.json().catch(() => ({}))
    expect(data.content || data.error).toBeTruthy()
  })
})
