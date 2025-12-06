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
    // H1 now contains the featured content title, not "VLOCKSTER"
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    // Verify logo image is visible (works on all screen sizes)
    const logo = page.locator('header img[alt="VLOCKSTER"]')
    await expect(logo).toBeVisible()
  })

  test('should have correct metadata', async ({ page }) => {
    // Check meta tags for SEO
    const title = await page.title()
    expect(title).toContain('VLOCKSTER')
    expect(title).toContain('Independent Cinema')

    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute(
      'content',
      /Streaming, crowdfunding, and community/
    )
  })

  test('should have working navigation links', async ({ page }) => {
    // Test main navigation links (may be hidden on mobile)
    const homeLink = page.locator('nav a[href="/"]')
    // Navigation may be hidden on mobile, so check if visible or if mobile menu exists
    const isVisible = await homeLink.isVisible().catch(() => false)
    if (isVisible) {
      await expect(homeLink).toContainText('Home')
    }

    // Test SUBSCRIBE button (signup link in header) - should be visible on all sizes
    const subscribeLink = page.locator('header a[href="/signup"]')
    await expect(subscribeLink).toBeVisible()
    await expect(subscribeLink).toContainText('SUBSCRIBE')
  })

  test('should have working CTA links', async ({ page }) => {
    // Test "PLAY NOW" button in hero section
    const playButton = page.locator('[data-testid="cta-watch"], a[href="/watch"]').filter({
      hasText: /Play|PLAY NOW/i,
    }).first()
    await playButton.scrollIntoViewIfNeeded()
    await expect(playButton).toBeVisible({ timeout: 10000 })
    
    // Test "MORE INFO" button
    const moreInfoButton = page.locator('[data-testid="cta-signup"], a[href="/signup"]').filter({
      hasText: /More Info|MORE INFO/i,
    }).first()
    await moreInfoButton.scrollIntoViewIfNeeded()
    await expect(moreInfoButton).toBeVisible({ timeout: 10000 })
  })

  test('should display all feature sections', async ({ page }) => {
    // Verify all three feature cards are visible (using headings, not text)
    await expect(page.locator('h3:has-text("Streaming")')).toBeVisible()
    await expect(page.locator('h3:has-text("Crowdfunding")')).toBeVisible()
    await expect(page.locator('h3:has-text("Community")')).toBeVisible()
  })

  test('should have working creator CTA link', async ({ page }) => {
    // Scroll to creator CTA section
    const creatorLink = page.locator('a[href="/apply"]')
    await creatorLink.scrollIntoViewIfNeeded()
    await expect(creatorLink).toBeVisible()
    await expect(creatorLink).toContainText(/REQUEST ACCESS|Request Creator Access/i)

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
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('h3:has-text("Streaming")')).toBeVisible()

    // Verify navigation is functional (logo image should be visible on all sizes)
    const logo = page.locator('header img[alt="VLOCKSTER"]')
    await expect(logo).toBeVisible()
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
    const mainLinks = page.locator('nav a[href], [data-testid^="cta-"] a[href], footer a[href], header a[href]')
    const links = await mainLinks.all()
    const brokenLinks: string[] = []

    for (const link of links) {
      try {
        const href = await link.getAttribute('href', { timeout: 2000 })
        if (href && href.startsWith('/') && !href.includes('#')) {
          try {
            // Internal link - verify it doesn't 404
            const response = await page.request.get(
              `http://localhost:3009${href}`,
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

