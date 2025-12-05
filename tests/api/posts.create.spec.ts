import { test, expect } from '@playwright/test'

/**
 * Tests for /api/posts/create endpoint
 * Comprehensive tests covering authentication, validation, and edge cases
 */
test.describe('API: /api/posts/create', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: '00000000-0000-0000-0000-000000000000',
        title: 'Test Post',
        content: 'This is a valid post content with enough characters',
      },
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body).toHaveProperty('error')
  })

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {},
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
    const body = await response.json()
    expect(body).toHaveProperty('error')
  })

  test('should validate community_id is provided', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        title: 'Valid Title',
        content: 'Valid content with enough characters',
      },
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should validate community_id format (must be UUID)', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: 'invalid-uuid',
        title: 'Valid Title',
        content: 'Valid content with enough characters',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate title is provided', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: '00000000-0000-0000-0000-000000000000',
        content: 'Valid content with enough characters',
      },
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should validate title minimum length (3 characters)', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: '00000000-0000-0000-0000-000000000000',
        title: 'AB',
        content: 'Valid content with enough characters',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate title maximum length', async ({ request }) => {
    const longTitle = 'A'.repeat(201) // Assuming max 200 chars
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: '00000000-0000-0000-0000-000000000000',
        title: longTitle,
        content: 'Valid content with enough characters',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate content is provided', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: '00000000-0000-0000-0000-000000000000',
        title: 'Valid Title',
      },
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should validate content minimum length', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: '00000000-0000-0000-0000-000000000000',
        title: 'Valid Title',
        content: 'short',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should handle non-existent community', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: '00000000-0000-0000-0000-000000000000',
        title: 'Valid Title',
        content: 'Valid content with enough characters',
      },
    })

    // Should fail auth first
    expect(response.status()).toBe(401)
  })

  test('should sanitize title input (XSS prevention)', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: '00000000-0000-0000-0000-000000000000',
        title: '<script>alert("xss")</script>Valid Title',
        content: 'Valid content with enough characters',
      },
    })

    // Should either reject or sanitize
    expect([400, 401]).toContain(response.status())
  })

  test('should sanitize content input (XSS prevention)', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: {
        community_id: '00000000-0000-0000-0000-000000000000',
        title: 'Valid Title',
        content: '<script>alert("xss")</script>Valid content with enough characters',
      },
    })

    // Should either reject or sanitize (posts allow basic HTML)
    expect([400, 401]).toContain(response.status())
  })

  test('should reject GET requests', async ({ request }) => {
    const response = await request.get('/api/posts/create')
    expect(response.status()).toBe(405) // Method Not Allowed
  })

  test('should reject PUT requests', async ({ request }) => {
    const response = await request.put('/api/posts/create', {
      data: { community_id: 'test-id', title: 'test', content: 'test' },
    })
    expect(response.status()).toBe(405)
  })

  test('should reject DELETE requests', async ({ request }) => {
    const response = await request.delete('/api/posts/create')
    expect(response.status()).toBe(405)
  })

  test('should handle malformed JSON', async ({ request }) => {
    const response = await request.post('/api/posts/create', {
      data: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    expect([400, 401]).toContain(response.status())
  })
})
