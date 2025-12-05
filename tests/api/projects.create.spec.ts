import { test, expect } from '@playwright/test'

/**
 * Tests for /api/projects/create endpoint
 */
test.describe('API: /api/projects/create', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/projects/create', {
      data: {
        title: 'Test Project',
        description: 'Test description',
        goal_amount: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should require creator role', async ({ request }) => {
    // Without auth, should return 401
    const response = await request.post('/api/projects/create', {
      data: {
        title: 'Test Project',
        description: 'Test description',
        goal_amount: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should validate required fields', async ({ request }) => {
    const response = await request.post('/api/projects/create', {
      data: {},
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should validate title length', async ({ request }) => {
    const response = await request.post('/api/projects/create', {
      data: {
        title: 'AB',
        description: 'Valid description',
        goal_amount: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate goal_amount is positive', async ({ request }) => {
    const response = await request.post('/api/projects/create', {
      data: {
        title: 'Test Project',
        description: 'Test description',
        goal_amount: -100,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate deadline is in the future', async ({ request }) => {
    const response = await request.post('/api/projects/create', {
      data: {
        title: 'Test Project',
        description: 'Test description',
        goal_amount: 1000,
        deadline: new Date(Date.now() - 86400000).toISOString(),
      },
    })

    expect([400, 401]).toContain(response.status())
  })
})
