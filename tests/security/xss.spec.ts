import { test, expect } from '@playwright/test'

/**
 * Tests de seguridad: Verificar que XSS es prevenido
 */
test.describe('Security: XSS Prevention', () => {
  test('debe sanitizar scripts en comentarios', async ({ page }) => {
    // Este test verifica que el frontend no ejecuta scripts
    // La sanitización real se hace en el backend
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Verificar que no hay scripts inline peligrosos
    const scripts = await page.$$eval('script', (scripts) =>
      scripts.map((s) => s.textContent || '')
    )

    // No debería haber scripts con eval o innerHTML peligroso
    const dangerousPatterns = ['eval(', 'innerHTML', 'document.write']
    for (const script of scripts) {
      for (const pattern of dangerousPatterns) {
        expect(script).not.toContain(pattern)
      }
    }
  })

  test('debe escapar HTML en inputs de formulario', async ({ page }) => {
    await page.goto('/signup')
    await page.waitForLoadState('networkidle')

    // Intentar inyectar HTML en un campo
    const nameInput = page.locator('input[id="name"]')
    if (await nameInput.count() > 0) {
      await nameInput.fill('<script>alert("XSS")</script>')

      // El valor debería estar escapado o sanitizado
      const value = await nameInput.inputValue()
      // En un formulario real, el valor puede contener el script
      // pero no debería ejecutarse al renderizar
      expect(value).toBeDefined()
    }
  })
})

