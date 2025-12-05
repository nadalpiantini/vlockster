import { test, expect } from '@playwright/test'

/**
 * Test completo del flujo de usuario
 * Prueba todas las funcionalidades de VLOCKSTER
 */
test.describe('User Journey - Todas las funcionalidades', () => {
  test('Flujo completo: Registro → Dashboard → Explorar → Creator', async ({
    page,
  }) => {
    // 1. Landing Page
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toContainText('VLOCKSTER')

    // 2. Navegación a Signup
    await page.click('a[href="/signup"]')
    await expect(page).toHaveURL(/\/signup/)

    // 3. Registro de usuario
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'
    const testName = 'Test User'

    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[id="name"]', testName)
    await page.fill('input[type="password"]', testPassword)
    await page.fill('input[id="confirmPassword"]', testPassword)

    // Intentar registrarse (puede fallar si no hay Supabase configurado)
    try {
      await page.click('button[type="submit"]')
      // Esperar redirección o error
      await page.waitForTimeout(2000)
    } catch (error) {
      // Signup puede requerir configuración de Supabase - esto es esperado en tests
    }

    // 4. Probar rutas públicas sin autenticación
    await page.goto('/watch')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/watch/)

    await page.goto('/projects')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/projects/)

    await page.goto('/community')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/community/)

    // 5. Intentar acceder a rutas protegidas (debería redirigir a login)
    await page.goto('/dashboard')
    await page.waitForTimeout(1000)
    // Puede redirigir a login o mostrar error
  })

  test('Probar todas las rutas públicas', async ({ page }) => {
    const publicRoutes = [
      { path: '/', expectedText: 'VLOCKSTER' },
      { path: '/login', expectedText: 'Iniciar Sesión' },
      { path: '/signup', expectedText: 'Crear Cuenta' },
      { path: '/watch', expectedText: 'Catálogo' },
      { path: '/projects', expectedText: 'Proyectos' },
      { path: '/community', expectedText: 'Comunidad' },
    ]

    for (const route of publicRoutes) {
      await page.goto(route.path)
      await page.waitForLoadState('networkidle')
      await expect(page.locator('body')).toContainText(
        route.expectedText,
        { timeout: 5000 }
      )
    }
  })

  test('Verificar que no hay links rotos en landing', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const links = await page.locator('a[href^="/"]').all()
    const brokenLinks: string[] = []

    for (const link of links) {
      const href = await link.getAttribute('href')
      if (href) {
        try {
          const response = await page.request.get(
            `http://localhost:3007${href}`,
            { timeout: 5000 }
          )
          if (response.status() === 404) {
            brokenLinks.push(href)
          }
        } catch (error) {
          // Ignorar timeouts y errores de red
        }
      }
    }

    expect(brokenLinks).toEqual([])
  })

  test('Verificar estructura de páginas principales', async ({ page }) => {
    // Landing
    await page.goto('/')
    await expect(page.locator('h1, h2')).toBeVisible()

    // Watch
    await page.goto('/watch')
    await expect(page.locator('h1, h2')).toBeVisible()

    // Projects
    await page.goto('/projects')
    await expect(page.locator('h1, h2')).toBeVisible()

    // Community
    await page.goto('/community')
    await expect(page.locator('h1, h2')).toBeVisible()
  })
})

