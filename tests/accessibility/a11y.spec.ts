import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility tests using axe-core
 * Tests WCAG 2.1 AA compliance across key pages
 */
test.describe('Accessibility Tests (WCAG 2.1 AA)', () => {
  test('Landing page should have no accessibility violations', async ({ page }) => {
    await page.goto('/')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Login page should have no accessibility violations', async ({ page }) => {
    await page.goto('/login')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Signup page should have no accessibility violations', async ({ page }) => {
    await page.goto('/signup')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Dashboard page should have no accessibility violations', async ({ page }) => {
    await page.goto('/dashboard')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Watch page should have no accessibility violations', async ({ page }) => {
    await page.goto('/watch')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Projects page should have no accessibility violations', async ({ page }) => {
    await page.goto('/projects')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Community page should have no accessibility violations', async ({ page }) => {
    await page.goto('/community')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Upload page should have no accessibility violations', async ({ page }) => {
    await page.goto('/upload')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Privacy page should have no accessibility violations', async ({ page }) => {
    await page.goto('/legal/privacy')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Terms page should have no accessibility violations', async ({ page }) => {
    await page.goto('/legal/terms')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Color contrast should meet WCAG AA standards', async ({ page }) => {
    await page.goto('/')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .withRules(['color-contrast'])
      .analyze()
    
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    )
    
    expect(colorContrastViolations.length).toBe(0)
  })

  test('All images should have alt text', async ({ page }) => {
    await page.goto('/')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['image-alt'])
      .analyze()
    
    const imageViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'image-alt'
    )
    expect(imageViolations.length).toBe(0)
  })

  test('All form inputs should have labels', async ({ page }) => {
    await page.goto('/login')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['label'])
      .analyze()
    
    const labelViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'label'
    )
    expect(labelViolations.length).toBe(0)
  })

  test('All interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['keyboard'])
      .analyze()
    
    const keyboardViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'keyboard'
    )
    expect(keyboardViolations.length).toBe(0)
  })

  test('ARIA attributes should be used correctly', async ({ page }) => {
    await page.goto('/dashboard')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['aria-allowed-attr', 'aria-required-attr', 'aria-valid-attr-value'])
      .analyze()
    
    expect(accessibilityScanResults.violations.length).toBe(0)
  })
})
