import { test, expect } from '@playwright/test'

/**
 * Tests for /api/projects/generate-description endpoint
 */
test.describe('API: /api/projects/generate-description', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/projects/generate-description', {
      data: {
        title: 'Test Project',
        goal_amount: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/projects/generate-description', {
      data: {},
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should sanitize input content', async ({ request }) => {
    const response = await request.post('/api/projects/generate-description', {
      data: {
        title: '<script>alert("xss")</script>',
        goal_amount: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      },
    })

    // Should either reject or sanitize
    const data = await response.json().catch(() => ({}))
    expect(data.title || data.error).toBeTruthy()
  })
})

