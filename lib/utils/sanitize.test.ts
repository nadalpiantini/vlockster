import { describe, it, expect } from 'vitest'
import { sanitizeHtml, sanitizeText, sanitizeObject } from './sanitize'

describe('sanitize', () => {
  describe('sanitizeHtml', () => {
    it('debe permitir tags básicos de formato', () => {
      const input = '<p>Texto <strong>negrita</strong> y <em>cursiva</em></p>'
      const result = sanitizeHtml(input)
      expect(result).toContain('<p>')
      expect(result).toContain('<strong>')
      expect(result).toContain('<em>')
    })

    it('debe eliminar scripts maliciosos', () => {
      const input = '<p>Texto</p><script>alert("XSS")</script>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert')
    })

    it('debe eliminar eventos onclick', () => {
      const input = '<p onclick="alert(\'XSS\')">Texto</p>'
      const result = sanitizeHtml(input)
      expect(result).not.toContain('onclick')
    })
  })

  describe('sanitizeText', () => {
    it('debe eliminar todo HTML', () => {
      const input = '<p>Texto <strong>negrita</strong></p>'
      const result = sanitizeText(input)
      expect(result).not.toContain('<')
      expect(result).not.toContain('>')
      expect(result).toContain('Texto')
      expect(result).toContain('negrita')
    })

    it('debe escapar caracteres especiales', () => {
      const input = '<script>alert("XSS")</script>'
      const result = sanitizeText(input)
      expect(result).not.toContain('<script>')
    })
  })

  describe('sanitizeObject', () => {
    it('debe sanitizar campos de texto especificados', () => {
      const obj = {
        name: '<p>Test Name</p>',
        bio: '<script>alert("XSS")</script>',
        age: 25,
      }

      const result = sanitizeObject(obj, ['name', 'bio'])

      expect(result.name).not.toContain('<')
      expect(result.bio).not.toContain('<script>')
      expect(result.age).toBe(25) // No debe cambiar
    })

    it('debe mantener campos no especificados sin cambios', () => {
      const obj = {
        name: '<p>Test</p>',
        other: '<p>Other</p>',
      }

      const result = sanitizeObject(obj, ['name'])

      expect(result.name).not.toContain('<')
      expect(result.other).toBe('<p>Other</p>') // No sanitizado
    })

    it('debe manejar objetos con campos null', () => {
      const obj = {
        name: '<p>Test</p>',
        bio: null,
      }

      const result = sanitizeObject(obj, ['name', 'bio'])

      expect(result.name).not.toContain('<')
      expect(result.bio).toBeNull()
    })
  })
})

