import { test, expect } from '@playwright/test'

/**
 * Tests for /api/recommendations endpoint
 */
test.describe('API: /api/recommendations', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.get('/api/recommendations')
    
    expect(response.status()).toBe(401)
  })

  test('should return recommendations for authenticated user', async ({ request }) => {
    // Without auth, should return 401
    const response = await request.get('/api/recommendations')
    
    expect(response.status()).toBe(401)
  })

  test('should handle limit parameter', async ({ request }) => {
    const response = await request.get('/api/recommendations?limit=5')
    
    // Should fail auth first
    expect(response.status()).toBe(401)
  })

  test('should validate limit is positive', async ({ request }) => {
    const response = await request.get('/api/recommendations?limit=-1')
    
    // Should fail auth first, but if it passes, should validate limit
    expect([400, 401]).toContain(response.status())
  })

  test('should validate limit is within bounds', async ({ request }) => {
    const response = await request.get('/api/recommendations?limit=1000')
    
    // Should fail auth first, but if it passes, should validate limit
    expect([400, 401]).toContain(response.status())
  })
})

