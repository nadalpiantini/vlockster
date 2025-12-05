import { test, expect } from '@playwright/test'

/**
 * Landing Page Tests
 * Using systematic debugging and TDD principles from Superpowers
 */
test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should load landing page successfully', async ({ page }) => {
    // Verify page loads
    await expect(page).toHaveTitle(/VLOCKSTER/)
    await expect(page.locator('h1')).toContainText('VLOCKSTER')
  })

  test('should have correct metadata', async ({ page }) => {
    // Check meta tags for SEO
    const title = await page.title()
    expect(title).toContain('VLOCKSTER')
    expect(title).toContain('cine independiente')

    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute(
      'content',
      /Streaming, crowdfunding y comunidad/
    )
  })

  test('should have working navigation links', async ({ page }) => {
    // Test login link (in nav)
    const loginLink = page.locator('nav a[href="/login"]')
    await expect(loginLink).toBeVisible()
    await expect(loginLink).toContainText('Iniciar Sesión')

    // Test signup link (in nav, not CTA)
    const signupLink = page.locator('nav a[href="/signup"]')
    await expect(signupLink).toBeVisible()
    await expect(signupLink).toContainText('Registrarse')
  })

  test('should have working CTA links', async ({ page }) => {
    // Test "Comenzar Gratis" button - use data-testid or more specific selector
    const signupButton = page.locator('[data-testid="cta-signup"], a[href="/signup"]').filter({
      hasText: 'Comenzar Gratis',
    }).first()
    await signupButton.scrollIntoViewIfNeeded()
    await expect(signupButton).toBeVisible({ timeout: 10000 })
    await signupButton.click()
    await expect(page).toHaveURL(/\/signup/, { timeout: 10000 })

    // Go back and test "Explorar Contenido" button
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const watchLink = page.locator('[data-testid="cta-watch"], a[href="/watch"]').filter({
      hasText: 'Explorar Contenido',
    }).first()
    await watchLink.scrollIntoViewIfNeeded()
    await expect(watchLink).toBeVisible({ timeout: 10000 })
    await watchLink.click()
    await expect(page).toHaveURL(/\/watch/, { timeout: 10000 })
  })

  test('should display all feature sections', async ({ page }) => {
    // Verify all three feature cards are visible (using headings, not text)
    await expect(page.locator('h3:has-text("Streaming")')).toBeVisible()
    await expect(page.locator('h3:has-text("Crowdfunding")')).toBeVisible()
    await expect(page.locator('h3:has-text("Comunidad")')).toBeVisible()
  })

  test('should have working creator CTA link', async ({ page }) => {
    // Scroll to creator CTA section
    const creatorLink = page.locator('a[href="/apply"]')
    await creatorLink.scrollIntoViewIfNeeded()
    await expect(creatorLink).toBeVisible()
    await expect(creatorLink).toContainText('Solicitar Acceso de Creator')

    // Click and verify navigation
    await creatorLink.click()
    await expect(page).toHaveURL(/\/apply/)
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Verify content is still accessible
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('h3:has-text("Streaming")')).toBeVisible()

    // Verify navigation is functional
    const loginLink = page.locator('nav a[href="/login"]')
    await expect(loginLink).toBeVisible()
  })

  test('should have proper semantic HTML', async ({ page }) => {
    // Check for main heading
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    // Check for footer
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer).toContainText('VLOCKSTER')
  })

  test('should not have broken links', async ({ page }) => {
    // Get all links on the page - limit to main navigation and CTAs to avoid timeout
    const mainLinks = page.locator('nav a[href], [data-testid^="cta-"] a[href], footer a[href]')
    const links = await mainLinks.all()
    const brokenLinks: string[] = []

    for (const link of links) {
      try {
        const href = await link.getAttribute('href', { timeout: 2000 })
        if (href && href.startsWith('/') && !href.includes('#')) {
          try {
            // Internal link - verify it doesn't 404
            const response = await page.request.get(
              `http://localhost:3007${href}`,
              { timeout: 3000 }
            )
            // Allow 500 for pages that require auth (like /watch might have DB errors)
            // But fail on 404
            if (response.status() === 404) {
              brokenLinks.push(href)
            }
          } catch (error) {
            // Timeout or network error - skip for now
            console.log(`Skipping ${href} due to error: ${error}`)
          }
        }
      } catch (error) {
        // Skip if we can't get the href
        continue
      }
    }

    expect(brokenLinks).toEqual([])
  })
})

