import { test, expect } from '@playwright/test'

/**
 * Test de flujo completo end-to-end
 */
test.describe('Integration: Full Flow', () => {
  test('flujo completo de usuario nuevo', async ({ page }) => {
    // 1. Landing page
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('VLOCKSTER')

    // 2. Navegar a signup
    await page.click('a[href="/signup"]')
    await expect(page).toHaveURL(/\/signup/)

    // 3. Navegar a login
    await page.goto('/login')
    await expect(page).toHaveURL(/\/login/)

    // 4. Explorar contenido público
    await page.goto('/watch')
    await expect(page).toHaveURL(/\/watch/)

    await page.goto('/projects')
    await expect(page).toHaveURL(/\/projects/)

    await page.goto('/community')
    await expect(page).toHaveURL(/\/community/)
  })

  test('navegación entre páginas legales', async ({ page }) => {
    await page.goto('/')
    
    // Ir a términos
    await page.click('a[href="/legal/terms"]')
    await expect(page).toHaveURL(/\/legal\/terms/)
    await expect(page.locator('h1')).toContainText('Términos')

    // Volver al inicio
    await page.click('a[href="/"]')
    await expect(page).toHaveURL('/')

    // Ir a privacidad
    await page.click('a[href="/legal/privacy"]')
    await expect(page).toHaveURL(/\/legal\/privacy/)
    await expect(page.locator('h1')).toContainText('Privacidad')
  })
})

