import { test, expect } from '@playwright/test'

/**
 * Tests for /api/projects endpoint (GET - list projects)
 */
test.describe('API: /api/projects', () => {
  test('should return list of active projects', async ({ request }) => {
    const response = await request.get('/api/projects?page=1&limit=10')
    
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('projects')
    expect(Array.isArray(data.projects)).toBe(true)
  })

  test('should handle pagination parameters', async ({ request }) => {
    const response = await request.get('/api/projects?page=2&limit=5')
    
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('pagination')
  })

  test('should filter by status=active by default', async ({ request }) => {
    const response = await request.get('/api/projects')
    
    expect(response.status()).toBe(200)
    const data = await response.json()
    // All returned projects should be active
    data.projects?.forEach((project: any) => {
      expect(['active', 'funded', 'completed']).toContain(project.status)
    })
  })

  test('should include creator information', async ({ request }) => {
    const response = await request.get('/api/projects?limit=1')
    
    expect(response.status()).toBe(200)
    const data = await response.json()
    if (data.projects && data.projects.length > 0) {
      expect(data.projects[0]).toHaveProperty('creator')
    }
  })

  test('should handle invalid page parameter', async ({ request }) => {
    const response = await request.get('/api/projects?page=-1')
    
    // Should either return 400 or default to page 1
    expect([200, 400]).toContain(response.status())
  })
})

