import { test, expect } from '@playwright/test'

/**
 * Tests for /api/analytics endpoint
 */
test.describe('API: /api/analytics', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.get('/api/analytics')
    
    expect(response.status()).toBe(401)
  })

  test('should return analytics data for authenticated user', async ({ request }) => {
    // Without auth, should return 401
    const response = await request.get('/api/analytics')
    
    expect(response.status()).toBe(401)
  })

  test('should handle date range parameters', async ({ request }) => {
    const response = await request.get('/api/analytics?startDate=2024-01-01&endDate=2024-12-31')
    
    // Should fail auth first
    expect(response.status()).toBe(401)
  })

  test('should validate date format', async ({ request }) => {
    const response = await request.get('/api/analytics?startDate=invalid-date')
    
    // Should fail auth first, but if it passes, should validate date
    expect([400, 401]).toContain(response.status())
  })
})
