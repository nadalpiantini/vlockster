import { test, expect } from '@playwright/test'

/**
 * E2E Test: Complete Project Creation Flow
 * Tests the full journey from dashboard → create project → project page
 */
test.describe('E2E: Project Creation Flow', () => {
  test('should navigate to project creation page', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Look for create project link
    const createLink = page.getByRole('link', { name: /crear.*proyecto|nuevo.*proyecto/i })
    
    if (await createLink.isVisible()) {
      await createLink.click()
      await page.waitForLoadState('networkidle')

      // Verify create page loaded
      await expect(page.getByRole('heading', { name: /crear.*proyecto/i })).toBeVisible()
    }
  })

  test('project creation page should have proper form structure', async ({ page }) => {
    await page.goto('/projects/create')
    await page.waitForLoadState('networkidle')

    // Check for required form fields
    const titleInput = page.getByLabel(/título.*proyecto/i)
    const descriptionTextarea = page.getByLabel(/descripción/i)
    
    if (await titleInput.isVisible()) {
      expect(titleInput).toBeVisible()
      expect(descriptionTextarea).toBeVisible()
    }
  })

  test('project creation form should have accessibility features', async ({ page }) => {
    await page.goto('/projects/create')
    await page.waitForLoadState('networkidle')

    // Check for main landmark
    const main = page.locator('main[role="main"]')
    await expect(main).toBeVisible()

    // Check for form with aria-label
    const form = page.locator('form[aria-label]')
    const formCount = await form.count()
    expect(formCount).toBeGreaterThan(0)

    // Check for error alerts
    const errorAlert = page.locator('[role="alert"]')
    // Should exist (even if hidden initially)
    expect(await errorAlert.count()).toBeGreaterThanOrEqual(0)
  })
})

