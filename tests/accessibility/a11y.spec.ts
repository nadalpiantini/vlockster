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
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  })

  test('Signup page should have no accessibility violations', async ({ page }) => {
    await page.goto('/signup')
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  })

  test('Dashboard page should have no accessibility violations', async ({ page }) => {
    await page.goto('/dashboard')
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  })

  test('Watch page should have no accessibility violations', async ({ page }) => {
    await page.goto('/watch')
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  })

  test('Projects page should have no accessibility violations', async ({ page }) => {
    await page.goto('/projects')
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  })

  test('Community page should have no accessibility violations', async ({ page }) => {
    await page.goto('/community')
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  })

  test('Upload page should have no accessibility violations', async ({ page }) => {
    await page.goto('/upload')
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  })

  test('Privacy page should have no accessibility violations', async ({ page }) => {
    await page.goto('/legal/privacy')
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  })

  test('Terms page should have no accessibility violations', async ({ page }) => {
    await page.goto('/legal/terms')
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  })

  test('Color contrast should meet WCAG AA standards', async ({ page }) => {
    await page.goto('/')
    const violations = await getViolations(page, {
      rules: {
        'color-contrast': { enabled: true },
      },
    })
    
    // Filter only color contrast violations
    const colorContrastViolations = violations.filter(
      (v) => v.id === 'color-contrast'
    )
    
    expect(colorContrastViolations.length).toBe(0)
  })

  test('All images should have alt text', async ({ page }) => {
    await page.goto('/')
    const violations = await getViolations(page, {
      rules: {
        'image-alt': { enabled: true },
      },
    })
    
    const imageViolations = violations.filter((v) => v.id === 'image-alt')
    expect(imageViolations.length).toBe(0)
  })

  test('All form inputs should have labels', async ({ page }) => {
    await page.goto('/login')
    const violations = await getViolations(page, {
      rules: {
        'label': { enabled: true },
      },
    })
    
    const labelViolations = violations.filter((v) => v.id === 'label')
    expect(labelViolations.length).toBe(0)
  })

  test('All interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/')
    const violations = await getViolations(page, {
      rules: {
        'keyboard': { enabled: true },
      },
    })
    
    const keyboardViolations = violations.filter((v) => v.id === 'keyboard')
    expect(keyboardViolations.length).toBe(0)
  })

  test('ARIA attributes should be used correctly', async ({ page }) => {
    await page.goto('/dashboard')
    const violations = await getViolations(page, {
      rules: {
        'aria-allowed-attr': { enabled: true },
        'aria-required-attr': { enabled: true },
        'aria-valid-attr-value': { enabled: true },
      },
    })
    
    expect(violations.length).toBe(0)
  })
})
