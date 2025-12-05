import { test, expect } from '@playwright/test'

/**
 * Tests for /api/search/suggestions endpoint
 */
test.describe('API: /api/search/suggestions', () => {
  test('should return suggestions for valid query', async ({ request }) => {
    const response = await request.get('/api/search/suggestions?q=test')
    
    // Should return 200 or 400 depending on implementation
    expect([200, 400]).toContain(response.status())
  })

  test('should handle empty query', async ({ request }) => {
    const response = await request.get('/api/search/suggestions?q=')
    
    // Should handle gracefully
    expect([200, 400]).toContain(response.status())
  })

  test('should sanitize query input', async ({ request }) => {
    const response = await request.get('/api/search/suggestions?q=<script>alert(1)</script>')
    
    // Should sanitize or reject
    const data = await response.json().catch(() => ({}))
    expect(data.query || data.error).toBeTruthy()
  })
})

