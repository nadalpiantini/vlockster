import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ZodError } from 'zod'
import { handleValidationError, sanitizeContent, handleError, validateAndSanitize } from './api-helpers'

describe('api-helpers', () => {
  describe('handleValidationError', () => {
    it('debe formatear errores de Zod correctamente', async () => {
      const error = new ZodError([
        {
          code: 'too_small',
          minimum: 3,
          type: 'string',
          inclusive: true,
          exact: false,
          message: 'Título debe tener al menos 3 caracteres',
          path: ['title'],
        },
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'string',
          message: 'Expected number, received string',
          path: ['amount'],
        },
      ])

      const response = handleValidationError(error)
      const json = await response.json()

      expect(response.status).toBe(400)
      expect(json.error).toBe('Error de validación')
      expect(json.details).toHaveLength(2)
      expect(json.details[0].field).toBe('title')
      expect(json.details[1].field).toBe('amount')
    })
  })

  describe('sanitizeContent', () => {
    it('debe sanitizar texto sin HTML', () => {
      const input = '<p>Texto</p>'
      const result = sanitizeContent(input, false)
      expect(result).not.toContain('<')
      expect(result).not.toContain('>')
    })

    it('debe permitir HTML básico cuando allowHtml es true', () => {
      const input = '<p>Texto <strong>negrita</strong></p>'
      const result = sanitizeContent(input, true)
      expect(result).toContain('<p>')
      expect(result).toContain('<strong>')
    })

    it('debe eliminar scripts incluso con allowHtml', () => {
      const input = '<p>Texto</p><script>alert("XSS")</script>'
      const result = sanitizeContent(input, true)
      expect(result).not.toContain('<script>')
    })
  })

  describe('handleError', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    it('debe retornar respuesta de error en desarrollo', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const error = new Error('Test error')
      const response = handleError(error, 'Test context')
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json.error).toBe('Error interno del servidor')
      expect(console.error).toHaveBeenCalled()

      process.env.NODE_ENV = originalEnv
    })

    it('debe retornar respuesta de error en producción con errorId', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const error = new Error('Test error')
      const response = handleError(error, 'Test context')
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json.error).toBe('Error interno del servidor')
      expect(json.errorId).toBeDefined()
      expect(console.error).toHaveBeenCalled()

      process.env.NODE_ENV = originalEnv
    })

    it('debe manejar errores sin contexto', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const error = new Error('Test error')
      const response = handleError(error)
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json.error).toBe('Error interno del servidor')

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('validateAndSanitize', () => {
    it('debe sanitizar campos de texto en un objeto', () => {
      const data = {
        title: '<p>Test Title</p>',
        description: '<script>alert("XSS")</script>',
        amount: 100,
      }

      const result = validateAndSanitize(data, ['title', 'description'])

      expect(result.title).not.toContain('<')
      expect(result.description).not.toContain('<script>')
      expect(result.amount).toBe(100) // No debe cambiar
    })

    it('debe mantener campos no especificados sin cambios', () => {
      const data = {
        title: '<p>Test</p>',
        other: '<p>Other</p>',
      }

      const result = validateAndSanitize(data, ['title'])

      expect(result.title).not.toContain('<')
      expect(result.other).toBe('<p>Other</p>') // No sanitizado
    })

    it('debe manejar objetos vacíos', () => {
      const data = {}
      const result = validateAndSanitize(data, [])
      expect(result).toEqual({})
    })
  })
})
