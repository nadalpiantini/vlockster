import { test, expect } from '@playwright/test'

/**
 * Tests de accesibilidad básicos
 */
test.describe('Accessibility: Basic Checks', () => {
  test('debe tener un título de página', async ({ page }) => {
    await page.goto('/')
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })

  test('debe tener un h1 en la página principal', async ({ page }) => {
    await page.goto('/')
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
  })

  test('debe tener navegación con role="navigation"', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav[role="navigation"]')
    await expect(nav).toBeVisible()
  })

  test('debe tener main con role="main"', async ({ page }) => {
    await page.goto('/')
    const main = page.locator('main[role="main"]')
    await expect(main).toBeVisible()
  })

  test('links deben tener aria-label o texto descriptivo', async ({ page }) => {
    await page.goto('/')
    const links = page.locator('a')

    const linkCount = await links.count()
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = links.nth(i)
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')

      // Debe tener texto o aria-label
      expect(text || ariaLabel).toBeTruthy()
    }
  })

  test('imágenes deben tener alt text', async ({ page }) => {
    await page.goto('/watch')
    await page.waitForLoadState('networkidle')

    const images = page.locator('img')
    const imageCount = await images.count()

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      // Alt puede ser string vacío si es decorativa, pero debe existir
      expect(alt).not.toBeNull()
    }
  })
})

