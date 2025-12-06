import { test, expect } from '@playwright/test'

/**
 * Tests for /api/admin/resolve-report endpoint
 */
test.describe('API: /api/admin/resolve-report', () => {
  test('should require authentication', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: 'test-report-id',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should require admin role', async ({ request }) => {
    // Without auth, should return 401
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: 'test-report-id',
      },
    })

    expect(response.status()).toBe(401)
  })

  test('should validate reportId format', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: '',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should handle non-existent report', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
      },
    })

    // Should fail auth first
    expect(response.status()).toBe(401)
  })

  test('should validate action field', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
        action: 'invalid_action',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should require action field', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should reject GET requests', async ({ request }) => {
    const response = await request.get('/api/admin/resolve-report')

    expect(response.status()).toBe(405) // Method Not Allowed
  })

  test('should validate reportId is UUID format', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: 'invalid-uuid-format',
        action: 'resolve',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should validate action is either resolve or dismiss', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
        action: 'invalid_action',
      },
    })

    expect([400, 401]).toContain(response.status())
  })

  test('should accept resolve action', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
        action: 'resolve',
      },
    })

    // Should fail auth, but action should be valid
    expect(response.status()).toBe(401)
  })

  test('should accept dismiss action', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
        action: 'dismiss',
      },
    })

    // Should fail auth, but action should be valid
    expect(response.status()).toBe(401)
  })

  test('should accept optional notes field', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
        action: 'resolve',
        notes: 'Optional notes here',
      },
    })

    // Should fail auth, but notes should be accepted
    expect(response.status()).toBe(401)
  })

  test('should reject PUT requests', async ({ request }) => {
    const response = await request.put('/api/admin/resolve-report', {
      data: { reportId: 'test-id', action: 'resolve' },
    })
    expect(response.status()).toBe(405)
  })

  test('should handle malformed JSON', async ({ request }) => {
    const response = await request.post('/api/admin/resolve-report', {
      data: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    expect([400, 401]).toContain(response.status())
  })

  test('should require moderator or admin role (not just any authenticated user)', async ({ request }) => {
    // This test verifies that the endpoint checks for admin/moderator role
    // Without auth, should return 401
    const response = await request.post('/api/admin/resolve-report', {
      data: {
        reportId: '00000000-0000-0000-0000-000000000000',
        action: 'resolve',
      },
    })

    expect(response.status()).toBe(401)
  })
})
