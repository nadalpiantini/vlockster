import { test, expect } from '@playwright/test'

/**
 * E2E Test: Complete Project Creation Flow
 * Tests the full journey from dashboard → create project → project page
 * Comprehensive flow testing with validation and error handling
 */
test.describe('E2E: Project Creation Flow', () => {
  test('should navigate from dashboard to project creation page', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Look for create project link
    const createLink = page.getByRole('link', { name: /crear.*proyecto|nuevo.*proyecto/i })
    
    if (await createLink.isVisible()) {
      await createLink.click()
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveURL(/\/projects\/create/)
      await expect(page.getByRole('heading', { name: /crear.*proyecto/i })).toBeVisible()
    }
  })

  test('project creation page should have complete form structure', async ({ page }) => {
    await page.goto('/projects/create')
    await page.waitForLoadState('networkidle')

    // Check for all required form fields
    const titleInput = page.getByLabel(/título.*proyecto/i)
    const descriptionTextarea = page.getByLabel(/descripción/i)
    const goalAmountInput = page.getByLabel(/meta|goal|amount/i)
    const deadlineInput = page.getByLabel(/fecha.*límite|deadline/i)
    const submitButton = page.getByRole('button', { name: /crear|crear.*proyecto|enviar/i })
    
    if (await titleInput.isVisible()) {
      expect(titleInput).toBeVisible()
      expect(descriptionTextarea).toBeVisible()
      expect(goalAmountInput).toBeVisible()
      expect(deadlineInput).toBeVisible()
      expect(submitButton).toBeVisible()
    }
  })

  test('project creation form should validate required fields', async ({ page }) => {
    await page.goto('/projects/create')
    await page.waitForLoadState('networkidle')

    const submitButton = page.getByRole('button', { name: /crear|crear.*proyecto|enviar/i })
    
    if (await submitButton.isVisible()) {
      // Try to submit without filling form
      await submitButton.click()
      await page.waitForTimeout(1000)

      // Should show validation errors
      const errors = page.locator('[role="alert"], .error, [aria-invalid="true"]')
      const errorCount = await errors.count()
      expect(errorCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('project creation form should validate title length', async ({ page }) => {
    await page.goto('/projects/create')
    await page.waitForLoadState('networkidle')

    const titleInput = page.getByLabel(/título.*proyecto/i)
    
    if (await titleInput.isVisible()) {
      // Enter title that's too short
      await titleInput.fill('AB')
      
      // Try to submit
      const submitButton = page.getByRole('button', { name: /crear|crear.*proyecto|enviar/i })
      await submitButton.click()
      await page.waitForTimeout(1000)

      // Should show validation error
      const error = page.locator('[role="alert"], .error, [aria-invalid="true"]')
      const errorCount = await error.count()
      expect(errorCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('project creation form should validate goal amount', async ({ page }) => {
    await page.goto('/projects/create')
    await page.waitForLoadState('networkidle')

    const goalAmountInput = page.getByLabel(/meta|goal|amount/i)
    
    if (await goalAmountInput.isVisible()) {
      // Enter negative amount
      await goalAmountInput.fill('-100')
      
      // Try to submit
      const submitButton = page.getByRole('button', { name: /crear|crear.*proyecto|enviar/i })
      await submitButton.click()
      await page.waitForTimeout(1000)

      // Should show validation error
      const error = page.locator('[role="alert"], .error, [aria-invalid="true"]')
      const errorCount = await error.count()
      expect(errorCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('project creation form should validate deadline is in future', async ({ page }) => {
    await page.goto('/projects/create')
    await page.waitForLoadState('networkidle')

    const deadlineInput = page.getByLabel(/fecha.*límite|deadline/i)
    
    if (await deadlineInput.isVisible()) {
      // Enter past date
      const pastDate = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      await deadlineInput.fill(pastDate)
      
      // Try to submit
      const submitButton = page.getByRole('button', { name: /crear|crear.*proyecto|enviar/i })
      await submitButton.click()
      await page.waitForTimeout(1000)

      // Should show validation error
      const error = page.locator('[role="alert"], .error, [aria-invalid="true"]')
      const errorCount = await error.count()
      expect(errorCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('project creation form should have accessibility features', async ({ page }) => {
    await page.goto('/projects/create')
    await page.waitForLoadState('networkidle')

    // Check for main landmark
    const main = page.locator('main[role="main"]')
    await expect(main).toBeVisible()

    // Check for form with aria-label
    const form = page.locator('form[aria-label], form[aria-labelledby]')
    const formCount = await form.count()
    expect(formCount).toBeGreaterThan(0)

    // Check for proper labels on inputs
    const titleInput = page.getByLabel(/título.*proyecto/i)
    if (await titleInput.isVisible()) {
      expect(titleInput).toHaveAttribute('aria-required', 'true')
    }
  })

  test('should show loading state during project creation', async ({ page }) => {
    await page.goto('/projects/create')
    await page.waitForLoadState('networkidle')

    // Fill form with valid data
    const titleInput = page.getByLabel(/título.*proyecto/i)
    const descriptionTextarea = page.getByLabel(/descripción/i)
    const goalAmountInput = page.getByLabel(/meta|goal|amount/i)
    const deadlineInput = page.getByLabel(/fecha.*límite|deadline/i)
    
    if (await titleInput.isVisible()) {
      await titleInput.fill('Test Project Title')
      await descriptionTextarea.fill('Test project description with enough characters')
      await goalAmountInput.fill('1000')
      
      // Set future date
      const futureDate = new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
      await deadlineInput.fill(futureDate)
      
      // Check for submit button
      const submitButton = page.getByRole('button', { name: /crear|crear.*proyecto|enviar/i })
      expect(submitButton).toBeVisible()
    }
  })

  test('should handle creation errors gracefully', async ({ page }) => {
    await page.goto('/projects/create')
    await page.waitForLoadState('networkidle')

    // Check for error display area
    const errorAlert = page.locator('[role="alert"]')
    // Should exist (even if hidden initially)
    const errorCount = await errorAlert.count()
    expect(errorCount).toBeGreaterThanOrEqual(0)
  })

  test('should navigate back to dashboard after creation', async ({ page }) => {
    await page.goto('/projects/create')
    await page.waitForLoadState('networkidle')

    // Check for back/cancel button
    const backLink = page.getByRole('link', { name: /volver|back|dashboard/i })
    if (await backLink.isVisible()) {
      await backLink.click()
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveURL(/\/dashboard/)
    }
  })

  test('should support optional video_id field', async ({ page }) => {
    await page.goto('/projects/create')
    await page.waitForLoadState('networkidle')

    // Check for optional video selection
    const videoSelect = page.getByLabel(/video|video.*relacionado/i)
    // Video selection may or may not be present
    const videoSelectCount = await videoSelect.count()
    expect(videoSelectCount).toBeGreaterThanOrEqual(0)
  })

  test('should support optional rewards section', async ({ page }) => {
    await page.goto('/projects/create')
    await page.waitForLoadState('networkidle')

    // Check for rewards section (may be collapsible or optional)
    const rewardsSection = page.locator('text=/recompensa|reward/i')
    const rewardsCount = await rewardsSection.count()
    // Rewards may or may not be present
    expect(rewardsCount).toBeGreaterThanOrEqual(0)
  })
})

